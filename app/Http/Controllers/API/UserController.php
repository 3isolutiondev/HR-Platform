<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\iMMAPerTrait;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;
use App\Models\Profile;
use App\Models\Attachment;
use App\Models\Role;
use App\Models\UserContractHistory;
use App\Models\ImmapOffice;
use App\Models\Setting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ImmapVerification;
use App\Mail\HiddenUserNotificationMail;
use App\Mail\HiddenUserNotificationMailFailed;
use App\Http\Controllers\SecurityModule\MRFRequestController;
use DB;
use DateTime;
use App\Traits\UserTrait;
use App\Traits\UserStatusTrait;
use App\Traits\SecurityModule\MRFTrait;
use App\Traits\DeleteAttachmentTrait;
use App\Mail\DeleteUserNotification;
use App\Mail\DeleteAccountConfirmationMail;
use App\Mail\RemoveAccountFailedMail;
use App\Mail\RemoveAccountHiddenFailedMail;
use App\Models\Country;
use App\Models\User;
use App\Notifications\MailResetPasswordNotification;
use App\Services\SurgePingService;
use App\TokenStore\TokenCache;
use GuzzleHttp\Client;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\File;
use phpDocumentor\Reflection\Types\Null_;

class UserController extends Controller
{
    use CRUDTrait, MRFTrait, DeleteAttachmentTrait, iMMAPerTrait, UserTrait, UserStatusTrait;

    const MODEL = 'App\Models\User';
    const SINGULAR = 'user';
    const USER_PAGINATE = 200;

    const PAGINATE = 5;
    const APPLICANT_PAGINATE = 20;

    const FILLABLE = [
        'first_name', 'middle_name', 'family_name', 'p11Status',
        'full_name', 'email', 'password', 'immap_email', 'access_platform'
    ];

    const UPDATE_FILLABLE = [
        'first_name', 'middle_name', 'family_name',
        'full_name', 'email', 'old_password', 'new_password',
        'immap_email', 'access_platform'
    ];

    const RULES = [
        'first_name' => 'required|string|max:255',
        'middle_name' => 'sometimes|nullable',
        'family_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|confirmed|string|min:6',
        'role' => 'required|array',
        'role.*.value' => 'required|integer|exists:roles,id',
        'role.*.label' => 'required|string|exists:roles,name',
        'immap_email' => 'sometimes|nullable|email|unique:users',
        'access_platform' => 'required|boolean'
    ];

    protected function updateRules($id)
    {
        $updateRules = self::RULES;
        $updateRules['email'] = 'required|string|email|max:255|unique:users,email,' . $id;
        $updateRules['change_password'] = 'sometimes|nullable|boolean';
        $updateRules['new_password'] = 'required_if:change_password,1|string|min:6|confirmed';
        $updateRules['role'] = 'sometimes|nullable|array';
        $updateRules['role.*.value'] = 'sometimes|nullable|integer|exists:roles,id';
        $updateRules['role.*.label'] = 'sometimes|nullable|string|exists:roles,name';
        $updateRules['immap_email'] = 'sometimes|nullable|email|unique:users,immap_email,' . $id;
        unset($updateRules['password']);

        return $updateRules;
    }

    const IMMAPERS_RULES = [
        'immap_email' => 'sometimes|nullable|email',
        'job_title' => 'required|string|max:255',
        'is_immap_inc' => 'required|boolean',
        'is_immap_france' => 'required|boolean',
        'duty_station' => 'required|string|max:255',
        'line_manager' => 'required|string|max:255',
        'start_of_current_contract' => 'required|date_format:Y-m-d',
        'end_of_current_contract' => 'required|date_format:Y-m-d',
        'immap_contract_international' => 'required|boolean',
        'under_sbp_program' => 'required|boolean',
        'project_code' => 'required|string',
        'immap_office' => 'required',
        'immap_office.value' => 'required|integer',
        'line_manager_id' => 'required|integer',
        'role' => 'sometimes|nullable|array',
        'role.*.value' => 'sometimes|nullable|integer|exists:roles,id',
        'role.*.label' => 'sometimes|nullable|string|exists:roles,name',
        'save_as_history' => 'required|boolean'
    ];

    protected function checkOldPassword($user, $oldPassword, $newPassword)
    {

        if (Hash::check($oldPassword, $user->password)) {
            return Hash::make($newPassword);
        }

        return null;
    }

    /**
     * @SWG\Get(
     *   path="/api/users",
     *   tags={"User"},
     *   summary="Get users data, with pagination, search and filter capabilities",
     *   description="File: app\Http\Controllers\API\UserController@index, permission:Index User",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="search", in="query", type="string", description="Search Keyword"),
     *   @SWG\Parameter(name="filter", in="query", type="string", description="Role Name"),
     *   @SWG\Parameter(
     *      name="status",
     *      in="query",
     *      type="array",
     *      @SWG\Items(
     *          type="string",
     *          enum={"Not Submitted", "Hidden", "Active", "Inactive"},
     *      ),
     *      description="Profile Status"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function index(Request $request)
    {
        $role = Role::where('name', $request->filter)->first();
        $validatedData = $this->validate($request, [
            'search' => 'sometimes|nullable|string',
            'filter' =>  [
                'sometimes',
                'nullable',
                function ($attribute, $value, $fail) use ($role) {
                    if (empty($role)) {
                        $fail($attribute . ' is required ' . $value);
                    }
                }
            ],
            'status' => 'sometimes|nullable|array',
            'status.*' => 'sometimes|nullable|in:Not Submitted,Active,Inactive,Hidden'
        ]);

        $users = $this->model::select('id', 'email', 'full_name', 'status', 'hidden_date', 'schedule_deletion_date', 'archived_user', 'access_platform');

        if (!empty($validatedData['search'])) {
            $users = $users->where(function ($query) use ($validatedData) {
                $query->search($validatedData['search'])
                    ->orWhere('email', 'like', '%' . $validatedData['search'] . '%');
            });
        }

        if (!empty($validatedData['status'])) {
            $users = $users->whereIn('status', $validatedData['status']);
        }

        if (!empty($validatedData['filter'])) {
            $users = $users->whereHas('roles', function ($query) use ($role) {
                $query->where(config('permission.table_names.roles') . '.id', $role->id);
            });
        }

        $users = $users->orderBy('users.created_at', 'desc')
            ->get()->paginate(self::USER_PAGINATE);


        if (!empty($users['data'])) {
            foreach ($users['data'] as $key => &$user) {
                $p11EmploymentRecords = $user->p11_employment_records;
                $user->job_title = !empty($p11EmploymentRecords) ? $p11EmploymentRecords->count() > 0 ? $p11EmploymentRecords->first()->job_title : "" : "";

                $role = implode(', ', Arr::pluck($user->roles, 'name'));
                $user->role = !empty($role) ? $role : '';
                $user->profile_id = $user->profile->id;

                unset($user['profile']);
                unset($user['p11_employment_records']);
            }
        }
        return response()->success(__('crud.success.default'), $users);
    }

    /**
     * @SWG\Post(
     *   path="/api/users/filter-user",
     *   tags={"User"},
     *   summary="Filter user profile completion status",
     *   description="File: app\Http\Controllers\API\UserController@filterUser, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="search", in="query", type="string", description="Search Keyword"),
     *   @SWG\Parameter(
     *      name="status",
     *      in="query",
     *      type="array",
     *      @SWG\Items(
     *          type="string",
     *          enum={"Not Submitted", "Hidden", "Active", "Inactive"},
     *      ),
     *      description="Profile Status"
     *   ),
     *   @SWG\Parameter(
     *      name="steps",
     *      in="query",
     *      type="array",
     *      @SWG\Items(
     *          type="integer",
     *          enum={"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"}
     *      ),
     *      description="Steps"
     *   ),
     *   @SWG\Parameter(
     *      name="roles",
     *      in="query",
     *      type="array",
     *      @SWG\Items(
     *          type="integer",
     *          enum={}
     *      ),
     *      description="Roles"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    function filterUser(Request $request)
    {

        $validatedData = $this->validate($request, [
            'search' => 'sometimes|nullable|string',
            'steps' => 'sometimes|nullable|array',
            'roles' => 'sometimes|nullable|array',
            'steps.*' => 'sometimes|nullable|in:1,2,3,4,5,6,7,8,9,10,11',
            'status' => 'sometimes|nullable|array',
            'status.*' => 'sometimes|nullable|in:Not Submitted,Active,Inactive,Hidden'
        ]);

        $users = $this->model::join('profiles', 'users.id', '=', 'profiles.user_id')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->select('users.email', 'users.id', 'users.full_name', 'users.p11Completed', 'users.status', 'users.archived_user', 'users.p11Status', 'profiles.id as profile_id', 'users.created_at as registrationDate');
        if (!empty($validatedData['search'])) {
            $users = $users->where(function ($q) use ($validatedData) {
                $q->search($validatedData['search'])
                    ->orWhere('users.email', 'like', '%' . $validatedData['search'] . '%');
            });
        }

        if (!empty($validatedData['status'])) {
            $users = $users->whereIn('status', $validatedData['status']);
        }

        if (!empty($validatedData['steps'])) {
            foreach ($validatedData['steps'] as $step) {
                $users = $users->where('users.p11Status->form' . $step, 1);
            }
        }

        if(!empty($validatedData['roles'])) {
            $users = $users->whereIn('model_has_roles.role_id', $validatedData['roles']);
        }

        $users = $users->orderBy('users.created_at', 'desc')
            ->get()->paginate(self::PAGINATE);


        if (!empty($users['data'])) {
            foreach ($users['data'] as $key => &$user) {
                $role = implode(', ', Arr::pluck($user->roles, 'name'));
                $user->role = !empty($role) ? $role : '';
            }
        }
        return response()->success(__('crud.success.default'), $users);
    }

    public function show($id)
    {
        $user = $this->model::with([
            'profile:id,user_id,is_immaper,verified_immaper',
            'roles:id as value,name as label'
        ])->findOrFail($id);
        $user->role = $user->roles;
        $userData = $user->setAttribute('isVerified', $user->hasVerifiedEmail() ? true : false);

        return response()->success(__('crud.success.default'), $userData);
    }

    /**
     * @SWG\Post(
     *   path="/api/users",
     *   tags={"User"},
     *   summary="Store user",
     *   description="File: app\Http\Controllers\API\UserController@store, Permission: Add User",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="users",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"first_name", "family_name", "email", "password", "role"},
     *           @SWG\Property(property="first_name", type="string", description="First name", example="John"),
     *           @SWG\Property(property="middle_name", type="string", description="Middle name, is not required though"),
     *           @SWG\Property(property="family_name", type="string", description="Family name", example="Doe"),
     *           @SWG\Property(property="email", type="string", description="Email address", example="johndoe@mail.com"),
     *           @SWG\Property(property="password", type="string", description="Password", example="Pass-123!"),
     *           @SWG\Property(property="access_platform", type="integer", enum={0,1}, description="for the iMMPer who doesn't access the iMMAP careers platform . (1 = access, 0 = not access)", example=0),
     *           @SWG\Property(
     *              property="role",
     *              type="array",
     *              description="Selected Role(s) from Frontend",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="integer", description="Role id", example=1),
     *                  @SWG\Property(property="label", type="string", description="Role name", example="User")
     *              )
     *           ),
     *           @SWG\Property(property="immap_email", type="string", description="iMMAP email (not required)", example="jdoe@organization.org")
     *       )
     *   )
     * )
     *
     */

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $userData = $request->only($this->fillable);

        $userData = $this->getFullName($userData);
        $userData['password'] = Hash::make($userData['password']);
        $userData['p11Status'] ='{"form1": 0, "form2": 0, "form3": 0, "form4": 0, "form5": 0, "form6": 0, "form7": 0, "form8": 0}';
        $record = $this->model::create($userData);
        $record->assignRole(Arr::pluck($request->role, 'label'));

        $profileData = [
            'first_name' => $record->first_name,
            'middle_name' => $record->middle_name,
            'family_name' => $record->family_name,
            'full_name' => $record->full_name,
            'email' => $record->email,
            'user_id' => $record->id,
            'selected_roster_process' => json_encode([])
        ];

        $profile = Profile::create($profileData);

        if ($record && $profile) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]));
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/users/{id}",
     *   tags={"User"},
     *   summary="Update user",
     *   description="File: app\Http\Controllers\API\UserController@update, Permission: Edit User",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="users",
     *       in="body",
     *       @SWG\Schema(
     *           required={"_method", "first_name", "family_name", "email", "old_password", "new_password"},
     *           @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *           @SWG\Property(property="first_name", type="string", description="First name", example="John"),
     *           @SWG\Property(property="middle_name", type="string", description="Middle name, is not required though"),
     *           @SWG\Property(property="family_name", type="string", description="Family name", example="Doe"),
     *           @SWG\Property(property="email", type="string", description="Email address", example="johndoe@mail.com"),
     *           @SWG\Property(property="change_password", type="integer", enum={0,1}, description="Change password", example=1),
     *           @SWG\Property(property="old_password", type="string", description="Old password (required if change_password = 1)", example="Pass-123!"),
     *           @SWG\Property(property="new_password", type="string", description="New password (required if change_password = 1)", example="Newpass-123!"),
     *           @SWG\Property(property="access_platform", type="integer", enum={0,1}, description="for the iMMPer who doesn't access the iMMAP careers platform . (1 = access, 0 = not access)", example=0),
     *           @SWG\Property(
     *              property="role",
     *              type="array",
     *              description="Selected Role(s) from Frontend",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="integer", description="Role id", example=1),
     *                  @SWG\Property(property="label", type="string", description="Role name", example="User")
     *              )
     *           ),
     *           @SWG\Property(property="immap_email", type="string", description="iMMAP email (not required)", example="jdoe@organization.org")
     *       )
     *   ),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      type="integer",
     *      description="User id"
     *   )
     * )
     *
     */
    public function update(Request $request, $id)
    {

        $validatedData = $this->validate($request, $this->updateRules($id));
        $userData = $request->only(self::UPDATE_FILLABLE);

        $userData = $this->getFullName($userData);
        $record = $this->model::findOrFail($id);
        if ($request->change_password == 1) {
            $userData['password'] = Hash::make($userData['new_password']);
            unset($userData['new_password']);
            $userTokens = $record->tokens;
            if (!empty($userTokens)) {
                foreach ($userTokens as $userToken) {
                    $userToken->revoke();
                }
            }
        }
        $record->syncRoles(Arr::pluck($validatedData['role'], 'label'));
        $updated = $record->fill($userData)->save();

        $this->removeUserAssignedCoutry($record);

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]));
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/users/{id}",
     *   tags={"User"},
     *   summary="Delete user",
     *   description="File: app\Http\Controllers\API\UserController@destroy, Permission: Delete User",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="User id"
     *    )
     * )
     *
     */
    public function destroy(Request $request, int $id, bool $fromApiCall = true)
    {
        $validatedData = $this->validate($request, ['notifyEmail' => 'required|boolean']);
        $user = $this->model::findOrFail($id);

        $name = $user->full_name;
        $email = $user->email;

        if ($fromApiCall) {
            if (auth()->user()->id === $user->id) {
                return response()->error(__('user.error.delete'), 422);
            }
        }

        $userTokens = $user->tokens;

        if (!empty($userTokens)) {
            foreach ($userTokens as $userToken) {
                $userToken->revoke();
                $userToken->delete();
            }
        }

        // Remove Cover Letter Files
        if (!empty($user->job_user)) {
            $this->deleteCoverLetter($user->job_user->toArray());
        }

        // Delete Document related to Domestic Travel Request (MRF)
        $domTravels = $user->domestic_travels;
        if (!empty($domTravels)) {
            foreach ($domTravels as $domTravel) {
                $this->deleteMRFItineraryFiles($domTravel->itineraries);
            }
        }

        if (!empty($user->profile)) {
            // Delete Document Related P11 Education Schools (Formal Training)
            $trainings = $user->profile->P11_education_schools;
            if (!empty($trainings)) {
                foreach ($trainings as $training) {
                    // delete attachment (certificate_file)
                    $this->deleteAttachment($training);
                }
            }

            // Delete Document Related P11 Education Universities
            $universities = $user->profile->p11_education_universities;
            if (!empty($universities)) {
                foreach ($universities as $university) {
                    // delete attachment (diploma_file)
                    $this->deleteAttachment($university);
                }
            }

            // Delete Document related to P11 Publications
            $publications = $user->profile->p11_publications;
            if (!empty($publications)) {
                foreach ($publications as $publication) {
                    $this->deleteAttachment($publication);
                }
            }

            // Delete Document related to P11 Porfolio
            $portfolios = $user->profile->p11_portfolios;
            if (!empty($portfolios)) {
                foreach ($portfolios as $portfolio) {
                    $this->deleteAttachment($portfolio);
                }
            }

            // Delete Document from IM Test Answers
            $imTestAnswers = $user->profile->im_test_answers;
            if (!empty($imTestAnswers)) {
                foreach ($imTestAnswers as $imTestAnswer) {
                    $this->deleteAttachment($imTestAnswer, 'file1Answer');
                    $this->deleteAttachment($imTestAnswer, 'file2Answer');
                    $this->deleteAttachment($imTestAnswer, 'file3Answer');
                }
            }

            // Delete Profile CV
            if (!is_null($user->profile->cv_id)) {
                $user->profile->p11_cv->delete();
            }
            // Delete Profile ID Card
            if (!is_null($user->profile->id_card_id)) {
                $user->profile->p11_id_card->delete();
            }
            // Delete Profile Passport
            if (!is_null($user->profile->passport_id)) {
                $user->profile->p11_passport->delete();
            }
            // Delete Profile Signature
            if (!is_null($user->profile->signature_id)) {
                $user->profile->p11_signature->delete();
            }

            $profileDeletion = $user->profile->delete();

            if (!$profileDeletion) {
                return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
            }
        }

        // Delete Document related to Job Interview
        $jobInterviewFiles = $user->user_interview_files;
        if (!empty($jobInterviewFiles)) {
            foreach ($jobInterviewFiles as $jobInterviewFile) {
                $this->deleteAttachment($jobInterviewFile);
            }
        }


        $deleted = $user->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        if ($validatedData['notifyEmail']) {
            Mail::to($email)->send(new DeleteUserNotification($name));

            if (Mail::failures()) {
                return response()->error(__('crud.error.default'), 500);
            }
        }

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\Get(
     *   path="/api/job-applications/{status_id}",
     *   tags={"User", "Job"},
     *   summary="Get user job application status",
     *   description="File: app\Http\Controllers\API\UserController@jobApplications, permission:Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="status_id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job status id"
     *    ),
     * )
     */
    public function jobApplications($status_id)
    {
        $userid = auth()->user()->id;
        $jobs = auth()->user()->jobs();

        $jobs = $jobs->wherePivot('job_status_id', $status_id)
            ->with([
                'country',
                // 'jobs.job_status'
                'job_user' => function ($q) use ($userid) {
                    return $q
                        ->where('user_id', $userid);
                },
                // 'job_user'
            ])
            ->get();

        return response()->success(__('crud.success.default'), $jobs);
    }

    /**
     * @SWG\Get(
     *   path="/api/users-statistic-p11-complete",
     *   tags={"User", "Dashboard"},
     *   summary="Get profile completion statistic",
     *   description="File: app\Http\Controllers\API\UserController@usersStatisticP11Complete, permission:Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function usersStatisticP11Complete()
    {
        // $total = $this->model::get()->count();
        // $p11_complete = $this->model::where('p11Completed', 1)->count();
        // $p11_not_complete = $this->model::where('p11Completed', 0)->count();
        // $color = ['#D50000', '#27AE60', '#be2126'];
        // $data['data'] = [$total, $p11_complete, $p11_not_complete];
        // $data['backgroundColor'] = $color;
        // $data['hoverBackgroundColor'] = $color;
        // $result['labels'] = ["Total User", "P11 Completed", "P11 Not Complete"];
        // $result['datasets'] = [$data];

        // // $result['datasets']['data'] = [$total, $p11_complete, $p11_not_complete];
        // // $result['datasets']['backgroundColor'] = $color;
        // // $result['datasets']['hoverBackgroundColor'] = $color;
        // return response()->success(__('crud.success.default'), $result);
        $p11_complete = $this->model::where('p11Completed', 1)->count();
        $p11_not_complete = $this->model::where('p11Completed', 0)->count();
        $color = ['#27AE60', '#be2126'];
        $data['data'] = [$p11_complete, $p11_not_complete];
        $data['backgroundColor'] = $color;
        $data['hoverBackgroundColor'] = $color;
        $result['labels'] = ["Profile Completed", "Profile Not Complete"];
        $result['datasets'] = [$data];
        $result['total'] = $p11_complete + $p11_not_complete;
        return response()->success(__('crud.success.default'), $result);
    }

    /**
     * @SWG\GET(
     *   path="/api/users/immap-verification/{id}",
     *   tags={"User"},
     *   summary="Send iMMAPer email verification",
     *   description="File: app\Http\Controllers\API\UserController@send_verification_immaper, Permission: Edit User",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Please complete your Already iMMAPer box in the Profile page"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="User id"
     *    ),
     * )
     *
     */
    public function send_verification_immaper($id)
    {
        $user = $this->model::findOrFail($id);

        if ($this->checkUnverifiedIMMAPerFromSelectedUser($user)) {
            Mail::to($user->profile->immap_email)->send(new ImmapVerification($user->full_name, $user->id));
        } elseif ($this->checkVerifiedIMMAPerFromSelectedUser($user)) {
            return response()->success(__('user.success.immaper_already_verified'), []);
        } else {
            return response()->error(__('user.error.immaper_data_not_complete'), 422);
        }
        return response()->success(__('user.success.immaper_verification_mail'), []);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-completed-users",
     *   tags={"User", "iMMAPer"},
     *   summary="Get a list of users who completed the profile",
     *   description="File: app\Http\Controllers\API\UserController@p11CompletedUsers, Permission: Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function p11CompletedUsers(Request $request)
    {
        $validatedData = $this->validate($request, ['search' => 'sometimes|nullable|string']);
            $users = $this->model::where('access_platform', 0)->join('profiles', 'profiles.user_id', '=', 'users.id')
                ->select(
                    'users.id',
                    'users.id as value',
                    DB::raw("CONCAT(`users`.`full_name`, ' - (', `users`.`email`, ')') as label"),
                    DB::raw("CONCAT(`users`.`full_name`, ' - (Already an iMMAPer)') as label_second"),
                    DB::raw("CONCAT(`users`.`full_name`, ' - (New contract request is being processed)') as label_third"),
                    'profiles.is_immaper as status'
                )->with('profile.interview_request_contract');

        if (!empty($validatedData['search'])) {
            $users = $users->where(function ($query) use ($validatedData) {
                $query->search($validatedData['search'])
                    ->orWhereRaw("UPPER(`users`.`email`) LIKE '%" . strtoupper($validatedData['search']) . "%'");
            });
        }

        $users = $users->get();

        return response()->success(__('crud.success.default'), $users);
    }

    /**
     * @SWG\Post(
     *   path="/api/add-immaper",
     *   tags={"User", "iMMAPer"},
     *   summary="Set user as an iMMAPer",
     *   description="File: app\Http\Controllers\API\UserController@addImmaper, permission:Edit Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="users",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"user", "is_immap_inc", "is_immap_france", "immap_email", "job_title",
     *              "duty_station", "line_manager", "start_of_current_contract", "end_of_current_contract",
     *              "immap_contract_international", "immap_office_id"},
     *           @SWG\Property(property="user", type="integer", description="User id", example=6),
     *           @SWG\Property(property="is_immap_inc", type="integer", enum={0,1}, description="Set the iMMAPer under iMMAP inc (0 = under iMMAP inc, 1 = not under iMMAP inc)", example=1),
     *           @SWG\Property(property="is_immap_france", type="integer", enum={0,1}, description="Set the iMMAPer under iMMAP France (0 = under iMMAP France, 1 = not under iMMAP France)", example=0),
     *           @SWG\Property(property="immap_email", type="string", description="iMMAP email address", example="jdoe@organization.org"),
     *           @SWG\Property(property="job_title", type="string", description="Job title in iMMAP", example="HR Officer"),
     *           @SWG\Property(property="duty_station", type="string", description="iMMAPer duty station", example="Washington DC"),
     *           @SWG\Property(property="line_manager", type="string", description="iMMAPer line manager", example="Mr. Manager"),
     *           @SWG\Property(property="start_of_current_contract", type="string", format="date", description="Start of current contract (date_format:Y-m-d)", example="2021-01-01"),
     *           @SWG\Property(property="end_of_current_contract", type="string", format="date", description="Start of current contract (date_format:Y-m-d)", example="2021-12-31"),
     *           @SWG\Property(property="immap_contract_international", type="integer", enum={0,1}, description="Set iMMAPer under international contract or not", example=1),
     *           @SWG\Property(property="under_sbp_program", type="integer", enum={0,1}, description="set iMMAPer as SBP member. (1 = SBP member, 0 = not SBP member)", example=1),
     *           @SWG\Property(property="project_code", type="string", description="Project code of iMMAPer", example="17676H"),
     *           @SWG\Property(property="immap_office_id", type="integer", description="iMMAP Office id", example=3)
     *       )
     *   )
     * )
     *
     */
    public function addImmaper(Request $request)
    {
        $validatedData = $this->validate($request, [
            'user' => 'required|integer|exists:users,id',
            'is_immap_inc' => 'required|boolean',
            'is_immap_france' => 'required|boolean',
            'immap_email' => 'sometimes|nullable|email',
            'job_title' => 'required|string',
            'duty_station' => 'required|string',
            'line_manager' => 'required|string',
            'line_manager_id' => 'required|integer',
            'start_of_current_contract' => 'required|date_format:Y-m-d',
            'end_of_current_contract' => 'required|date_format:Y-m-d',
            'immap_contract_international' => 'required|boolean',
            'under_sbp_program' => 'required|boolean',
            'project_code' => 'required|string',
            'immap_office_id' => 'required|integer|exists:immap_offices,id'
        ]);

        $user = $this->model::findOrFail($validatedData['user']);

        $user->immap_email = $validatedData['immap_email'];
        $user->status = 'Active';
        $user->inactive_user_has_been_reminded = 'false';
        $user->inactive_user_has_been_reminded_date = NULL;
        $user->inactive_date = NULL;
        $user->save();

        $saved = $user->profile->fill([
            'is_immap_inc' => $validatedData['is_immap_inc'],
            'is_immap_france' => $validatedData['is_immap_france'],
            'immap_email' => $validatedData['immap_email'],
            'job_title' => $validatedData['job_title'],
            'duty_station' => $validatedData['duty_station'],
            'line_manager' => $validatedData['line_manager'],
            'start_of_current_contract' => $validatedData['start_of_current_contract'],
            'end_of_current_contract' => $validatedData['end_of_current_contract'],
            'immap_contract_international' => $validatedData['immap_contract_international'],
            'immap_office_id' => $validatedData['immap_office_id'],
            'is_immaper' => 1,
            'verified_immaper' => 1,
            'line_manager_id' => $validatedData['line_manager_id'],
            'under_sbp_program' => $validatedData['under_sbp_program'],
            'project_code' => $validatedData['project_code']
        ])->save();

        if ($validatedData['under_sbp_program'] == 1) {
            $surgePing = new SurgePingService();
            $surgePing->Ping();
        }

        if (!$saved) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.default'), []);
    }

    /**
     * @SWG\Post(
     *   path="/api/immapers",
     *   tags={"User"},
     *   summary="Get iMMAPer list",
     *   description="File: app\Http\Controllers\API\UserController@immapers, permission:Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *         @SWG\Property(property="experience", type="integer", description="Work experience (in years)", example=2),
     *         @SWG\Property(
     *             property="choosen_language",
     *             type="array",
     *             description="Selected language data for filter the applicants",
     *             @SWG\Items(
     *                 type="object",
     *                 @SWG\Property(property="id", type="integer", description="Language id", example=1),
     *                 @SWG\Property(property="is_mother_tongue", type="integer", enum={0,1}, description="Is the language should be native language? (0 = no, 1 = yes)", example=0),
     *                 @SWG\Property(property="language_level", type="object", description="Language level for filter the applicants",
     *                      @SWG\Property(property="value", type="integer", description="Language level id", example=1)
     *                 )
     *              )
     *         ),
     *         @SWG\Property(
     *              property="choosen_country",
     *              type="array",
     *              description="Selected country data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Country id", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Working experience in specific country (year)", example=2)
     *              )
     *         ),
     *         @SWG\Property(
     *              property="chosen_sector",
     *              type="array",
     *              description="Selected sector data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Sector id", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Working experience in specific sector (year)", example=2)
     *              )
     *         ),
     *         @SWG\Property(
     *              property="chosen_skill",
     *              type="array",
     *              description="Selected skill data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Skill id", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Working experience in specific skill (year)", example=1),
     *                  @SWG\Property(property="rating", type="integer", description="Minimum rating / proficiency for this skill", example=3),
     *              )
     *         ),
     *         @SWG\Property(
     *              property="chosen_degree_level",
     *              type="array",
     *              description="Selected degree level data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Degree level id", example=1),
     *                  @SWG\Property(property="degree", type="string", description="Degree obtained", example="Bachelor of ..."),
     *                  @SWG\Property(property="study", type="string", description="Study", example="Computer science")
     *              )
     *         ),
     *         @SWG\Property(
     *              property="chosen_field_of_work",
     *              type="array",
     *              description="Selected area of expertise data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Area of expertise id", example=1)
     *              )
     *         ),
     *         @SWG\Property(
     *              property="chosen_nationality",
     *              type="array",
     *              description="Selected nationality data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Country id", example=1)
     *              )
     *         )
     *       )
     *   )
     * )
     *
     */
    public function immapers(Request $request)
    {
        $dutyStationFilters = $this->iMMAPerFromProfileQuery(Profile::select('duty_station'))->distinct('duty_station')->get()->pluck('duty_station')->all();
        $immapOffices = ImmapOffice::join('countries', 'countries.id', '=', 'immap_offices.country_id')->select('immap_offices.id', DB::raw('(CONCAT(countries.name, " - (", immap_offices.city , ")")) as office'))->get();
        $immapOfficeCities = $immapOffices->pluck('office')->all();
        $lineManagers = $this->iMMAPerFromProfileQuery(Profile::select('line_manager'))->distinct('line_manager')->get()->pluck('line_manager')->all();
        $role = Role::where('name', $request->role)->first();
        $currentUser = auth()->user();

        $validatedData = $this->validate($request, [
            'search' => 'sometimes|nullable|string',
            'station' => [
                'sometimes', 'nullable', 'string',
                function ($attribute, $value, $fail) use ($dutyStationFilters) {
                    if (!in_array($value, $dutyStationFilters)) {
                        $fail($attribute . ' is required ' . $value);
                    }
                }
            ],
            'office' => [
                'sometimes', 'nullable', 'string',
                function ($attribute, $value, $fail) use ($immapOfficeCities) {
                    if (!in_array($value, $immapOfficeCities)) {
                        $fail($attribute . ' is required ' . $value);
                    }
                }
            ],
            'manager' => [
                'sometimes', 'nullable', 'string',
                function ($attribute, $value, $fail) use ($lineManagers) {
                    if (!in_array($value, $lineManagers)) {
                        $fail($attribute . ' is required ' . $value);
                    }
                }
            ],
            'role' =>  [
                'sometimes',
                'nullable',
                function ($attribute, $value, $fail) use ($role) {
                    if (empty($role)) {
                        $fail($attribute . ' is required ' . $value);
                    }
                }
            ],
            'contract' => 'sometimes|nullable|string|in:Active,Not Active',
            'expire' => 'sometimes|nullable|string|in:Renew,Far from end of contract',
            'projectCode' => 'sometimes|nullable|string'
        ]);

        $users = $this->iMMAPerListQuery($this->model::join('profiles', 'profiles.user_id', '=', 'users.id')
            ->join('immap_offices', 'immap_offices.id', '=', 'profiles.immap_office_id')
            ->join('countries', 'countries.id', '=', 'immap_offices.country_id')
            ->leftJoin('users as lineManager', 'lineManager.id', '=', 'profiles.line_manager_id')
            ->select(
                'lineManager.full_name as line_manager_name',
                'users.id',
                'users.full_name',
                'users.first_name',
                'users.family_name',
                'users.archived_user',
                'profiles.id as profile_id',
                'profiles.immap_email',
                'profiles.job_title as job_position',
                'profiles.duty_station',
                'profiles.project_code',
                DB::raw("CONCAT(`countries`.`name`, ' - (', `immap_offices`.`city`, ')') AS 'immap_office'"),
                'profiles.line_manager',
                'profiles.start_of_current_contract',
                'profiles.end_of_current_contract',
                'profiles.paid_from',
                'profiles.project_task',
                'profiles.supervisor_id',
                'profiles.immap_office_id',
                'profiles.unanet_approver_id',
                'profiles.hosting_agency',
                'profiles.monthly_rate',
                'profiles.housing',
                'profiles.perdiem',
                'profiles.phone',
                'profiles.is_other',
                'profiles.not_applicable',
                'profiles.other',
                'profiles.cost_center',
                'profiles.currency',
                DB::raw("
                    IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL -1 MONTH) <= NOW()) AND (`profiles`.`end_of_current_contract` > NOW()), 'renew period',
                    IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL 30 DAY) >= NOW()) AND (`profiles`.`end_of_current_contract` <= NOW()), 'off-boarding queue',
                    IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL -30 DAY) > NOW()), 'active', 'not active'))) AS 'status_contract'
                "),
                DB::raw("IF((`profiles`.`end_of_current_contract` < DATE_ADD(NOW(), INTERVAL 1 MONTH)) AND (`profiles`.`end_of_current_contract` >= NOW()), 'renew', '') AS 'immap_contract'"),
                DB::raw("(SELECT `request_status` FROM `job_interview_request_contracts` WHERE `profiles`.`id` = `job_interview_request_contracts`.`profile_id` AND `request_status` = 'sent') AS 'request_status'")
            ));

        if (!$currentUser->hasPermissionTo('Set as Admin')) {
            $users->where('users.archived_user','no');
        }

        if (!empty($validatedData['search'])) {
            $users = $users->where(function ($query) use ($validatedData) {
                $query->search($validatedData['search'])
                    ->orWhere('profiles.immap_email', 'like', '%' . $validatedData['search'] . '%')
                    ->orWhere('profiles.job_title', 'like', '%' . $validatedData['search'] . '%');
            });
        }

        if (!empty($validatedData['station'])) {
            $users = $users->where('duty_station', $validatedData['station']);
        }

        if (!empty($validatedData['office'])) {
            $immapOfficeIds = $immapOffices->pluck('id')->all();
            $immapOfficeId = $immapOfficeIds[array_search($validatedData['office'], $immapOfficeCities)];
            if (!empty($immapOfficeId)) {
                $users = $users->where('immap_office_id', $immapOfficeId);
            }
        }

        if (!empty($validatedData['manager'])) {
            $users = $users->where('line_manager', $validatedData['manager']);
        }

        if (!empty($validatedData['contract'])) {
            if ($validatedData['contract'] == 'Active') {
                $users = $users->where('end_of_current_contract', '>', date('Y-m-d'));
            }

            if ($validatedData['contract'] == 'Not Active') {
                $users = $users->where('end_of_current_contract', '<', date('Y-m-d'));
            }
        }

        if (!empty($validatedData['role'])) {
            $users = $users->whereHas('roles', function ($query) use ($role) {
                $query->where(config('permission.table_names.roles') . '.id', $role->id);
            });
        }

        if (!empty($validatedData['projectCode'])) {
            $users = $users->where('profiles.project_code', $validatedData['projectCode']);
        }

        if (!empty($validatedData['expire'])) {
            $warningDate = new DateTime('now');
            $warningDate->modify('+1 month');
            $warningDate = $warningDate->format('Y-m-d');

            if ($validatedData['expire'] == 'Renew') {
                $users = $users->where('end_of_current_contract', '<', $warningDate)->where('end_of_current_contract', '>=', date('Y-m-d'));
            }

            if ($validatedData['expire'] == 'Far from end of contract') {
                $users = $users->where('end_of_current_contract', '>=', $warningDate);
            }
        }

        $users = $users->orderBy('users.updated_at', 'desc')
            ->get()->paginate(self::USER_PAGINATE);

        if (!empty($users['data'])) {
            foreach ($users['data'] as $key => &$user) {
                $role = implode(', ', Arr::pluck($user->roles, 'name'));
                $user->role = !empty($role) ? $role : '';
            }
        }

        return response()->success(__('crud.success.default'), $users);
    }


    /**
     * @SWG\GET(
     *   path="/api/immapers-value-label",
     *   tags={"User", "iMMAPer"},
     *   summary="Get list of iMMAPer in { value: 1, format: John Doe } format",
     *   description="File: app\Http\Controllers\API\UserController@immapers_value_label, Permission: Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function immapers_value_label(Request $request)
    {
        $profileIds = $this->iMMAPerFromProfileQuery(Profile::select('user_id'))->get()->pluck('user_id');
        $users = $this->model::select('id', 'full_name as label', 'immap_email as value', 'created_at')
            ->where('p11Completed', 1)->whereIn('id', $profileIds)
            ->orderBy('created_at', 'desc');

        if($request->has('forRoster')) {
            $users = $users->whereHas('roles', function ($query) {
                return $query->where('name', '=', 'admin')
                             ->orWhere('name', '=', 'SBPP Manager');
            });
        }
        $users = $users->get();


        return response()->success(__('crud.success.default'), $users);
    }

    /**
     * @SWG\GET(
     *   path="/api/immapers/{id}",
     *   tags={"User", "iMMAPer"},
     *   summary="Get specific iMMAPer data",
     *   description="File: app\Http\Controllers\API\UserController@immapers_show, Permission: Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *      @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="User id"
     *      )
     * )
     *
     */
    public function immapers_show($id)
    {
        $user = $this->model::select('id', 'full_name', 'p11Completed')->with([
            'roles:id as value,name as label'
        ])->findOrFail($id);

        $user['profile_id'] = $user->profile->id;
        $user['is_immap_inc'] = $user->profile->is_immap_inc;
        $user['is_immap_france'] = $user->profile->is_immap_france;
        $user['immap_email'] = $user->profile->immap_email;
        $user['job_title'] = $user->profile->job_title;
        $user['duty_station'] = $user->profile->duty_station;
        $user['line_manager'] = $user->profile->line_manager;
        $user['line_manager_id'] = $user->profile->line_manager_id;
        $user['start_of_current_contract'] = $user->profile->start_of_current_contract;
        $user['end_of_current_contract'] = $user->profile->end_of_current_contract;
        $user['is_immaper'] = $user->profile->is_immaper;
        $user['verified_immaper'] = $user->profile->verified_immaper;
        $user['immap_office_id'] = $user->profile->immap_office_id;
        $user['immap_contract_international'] = $user->profile->immap_contract_international;
        $user['under_sbp_program'] = $user->profile->under_sbp_program;
        $user['project_code'] = $user->profile->project_code;
        $user['role'] = $user->roles;

        if (!empty($user->profile->immap_office_id)) {
            $office = $user->profile->p11_immap_office;
            $user['immap_office'] = [
                'value' => $office->id,
                'label' => $office->country->name . ' - (' . $office->city . ')'
            ];
        } else {
            $user['immap_office'] = '';
        }
        unset($user->profile);

        return response()->success(__('crud.success.default'), $user);
    }

    /**
     * @SWG\POST(
     *   path="/api/immapers/{id}",
     *   tags={"User", "iMMAPer"},
     *   summary="Update iMMAPer data",
     *   description="File: app\Http\Controllers\API\UserController@immapers_update, permission:Edit Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="users",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"_method", "user", "is_immap_inc", "is_immap_france", "immap_email", "job_title",
     *              "duty_station", "line_manager", "start_of_current_contract", "end_of_current_contract",
     *              "immap_contract_international", "immap_office_id"},
     *           @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *           @SWG\Property(property="immap_email", type="string", description="iMMAP email address", example="jdoe@organization.org"),
     *           @SWG\Property(property="job_title", type="string", description="Job title in iMMAP", example="HR Officer"),
     *           @SWG\Property(property="is_immap_inc", type="integer", enum={0,1}, description="Set the iMMAPer under iMMAP inc (0 = under iMMAP inc, 1 = not under iMMAP inc)", example=1),
     *           @SWG\Property(property="is_immap_france", type="integer", enum={0,1}, description="Set the iMMAPer under iMMAP France (0 = under iMMAP France, 1 = not under iMMAP France)", example=0),
     *           @SWG\Property(property="duty_station", type="string", description="iMMAPer duty station", example="Washington DC"),
     *           @SWG\Property(property="line_manager", type="string", description="iMMAPer line manager", example="Mr. Manager"),
     *           @SWG\Property(property="start_of_current_contract", type="string", format="date", description="Start of current contract (date_format:Y-m-d)", example="2021-01-01"),
     *           @SWG\Property(property="end_of_current_contract", type="string", format="date", description="Start of current contract (date_format:Y-m-d)", example="2021-12-31"),
     *           @SWG\Property(property="immap_contract_international", type="integer", enum={0,1}, description="Set iMMAPer under international contract or not", example=1),
     *           @SWG\Property(property="under_sbp_program", type="integer", enum={0,1}, description="set iMMAPer as SBP member or not (1 = SBP member, 0 = not SBP member)", example=1),
     *           @SWG\Property(property="project_code", type="string", description="Project code of iMMAPer", example="17676H"),
     *           @SWG\Property(property="immap_office", type="object",
     *              @SWG\Property(property="value", type="integer", description="iMMAP office id", example=2)
     *           ),
     *           @SWG\Property(
     *              property="role",
     *              type="array",
     *              description="Selected Role(s) from Frontend",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="integer", description="Role id", example=1),
     *                  @SWG\Property(property="label", type="string", description="Role name", example="User")
     *              )
     *           )
     *       )
     *   ),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="User id"
     *   )
     * )
     *
     */
    public function immapers_update(Request $request, $id)
    {
        $validatedData = $this->validate($request, self::IMMAPERS_RULES);

        $record = $this->model::findOrFail($id);

        $record->immap_email = $validatedData['immap_email'];
        $record->status = 'Active';
        $record->inactive_user_has_been_reminded = 'false';
        $record->inactive_user_has_been_reminded_date = NULL;
        $record->inactive_date = NULL;
        $record->save();

        if($validatedData['save_as_history'] == true){
            UserContractHistory::create([
                'user_id' => $record->profile->user_id,
                'immap_email' => $record->profile->immap_email,
                'job_title' => $record->profile->job_title,
                'is_immap_inc' => $record->profile->is_immap_inc,
                'is_immap_france' => $record->profile->is_immap_france,
                'duty_station' => $record->profile->duty_station,
                'line_manager' => $record->profile->line_manager,
                'start_of_contract' => $record->profile->start_of_current_contract,
                'end_of_contract' => $record->profile->end_of_current_contract,
                'immap_contract_international' => $record->profile->immap_contract_international,
                'under_sbp_program' => $record->profile->under_sbp_program,
                'project_code' => $record->profile->project_code,
                'immap_office_id' => $record->profile->immap_office_id,
                'role' => $record->roles->pluck('name')->implode(', ')
            ]);
        }

        $record->syncRoles(Arr::pluck($validatedData['role'], 'label'));

        $updated = $record->profile->fill([
            'immap_email' => $validatedData['immap_email'],
            'job_title' => $validatedData['job_title'],
            'is_immap_inc' => $validatedData['is_immap_inc'],
            'is_immap_france' => $validatedData['is_immap_france'],
            'duty_station' => $validatedData['duty_station'],
            'line_manager' => $validatedData['line_manager'],
            'line_manager_id' => $validatedData['line_manager_id'],
            'start_of_current_contract' => $validatedData['start_of_current_contract'],
            'end_of_current_contract' => $validatedData['end_of_current_contract'],
            'immap_contract_international' => $validatedData['immap_contract_international'],
            'under_sbp_program' => $validatedData['under_sbp_program'],
            'project_code' => $validatedData['project_code'],
            'immap_office_id' => $validatedData['immap_office']['value']
        ])->save();

        $this->removeUserAssignedCoutry($record);

        if ($validatedData['under_sbp_program'] == 1) {
            $surgePing = new SurgePingService();
            $surgePing->Ping();
        }

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($updated) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record->profile);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/email/to",
     *   tags={"User"},
     *   summary="Get list of incomplete profile in {value: 2, email: johndoe@mail.com, label: johndoe@mail.com - (John Doe) } format",
     *   description="File: app\Http\Controllers\API\UserController@dashboard_email_to, permission:Index User",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function dashboard_email_to()
    {
        $users = $this->model::select('id', 'full_name', 'email')->where('p11Completed', 0)->get();
        $users = $users->map(function ($record, $key) {
            return collect([
                'value' => $record->id,
                'email' => $record->email,
                'label' => $record->email . ' - (' . $record->full_name . ')',
            ]);
        });
        return response()->success(__('crud.success.default'), $users);
    }

    /**
     * @SWG\GET(
     *   path="/api/email/immap",
     *   tags={"User"},
     *   summary="Get list of verified iMMAPer data in {value: 2, email: jdoe@organization.org, label: jdoe@organization.org - (John Doe) } format",
     *   description="File: app\Http\Controllers\API\UserController@dashboard_email_immap, permission:Index User|Edit Job|Add Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function dashboard_email_immap()
    {
        $profileIds = $this->iMMAPerFromProfileQuery(Profile::select('user_id'))->get()->pluck('user_id');
        $users = $this->model::select(
            'id as value',
            'immap_email as email',
            DB::raw("CONCAT(`immap_email`, ' - (', `full_name`, ')') as label")
        )
            ->whereIn('id', $profileIds)->orderBy('created_at', 'desc')->get();

        return response()->success(__('crud.success.default'), $users);
    }

    /**
     * @SWG\GET(
     *   path="/api/immapers-filter-data",
     *   tags={"User"},
     *   summary="Get filter data for iMMAPers List page",
     *   description="File: app\Http\Controllers\API\UserController@immapersFilterData, permission:Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function immapersFilterData()
    {

        $filterData = [
            'dutyStationFilters' => $this->iMMAPerFromProfileQuery(Profile::select('duty_station'))->distinct('duty_station')->get()->pluck('duty_station'),
            'immapOfficeFilters' => ImmapOffice::join('countries', 'countries.id', '=', 'immap_offices.country_id')->select(DB::raw('(CONCAT(countries.name, " - (", immap_offices.city , ")")) as office'))->get()->pluck('office'),
            'lineManagerFilters' => $this->iMMAPerFromProfileQuery(Profile::select('line_manager'))->distinct('line_manager')->get()->pluck('line_manager'),
            'projectCodeFilters' => Profile::whereNotNull('project_code')->select('project_code')->distinct('project_code')->get()->pluck('project_code'),
        ];

        return response()->success(__('crud.success.default'), $filterData);
    }

    /**
     * @SWG\GET(
     *   path="/api/users/line-managers",
     *   tags={"User", "Profile"},
     *   summary="Get line managers data needed in the platform",
     *   description="File: app\Http\Controllers\API\UserController@lineManagers, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="search", in="query", type="string", description="Search Keyword"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function lineManagers(Request $request)
    {
        $validatedData = $this->validate($request, ['search' => 'sometimes|nullable|string']);
        $currentUser = auth()->user();

        $lineManagers = $this->iMMAPerFromUserQuery($this->model::select('id', 'email', 'full_name')
            ->where('p11Completed', 1)
            ->permission('Set as Manager'));

        if (!$currentUser->hasPermissionTo('Set as Admin')) {
            $lineManagers = $lineManagers->where('id', '<>', $currentUser->id);
        }

        if (!empty($validatedData['search'])) {
            $lineManagers = $lineManagers->where(function ($query) use ($validatedData) {
                $query->search($validatedData['search']);
            });
        }

        $lineManagers = $lineManagers->with('profile:id,immap_email,user_id')->orderBy('users.created_at', 'desc')->get();

        return response()->success(__('crud.success.default'), $lineManagers);
    }

    public function set_microsoft_graph_token(Request $request)
    {
        $validatedData = $this->validate($request, [
            'code' => 'sometimes|nullable|string',
        ]);

        $client = new Client();
        $url = config('microsoft_graph.URL_ACCESS_TOKEN');
        $data = [
            'http_errors' => false,
            'form_params' => [
                'client_id' => config('microsoft_graph.CLIENT_ID'),
                'client_secret' => config('microsoft_graph.CLIENT_SECRET'),
                'scope' => config('microsoft_graph.SCOPES'),
                'grant_type' => 'authorization_code',
                'code' => $validatedData['code'],
                'redirect_uri' => config('microsoft_graph.REDIRECT_URI')
            ]
        ];

        $method = "POST";
        $res = $client->request($method, $url, $data);
        if($res) return response()->success(__('crud.success.default'), json_decode($res->getBody()->getContents()));
        else return response()->error('error', 500);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-delete-account-data",
     *   tags={"User", "Profile"},
     *   summary="Get Delete Account Request Data",
     *   description="File: app\Http\Controllers\API\UserController@getDeleteAccountData, Permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function getDeleteAccountData(bool $fromApi = true)
    {
        $authUser = auth()->user();
        $hasValidDeleteRequest = false;

        if ($authUser->delete_account_request == 'yes' && !is_null($authUser->delete_account_token_expired_at)) {
            if (DateTime::createFromFormat('Y-m-d H:i:s', $authUser->delete_account_token_expired_at) !== false) {
                if (new DateTime($authUser->delete_account_token_expired_at) > new DateTime()) {
                    $hasValidDeleteRequest = true;
                }
            }
        }

        if (!$fromApi) {
            return $hasValidDeleteRequest;
        }

        return response()->success(__('crud.success.default'), ['hasValidDeleteRequest' => $hasValidDeleteRequest]);
    }

    /**
     * @SWG\POST(
     *   path="/api/remove-account-request",
     *   tags={"User"},
     *   summary="Create Remove Account Request",
     *   description="File: app\Http\Controllers\API\UserController@removeAccountRequest, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function removeAccountRequest()
    {
        // Get the user
        $user = auth()->user();

        // Check if the user is not iMMAPer
        if (!$this->checkVerifiedIMMAPerFromSelectedUser($user)) {

            // Check if the user already create a remove account request and the token is exist
            if ($user->delete_account_request == "yes" && !is_null($user->delete_token_expired_at)) {
                // Check if the token still valid or not
                if (strtotime($user->delete_token_expired_at) > strtotime('Y-m-d H:i:s', '- 1 hours')) {
                    return response()->success(__('deleteAccount.checkEmail'));
                }
            }

            $tempUser = $user;
            $token = (string) Str::uuid();

            $user->delete_account_request = 'yes';
            $user->delete_account_request_time = date('Y-m-d H:i:s');
            $user->delete_account_token = $token;
            $user->delete_account_token_expired_at = date('Y-m-d H:i:s', strtotime('+ 1 hour'));
            $saved = $user->save();

            if (!$saved) {
                return response()->error(__('deleteAccount.generateTokenFailed'), 500, ['showMessage' => true]);
            }

            // send delete account confirmation email
            Mail::to($user->email)->send(new DeleteAccountConfirmationMail(
                $user->full_name,
                $user->email,
                $token,
                $this->checkUserIsMatchingShortlistedCriteria($user) || $this->checkWasIMMAPerFromSelectedUser($user) ? true : false
            ));


            // check if there is an email sending problem
            if (count(Mail::failures()) > 0) {
                // revert the old data
                $user->delete_account_request = $tempUser->delete_account_request;
                $user->delete_account_request_time = $tempUser->delete_account_request_time;
                $user->delete_account_token = $tempUser->delete_account_token;
                $user->delete_account_token_expired_at = $tempUser->delete_account_token_expired_at;
                $saved = $user->save();

                // send sending email error response to frontend
                return response()->error(__('deleteAccount.deleteAccountConfirmationMailFailed'), 500, ['showMessage' => true]);
            }

            // send delete account confirmation email success response to frontend
            return response()->success(__('deleteAccount.successSendConfirmationMail'));
        }

        // send response for an iMMAPer
        return response()->error(__('deleteAccount.forImmaper'), 422);
    }

    /**
     * @SWG\GET(
     *   path="/api/check-remove-account-token/{deleteAccountToken}",
     *   tags={"User"},
     *   summary="Check Remove Account Token Valid or not",
     *   description="File: app\Http\Controllers\API\UserController@checkRemoveAccountToken, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="deleteAccountToken",
     *      in="path",
     *      type="string",
     *      description="String token in uuid format"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function checkRemoveAccountToken($deleteAccountToken = '')
    {
        $checkedUser = $this->checkDeleteToken($deleteAccountToken);

        if (is_null($checkedUser)) {
            return response()->error(__('deleteAccount.invalidToken'), 500, [
                'hasValidDeleteRequest' => $this->getDeleteAccountData(false)
            ]);
        }

        return response()->success(__('deleteAccount.tokenValid'));
    }

    /**
     * @SWG\POST(
     *   path="/api/remove-account",
     *   tags={"User"},
     *   summary="Remove Account",
     *   description="File: app\Http\Controllers\API\UserController@removeAccount, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Invalid token"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error / Invalid token"),
     * )
     */
    public function removeAccount(Request $request)
    {
        $validatedData = $this->validate($request, ['deleteAccountToken' => 'required|string']);
        $checkedUser = $this->checkDeleteToken($validatedData['deleteAccountToken']);

        if (is_null($checkedUser)) {
            return response()->error(__('deleteAccount.invalidToken'), 500, [
                'hasValidDeleteRequest' => $this->getDeleteAccountData(false)
            ]);
        }

        // check if the user is iMMAPer
        if ($this->checkIMMAPerFromSelectedUser($checkedUser)) {
            return response()->error(__('deleteAccount.forImmaper'), 422);
        }

        // check if the user is shortlisted or was an iMMAPer
        if ($this->checkUserIsMatchingShortlistedCriteria($checkedUser) || $this->checkWasIMMAPerFromSelectedUser($checkedUser)) {
            $tempUser = clone $checkedUser;
            $hiddenDate = date('Y-m-d H:i:s');
            $retentionPeriods = config('hr.retention_periods') ? config('hr.retention_periods') : 5;
            $scheduleDeletionDate = date('Y-m-d H:i:s', strtotime("+ {$retentionPeriods} years"));

            $checkedUser->status = 'Hidden';
            $checkedUser->hidden_date = $hiddenDate;
            $checkedUser->schedule_deletion_date = $scheduleDeletionDate;
            $hiddenSaved = $checkedUser->save();

            if (!$hiddenSaved) {
                Mail::to(env('SCRIPT_MAIL_TO'))->send(new RemoveAccountHiddenFailedMail($tempUser));
                return response()->error(__('deleteAccount.removeAccountError'), 500, [
                    'showMessage' => true
                ]);
            }

            if ($tempUser->status === 'Active') {
                $hiddenProfileRecipients = Setting::select('value')->where('slug', 'hidden-profile-recipients')->first();

                if (!empty($hiddenProfileRecipients)) {
                    $hiddenProfileRecipients = explode("\n", $hiddenProfileRecipients->value);
                    if (count($hiddenProfileRecipients) > 0) {
                        Mail::to($hiddenProfileRecipients)->send(new HiddenUserNotificationMail($tempUser->full_name));

                        if (Mail::failures()) {
                            Log::error("Hidden User Recipient Mail Failed for $tempUser->full_name");
                            Mail::to(env('SCRIPT_MAIL_TO'))->send(new HiddenUserNotificationMailFailed($tempUser->full_name));
                        }
                    }
                }
            }

            return response()->success(__('deleteAccount.removeAccountSuccess'));
        }

        $deleteRequest = new Request();
        $deleteRequest['notifyEmail'] = false;
        $response = $this->destroy($deleteRequest, $checkedUser->id, false);
        $responseBody = $response->getData();

        if ($responseBody->status !== 'success') {
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new RemoveAccountFailedMail($checkedUser));
            return response()->error(__('deleteAccount.removeAccountError'), 500, [
                'showMessage' => true
            ]);
        }

        return response()->success(__('deleteAccount.removeAccountSuccess'));
    }

    // Function to check delete account token is valid or not for current logged in user,
    // It return the user with valid token otherwise it will return error response
    protected function checkDeleteToken($token = '') {
        $user = auth()->user();

        $checkedUser = $this->model::where('id', $user->id)
                        ->where('delete_account_token', $token)
                        ->where('delete_account_token_expired_at', '>', date('Y-m-d H:i:s'))
                        ->first();

        return $checkedUser;
    }

     /**
     * @SWG\GET(
     *   path="/api/contract-history/{id}",
     *   tags={"User", "iMMAPer"},
     *   summary="Get contract history for a specific iMMAPer",
     *   description="File: app\Http\Controllers\API\UserController@contractHistory, Permission: Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *      @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="User id"
     *      )
     * )
     *
     */
    public function contractHistory($id)
    {
        $histories = UserContractHistory::where('user_id', $id)->with(['immap_office:id,city'])->get();

        return response()->success(__('crud.success.default'), $histories);
    }

    public function removeUserAssignedCoutry(User $user)
    {
        if (!$user->hasPermissionTo('Approve Domestic Travel Request') || !$user->hasPermissionTo('View Other Travel Request')) {
            $user->officer_country()->detach();
        }
    }

    /**
     * @SWG\POST(
     *   path="/api/change-line-manager/{user_id}",
     *   tags={"User", "iMMAPer"},
     *   summary="Change line manager for a specific iMMAPer",
     *   description="File: app\Http\Controllers\API\UserController@changeLineManager, permission:Edit Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="users",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"line_manager_id", "line_manager_name"},
     *           @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *           @SWG\Property(property="line_manager_id", type="integer", enum={0,1}, description="Set line manager", example=12),
     *           @SWG\Property(property="line_manager_name", type="string", description="Name of line manager", example="John Doe"),
     *       )
     *   ),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="User id"
     *   )
     * )
     *
     */
    public function changeLineManager(Request $request, int $id)
    {
        $validatedData = $this->validate($request, [
            'line_manager_id' => 'required|integer',
            'line_manager_name' => 'required|string',
        ]);

        $user = $this->model::findOrFail($id);

        $saved = $user->profile->fill([
            'line_manager' => $validatedData['line_manager_name'],
            'line_manager_id' => $validatedData['line_manager_id'],
        ])->save();

        return response()->success(__('crud.success.default'));
    }

    /**
     * @SWG\Post(
     *   path="/api/get-immapers-by-filter",
     *   tags={"User"},
     *   summary="Get iMMAPer list by filter",
     *   description="File: app\Http\Controllers\API\UserController@getImmapersByFilter, permission:Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *         @SWG\Property(property="search", type="string", description="Search an iMMAPer", example="Joe Doe"),
     *         @SWG\Property(property="contract_expire_date", format="date", type="string", description="Contrat expired date [Date format: 2020-12-10] (Can be empty)", example="2020-11-17"),
     *         @SWG\Property(
     *              property="duty_station",
     *              type="array",
     *              description="Selected duty station data for filter the iMMAPers",
     *              @SWG\Items(
     *                  @SWG\Property(property="station", type="string", description="Duty station", example="iMMAP HQ")
     *              )
     *         ),
     *         @SWG\Property(
     *              property="immap_office",
     *              type="array",
     *              description="Selected immap office for filter the iMMAPers",
     *              @SWG\Items(
     *                  @SWG\Property(property="office", type="string", description="Immap Office", example="Marseille"),
     *              )
     *         ),
     *         @SWG\Property(
     *              property="line_manager",
     *              type="array",
     *              description="Selected line manager data for filter the iMMAPers",
     *              @SWG\Items(
     *                  @SWG\Property(property="manager", type="string", description="Line Manager name", example="Joe Bloggs")
     *              )
     *         ),
     *         @SWG\Property(
     *              property="status_contract",
     *              type="array",
     *              description="Selected status contract data for filter the iMMApers",
     *              @SWG\Items(
     *                  @SWG\Property(property="status", type="string", description="Status of Contract", example="Active")
     *              )
     *         ),
     *         @SWG\Property(
     *              property="project_code",
     *              type="array",
     *              description="Selected project code data for filter the iMMApers",
     *              @SWG\Items(
     *                  @SWG\Property(property="code", type="string", description="Project code", example="JHWS76")
     *              )
     *         )
     *       )
     *   )
     * )
     *
     */
    public function getImmapersByFilter(Request $request)
    {
        $dutyStationFilters = $this->iMMAPerFromProfileQuery(Profile::select('duty_station'))->distinct('duty_station')->get()->pluck('duty_station')->all();
        $immapOffices = ImmapOffice::join('countries', 'countries.id', '=', 'immap_offices.country_id')->select('immap_offices.id', DB::raw('(CONCAT(countries.name, " - (", immap_offices.city , ")")) as office'))->get();
        $immapOfficeCities = $immapOffices->pluck('office')->all();
        $lineManagers = $this->iMMAPerFromProfileQuery(Profile::select('line_manager'))->distinct('line_manager')->get()->pluck('line_manager')->all();
        $role = Role::where('name', $request->role)->first();
        $currentUser = auth()->user();

        $validatedData = $this->validate($request, [
            'search' => 'sometimes|nullable|string',
            'contract_expire_date' => 'sometimes|nullable|date',
            'duty_station' =>  'sometimes|nullable|array',
            'immap_office' =>  'sometimes|nullable|array',
            'line_manager' =>  'sometimes|nullable|array',
            'status_contract' => 'sometimes|nullable|array|in:Active,Not Active',
            'project_code' => 'sometimes|nullable|array',
        ]);

        $users = $this->iMMAPerListQuery($this->model::join('profiles', 'profiles.user_id', '=', 'users.id')
        ->join('immap_offices', 'immap_offices.id', '=', 'profiles.immap_office_id')
        ->join('countries', 'countries.id', '=', 'immap_offices.country_id')
        ->leftJoin('users as lineManager', 'lineManager.id', '=', 'profiles.line_manager_id')
        ->select(
            'lineManager.full_name as line_manager_name',
            'users.id',
            'users.full_name',
            'users.first_name',
            'users.family_name',
            'users.archived_user',
            'profiles.id as profile_id',
            'profiles.immap_email',
            'profiles.job_title as job_position',
            'profiles.duty_station',
            'profiles.project_code',
            DB::raw("CONCAT(`countries`.`name`, ' - (', `immap_offices`.`city`, ')') AS 'immap_office'"),
            'profiles.line_manager',
            'profiles.start_of_current_contract',
            'profiles.end_of_current_contract',
            'profiles.paid_from',
            'profiles.project_task',
            'profiles.supervisor_id',
            'profiles.immap_office_id',
            'profiles.unanet_approver_id',
            'profiles.hosting_agency',
            'profiles.monthly_rate',
            'profiles.housing',
            'profiles.perdiem',
            'profiles.phone',
            'profiles.is_other',
            'profiles.not_applicable',
            'profiles.other',
            'profiles.cost_center',
            'profiles.currency',
            DB::raw("
                IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL -1 MONTH) <= NOW()) AND (`profiles`.`end_of_current_contract` > NOW()), 'renew period',
                IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL 30 DAY) >= NOW()) AND (`profiles`.`end_of_current_contract` <= NOW()), 'off-boarding queue',
                IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL -30 DAY) > NOW()), 'active', 'not active'))) AS 'status_contract'
            "),
            DB::raw("IF((`profiles`.`end_of_current_contract` < DATE_ADD(NOW(), INTERVAL 1 MONTH)) AND (`profiles`.`end_of_current_contract` >= NOW()), 'renew', '') AS 'immap_contract'"),
            DB::raw("(SELECT `request_status` FROM `job_interview_request_contracts` WHERE `profiles`.`id` = `job_interview_request_contracts`.`profile_id` AND `request_status` = 'sent') AS 'request_status'")
        ));

    if (!$currentUser->hasPermissionTo('Set as Admin')) {
        $users->where('users.archived_user','no');
    }

        if (!empty($validatedData['search'])) {
            $users = $users->where(function ($query) use ($validatedData) {
                $query->search($validatedData['search'])
                    ->orWhere('profiles.immap_email', 'like', '%' . $validatedData['search'] . '%')
                    ->orWhere('profiles.job_title', 'like', '%' . $validatedData['search'] . '%');
            });
        }

        if (!empty($validatedData['duty_station'])) {
            $users = $users->whereIn('duty_station', $validatedData['duty_station']);
        }

        if (!empty($validatedData['immap_office'])) {
            $officeIds = [];
            $immapOfficeIds = $immapOffices->pluck('id')->all();
            foreach ($validatedData['immap_office'] as $key => $value) {
                $immapOfficeId = $immapOfficeIds[array_search($value, $immapOfficeCities)];
                array_push($officeIds, $immapOfficeId);
            }

            if (count($officeIds) > 0) {
                $users = $users->whereIn('immap_office_id', $officeIds);
            }
        }

        if (!empty($validatedData['line_manager'])) {
            $users = $users->whereIn('line_manager', $validatedData['line_manager']);
        }

        if (count($validatedData['status_contract']) > 0) {
            if(count($validatedData['status_contract']) == 2) {
                $users =  $users->where(function($query) use ($validatedData) {
                    $query->where('end_of_current_contract', '>', date('Y-m-d'))
                        ->orWhere('end_of_current_contract', '<', date('Y-m-d'));
                });
            } else {
                 if ($validatedData['status_contract'][0] == 'Active') {
                    $users = $users->where('end_of_current_contract', '>', date('Y-m-d'));
                }

                if ($validatedData['status_contract'][0] == 'Not Active') {
                    $users = $users->where('end_of_current_contract', '<', date('Y-m-d'));
                }
            }
        }

        if (!empty($validatedData['project_code'])) {
            $users = $users->whereIn('profiles.project_code', $validatedData['project_code']);
        }

        if (!empty($validatedData['contract_expire_date'])) {
            $users = $users->where('end_of_current_contract', '=', $validatedData['contract_expire_date']);
        }

        $users = $users->orderBy('users.updated_at', 'desc')
            ->get()->paginate(self::USER_PAGINATE);

        if (!empty($users['data'])) {
            foreach ($users['data'] as $key => &$user) {
                $role = implode(', ', Arr::pluck($user->roles, 'name'));
                $user->role = !empty($role) ? $role : '';
            }
        }

        return response()->success(__('crud.success.default'), $users);
    }
      /**
     * @SWG\GET(
     *   path="/api/immapers-by-line-manager",
     *   tags={"User", "iMMAPer"},
     *   summary="Get iMMAPers by line manager",
     *   description="File: app\Http\Controllers\API\UserController@getImmapersByLineManager, Permission: Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    public function getImmapersByLineManager()
    {
        $currentUser = auth()->user();
        // Show list of the staff who is off-boarding period, renew period and active one
        $users = $this->iMMAPerListQuery($this->model::join('profiles', 'profiles.user_id', '=', 'users.id')
        ->join('immap_offices', 'immap_offices.id', '=', 'profiles.immap_office_id')
        ->join('countries', 'countries.id', '=', 'immap_offices.country_id')
        ->where('profiles.line_manager_id', $currentUser->id)
        ->whereDate('profiles.end_of_current_contract', '>', date('Y-m-d', strtotime('-30 day', strtotime(date('Y-m-d')))))
        ->select(
            'users.id',
            'users.full_name',
            'users.first_name',
            'users.family_name',
            'users.archived_user',
            'profiles.id as profile_id',
            'profiles.immap_email',
            'profiles.job_title as job_position',
            'profiles.duty_station',
            'profiles.project_code',
            DB::raw("CONCAT(`countries`.`name`, ' - (', `immap_offices`.`city`, ')') AS 'immap_office'"),
            'profiles.line_manager',
            'profiles.start_of_current_contract',
            'profiles.end_of_current_contract',
            'profiles.paid_from',
            'profiles.project_task',
            'profiles.supervisor_id',
            'profiles.immap_office_id',
            'profiles.unanet_approver_id',
            'profiles.hosting_agency',
            'profiles.monthly_rate',
            'profiles.housing',
            'profiles.perdiem',
            'profiles.phone',
            'profiles.is_other',
            'profiles.not_applicable',
            'profiles.other',
            'profiles.cost_center',
            'profiles.currency',
            DB::raw("
                IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL -1 MONTH) <= NOW()) AND (`profiles`.`end_of_current_contract` > NOW()), 'renew period',
                IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL 30 DAY) >= NOW()) AND (`profiles`.`end_of_current_contract` <= NOW()), 'off-boarding queue',
                IF((DATE_ADD(`profiles`.`end_of_current_contract`, INTERVAL -30 DAY) > NOW()), 'active', 'not active'))) AS 'status_contract'
                "),
            DB::raw("IF((`profiles`.`end_of_current_contract` < DATE_ADD(NOW(), INTERVAL 30 DAY)) AND (`profiles`.`end_of_current_contract` >= NOW()), 'renew', '') AS 'immap_contract'"),
            DB::raw("(SELECT `request_status` FROM `job_interview_request_contracts` WHERE `profiles`.`id` = `job_interview_request_contracts`.`profile_id` AND `request_status` = 'sent') AS 'request_status'")
        ))->get();

        return response()->success(__('crud.success.default'), $users);
    }

    /**
     * @SWG\Post(
     *   path="/api/import-immapers",
     *   tags={"Import iMMAPers via csv file", "iMMAPer"},
     *   summary="Importing iMMAPers via csv file",
     *   description="File: app\Http\Controllers\API\UserController@importImmapers, Permission: Edit Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="file",
     *          in="formData",
     *          required=true,
     *          type="file",
     *          description="Photo in Image Format [jpg,jpeg,png,webp,JPG,PNG,JPEG]",
     *      ),
     *   @SWG\Parameter(
     *          name="collection_name",
     *          in="formData",
     *          type="string",
     *          description="Collection Name to be stored on Media Table",
     *          enum={"photos"},
     *          default="photos"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function importImmapers(Request $request)
    {
        $validatedData = $this->validate($request, ['file' => 'required']);
        $extension = File::extension($request->file->getClientOriginalName());
        $addedCount = 0;
        $alreadyExist = 0;

        if ($extension == "xlsx" || $extension == "xls" || $extension == "csv") {
            $file = $request->file('file');
            $data = Excel::toArray([], $file)[0];

            $countValidation = count($this->ValidationDataInFile($data[0]));
            if ($countValidation !=0) {
                $dataMissed = implode(", ", $this->validationDataInFile($data[0]));
                if ($countValidation >= 2) {
                    return response()->error("The '$dataMissed' columns are missing in the uploaded file.", 422);
                } else {
                    return response()->error("The '$dataMissed' column is missing in the uploaded file.", 422);
                }
            }

            $propertyNames = $data[0];
            $values = array_slice($data, 1);
            $immapers = array_map(function ($row) use ($propertyNames) {
                return array_combine($propertyNames, $row);
            }, $values);

            if ($this->checkIfDataExiste($immapers) != null) {
                return $this->checkIfDataExiste($immapers);
            }

            foreach ($immapers as $immaper){
                $user = User::where('email', $immaper['personal_email'])->orWhere('immap_email', $immaper['immap_email'])->first();

                if (!$user) {
                    $role = Role::where('name', $immaper['careers_access_level'])->first();
                    $lineManager = User::where('immap_email', $immaper['line_manager_immap_email'])->first();
                    $nationalityCountry = Country::where('name', $immaper['nationality'])->first();
                    $immapOffice = ImmapOffice::where('city', $immaper['immap_office'])->first();

                    $userData = [
                        "first_name" => $immaper['first_name'],
                        "middle_name" => $immaper['middle_name'],
                        "family_name" => $immaper['family_name'],
                        "email" => $immaper['personal_email'],
                        "immap_email" => $immaper['immap_email'],
                        "status" => "Active",
                        "inactive_user_has_been_reminded" => "false",
                        "inactive_user_has_been_reminded_date" => NULL,
                        "inactive_date" => NULL,
                        "p11Completed" => true
                    ];

                    $userData = $this->getFullName($userData);
                    $userData['password'] = Hash::make(env('NEW_IMMPAER_DEFAULT_PASSWORD'));
                    $userData['p11Status'] ='{"form1": 0, "form2": 0, "form3": 0, "form4": 0, "form5": 0, "form6": 0, "form7": 0, "form8": 0}';
                    $record = $this->model::create($userData);
                    $record->assignRole([$role->id]);

                    $profileData = [
                        "first_name" => $immaper['first_name'],
                        "middle_name" => $immaper['middle_name'],
                        "family_name" => $immaper['family_name'],
                        "email" => $immaper['personal_email'],
                        "full_name" => $userData['full_name'],
                        "immap_email" => $immaper['immap_email'],
                        "job_title" => $immaper['job_title'],
                        "duty_station" => $immaper['duty_station'],
                        "start_of_current_contract" => $immaper['start_of_contract'],
                        "end_of_current_contract" => $immaper['end_of_contract'],
                        "project_code" => $immaper['project_code'],
                        "under_sbp_program" => $immaper['under_surge_program'] == 'Yes' ? true : false,
                        "team" => $immaper['team'],
                        "contract_type" => $immaper['contract_type'],
                        "is_immaper" => 1,
                        "verified_immaper" => 1,
                        "selected_roster_process" => json_encode([]),
                        "user_id" => $record->id,
                        "immap_office_id" => $immapOffice->id
                    ];

                    if ($immaper['contract_type'] == 'International' || $immaper['contract_type'] == 'HQ US Employee' || $immaper['contract_type'] == 'HQ FR Employee') {
                        $profileData['immap_contract_international'] = true;
                    } else {
                        $profileData['immap_contract_international'] = false;
                    }

                    if ($immaper['hq'] == 'US'){
                        $profileData['is_immap_inc'] = true;
                        $profileData['is_immap_france'] = false;

                     } else if ($immaper['hq'] == 'France') {
                        $profileData['is_immap_france'] = true;
                        $profileData['is_immap_inc'] = false;
                     } else {
                        $profileData['is_immap_inc'] = true;
                        $profileData['is_immap_france'] = true;
                     }

                     $profileData['line_manager'] = $lineManager->full_name;
                     $profileData['line_manager_id'] = $lineManager->id;

                     if ($immaper['gender'] == 'Male') {
                         $profileData['gender'] = 1;
                     } else if ($immaper['gender'] == 'Female') {
                         $profileData['gender'] = 0;
                     } else {
                         $profileData['gender'] = 2;
                     }

                    $profile = Profile::create($profileData);
                    $this->syncNationalitiesData($profile, [$nationalityCountry->id], 'present');
                    $addedCount++;
                } else {
                    $alreadyExist++;
                }
            }
        }else {
            return response()->error(__('file.error.excel_exentions_not_match'), 422);
        }

        $message = "Importing Successefully done, Result: New Immaper added: '$addedCount' and Immaper already exist: '$alreadyExist'";
        return response()->success($message);
    }

    private function validationDataInFile($headers)
    {
        $requiredHeaders = [
            'first_name',
            'middle_name',
            'family_name',
            'personal_email',
            'immap_email',
            'careers_access_level',
            'line_manager_immap_email',
            'nationality',
            'immap_office',
            'job_title',
            'duty_station',
            'start_of_contract',
            'end_of_contract',
            'project_code',
            'team',
            'contract_type',
            'under_surge_program',
            'gender',
            'hq',
        ];
        $missedData =  [];
        foreach ($requiredHeaders as $header) {
            if (!in_array($header, $headers)) {
               array_push($missedData, $header);
            }
        }

        return $missedData;

    }

    private function checkIfDataExiste($immapers)
    {
        foreach ($immapers as $immaper) {
            $name = $immaper['first_name'] .' '.  $immaper['family_name'];

            $role = Role::where('name', $immaper['careers_access_level'])->first();
            if (!$role) {
                return response()->error(__('validation.exists', ['attribute' => "role for '$name'"]), 422);
            }

            $lineManager = User::where('immap_email', $immaper['line_manager_immap_email'])->first();
            if (!$lineManager) {
                return response()->error(__('validation.exists', ['attribute' => "line manager for '$name'"]), 422);
            }

            $nationalityCountry = Country::where('name', $immaper['nationality'])->first();
            if (!$nationalityCountry) {
                return response()->error(__('validation.exists', ['attribute' => "nationality country for '$name'"]), 422);
            }

            $immapOffice = ImmapOffice::where('city', $immaper['immap_office'])->first();
            if (!$immapOffice) {
                return response()->error(__('validation.exists', ['attribute' => "IMMAP office for '$name'"]), 422);
            }
        }
        return null;
    }

    private function syncNationalitiesData($profile, $nationalities, $time)
    {
        if (count($nationalities)) {
            $nationalities = array_map(function ($val) use ($time) {
                return ['time' => $time];
            }, array_flip($nationalities));
            $profile->present_nationalities()->sync($nationalities);
        }
    }

}
