<?php

namespace App\Http\Controllers\API\ThirdPartyClient;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\JobInterviewRequestContract;
use App\Models\Profile;
use App\Models\ThirdPartyClient\ThirdPartyClient;
use App\Models\UserContractHistory;
use App\Rules\StrongPassword;
use App\Services\SurgePingService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class ThirdPartyClientController extends Controller
{

     /**
     * @SWG\Post(
     *   path="/api/third-party/register",
     *   tags={"Third Party Client"},
     *   summary="Register third party client",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@register",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="register",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *         required={"username","password", "permissions"},
     *          @SWG\Property(property="username", type="string", description="Username", example="johndoe"),
     *          @SWG\Property(property="password", type="string", description="Password", example="Pass-123456789!"),
     *          @SWG\Property(property="permissions", type="array", description="Permissions",
     *                @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="label", type="string", description="Name of permission", example="Manage Onboarding List Sharepoint"),
     *                      @SWG\Property(property="value", type="string", description="Value of permission", example="Manage Onboarding List Sharepoint"),
     *                  )
     *              ),
     *          )
     *      )
     *   )
     * )
     */
    public function register(Request $request)
    {
        $validatedData = $this->validate($request, [
            'username' => 'required|string|min:5|unique:third_party_clients',
            'password' => [
                'required',
                'min:12',
                new StrongPassword
            ],
            'permissions' => 'required|array'
        ]);

        $client = new ThirdPartyClient();
        $client->username = $validatedData['username'];
        $client->password = Hash::make($validatedData['password']);
        $client->save();

        foreach ($validatedData['permissions'] as $permission) {
            $client->thirdPartyPermissions()->create([
                'name' => $permission['value']
            ]);
        }

        return response()->success(__('crud.success.default'));
    }

     /**
     * @SWG\Post(
     *   path="/api/third-party/{id}",
     *   tags={"Third Party Client"},
     *   summary="Update third party client",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@update",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="update",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"username","permissions"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="username", type="string", description="Username", example="johndoe"),
     *          @SWG\Property(property="password", type="string", description="Password", example="Pass-123456789!"),
     *           @SWG\Property(property="permissions", type="array", description="Permissions",
     *                @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="label", type="string", description="Name of permission", example="Manage Onboarding List Sharepoint"),
     *                      @SWG\Property(property="value", type="string", description="Value of permission", example="Manage Onboarding List Sharepoint"),
     *                  )
     *           ),
     *      )
     *   )
     * )
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'username' => 'required|string|min:5',
            'password' => [
                'sometimes',
                'nullable',
                'min:12',
                new StrongPassword
            ],
            'permissions' => 'required|array'
        ]);

        $client = ThirdPartyClient::find($id);
        $client->username = $validatedData['username'];
        if (!empty($validatedData['password'])) {
            $client->password = Hash::make($validatedData['password']);
        }
        $client->save();

        $client->thirdPartyPermissions()->delete();

        foreach ($validatedData['permissions'] as $permission) {
            $client->thirdPartyPermissions()->create([
                'name' => $permission['value']
            ]);
        }
        return response()->success(__('crud.success.default'));
    }

     /**
     * @SWG\Get(
     *   path="/api/third-party/{id}",
     *   tags={"Third Party Client"},
     *   summary="Get One Third party client",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@show, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="third party id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function show($id)
    {
        $client = ThirdPartyClient::where('id', $id)->with('thirdPartyPermissions')->first();

        return response()->success(__('crud.success.default'), $client);
    }

     /**
     * @SWG\Get(
     *   path="/api/third-party/get-all",
     *   tags={"Third Party Client"},
     *   summary="Get All third party clients",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@getAll, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getAll()
    {
        $clients = ThirdPartyClient::all();

        if (!empty($clients)) {
            foreach ($clients as $key => &$client) {
                $permissions = implode(', ', Arr::pluck($client->thirdPartyPermissions, 'name'));
                $client->permissions = !empty($permissions) ? $permissions : '';
                unset($client->thirdPartyPermissions);
            }
        }

        return response()->success(__('crud.success.default'), $clients);
    }

    /**
     * @SWG\Delete(
     *   path="/api/third-party/{id}",
     *   tags={"Third Party Client"},
     *   summary="Delete Third party client",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@delete, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="third party id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function delete($id)
    {
        $client = ThirdPartyClient::find($id);
        $client->delete();

        return response()->success(__('crud.success.default'));
    }

     /**
     * @SWG\Get(
     *   path="/api/third-party/permissions",
     *   tags={"Third Party Client"},
     *   summary="Get All permissions Data with {value: Manage Onboarding List Sharepoint, label: Manage Onboarding List Sharepoint} format",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@permissions, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function permissions()
    {
        return response()->success(__('crud.success.default'), config('thirdpartypermissions.permissions'));
    }

    /**
     * @SWG\Post(
     *   path="/api/third-party/login",
     *   tags={"Third Party Client"},
     *   summary="Login third party client",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@login",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="login",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"username", "password"},
     *          @SWG\Property(property="username", type="string", description="Username", example="johndoe"),
     *          @SWG\Property(property="password", type="string", description="Password", example="Pass-123456789!")
     *      )
     *   )
     * )
     */
    public function login(Request $request)
    {
        $validatedData = $this->validate($request, [
            'username' => 'required|string|min:5',
            'password' => 'required|string|min:12'
        ]);

        $client = ThirdPartyClient::where('username', $request->username)->first();

        if (empty($client)) {
            return response()->not_found();
        }

        if ($client && Hash::check($request->password, $client->password)) {
            $tokenData = $this->generateTokenData($client);
            $tokenTime = config('jwt.cookie_token_third_party_client_time');
            $token = auth('third-party-client-api')->setTTL($tokenTime)->claims($tokenData)->attempt($request->only('username', 'password'));

            if (!$token) {
                return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
            }

            return response()->json([
                'status' => 'success',
                'message' => __('auth.success.login'),
                'data' => ['token_type' => 'Bearer', 'access_token' => $token]
            ]);
        }

        return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
    }

    protected function generateTokenData(ThirdPartyClient $client)
    {
        return [
            'data' => [
                'username' => $client->username,
            ]
        ];
    }

    /**
     * @SWG\Post(
     *   path="/api/third-party/onboarding/sync-immaper-data",
     *   tags={"Third Party Client"},
     *   summary="Add user as iMMAPer",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@syncImmaperData",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="immper",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"profile_id", "immap_email", "is_immap_inc", "is_immap_france", "international_contract", "under_surge_program", "start_of_current_contract", "end_of_current_contract"},
     *          @SWG\Property(property="profile_id", type="interger", description="Username", example="89"),
     *          @SWG\Property(property="immap_email", type="string", format="email", description="Immap email", example="johndoe@organization.org"),
     *          @SWG\Property(property="is_immap_inc", type="integer", enum={0,1}, description="0: Not Under iMMAP US (false), 1: Under iMMAP US (true)", example=1),
     *          @SWG\Property(property="is_immap_france", type="integer", enum={0,1}, description="0: Not Under iMMAP France (false), 1: Under iMMAP France (true)", example=0),
     *          @SWG\Property(property="international_contract", type="integer", enum={0,1}, description="international contract", example=1),
     *          @SWG\Property(property="under_surge_program", type="integer", enum={0,1}, description="under surge program", example=1),
     *          @SWG\Property(property="start_of_current_contract", format="date", type="string", description="start date of the contract", example="2022-10-10"),
     *          @SWG\Property(property="end_of_current_contract", format="date", type="string", description="End date of the contract", example="2022-12-31")
     *      )
     *   )
     * )
     */
    public function syncImmaperData(Request $request)
    {
        $validatedData = $this->validate($request, [
            'profile_id' => 'required|integer|exists:profiles,id',
            'immap_email' => 'sometimes|nullable|email',
            'is_immap_inc' => 'required|boolean',
            'is_immap_france' => 'required|boolean',
            'international_contract' => 'required|boolean',
            'under_surge_program' => 'required|boolean',
            'start_of_current_contract' => 'required|date_format:Y-m-d',
            'end_of_current_contract' => 'required|date_format:Y-m-d',
            'contract_request' => 'required|string|in:Contract Renewal,Contract Amendment,New Contract,Contract Extension'
        ]);

        $profile = Profile::findOrFail($validatedData['profile_id']);
        $contract = JobInterviewRequestContract::where('profile_id', $profile->id)->latest()->first();

        if ($contract) {
            if ($validatedData['contract_request'] == 'New Contract') {
                if ($profile->is_immaper == false) {
                    if ($profile->user->access_platform != 0) {
                        $this->validate($request, ['immap_email' => 'required|email|unique:users']);
                    }

                    $profile->is_immaper = 1;
                    $profile->verified_immaper = 1;

                    if (!empty($validatedData['immap_email'])) {
                        $profile->immap_email = $validatedData['immap_email'];
                    }
                } else {
                    $this->createContractHistory($profile);
                }

                $profile->is_immap_inc = $validatedData['is_immap_inc'];
                $profile->is_immap_france = $validatedData['is_immap_france'];
                $profile->immap_contract_international = $validatedData['international_contract'];
                $profile->under_sbp_program = $validatedData['under_surge_program'];
                $profile->job_title = $contract->job ? $contract->job->title : $contract->position;
                $profile->duty_station = $contract->duty_station;
                $profile->line_manager = $contract->supervisor_user->full_name;
                $profile->line_manager_id = $contract->supervisor_user->id;
                $profile->start_of_current_contract = $validatedData['start_of_current_contract'];
                $profile->end_of_current_contract = $validatedData['end_of_current_contract'];
                $profile->project_code = $contract->project_code;
                $profile->immap_office_id = $contract->immap_office_id;
                $profile->paid_from = $contract->paid_from;
                $profile->project_task = $contract->project_task;
                $profile->supervisor_id = $contract->supervisor;
                $profile->unanet_approver_id = $contract->unanet_approver_name;
                $profile->hosting_agency = $contract->hosting_agency;
                $profile->monthly_rate = $contract->monthly_rate;
                $profile->housing  = $contract->housing;
                $profile->perdiem = $contract->perdiem;
                $profile->phone = $contract->phone;
                $profile->is_other = $contract->is_other;
                $profile->other = $contract->other;
                $profile->not_applicable = $contract->not_applicable;
                $profile->cost_center = $contract->cost_center;
                $profile->currency = $contract->currency;
                $profile->save();

                if (!empty($validatedData['immap_email'])) {
                    $saved = $profile->user;
                    $saved->immap_email =  $validatedData['immap_email'];
                    $saved->status = 'Active';
                    $saved->inactive_user_has_been_reminded = 'false';
                    $saved->inactive_user_has_been_reminded_date = NULL;
                    $saved->inactive_date = NULL;
                    $saved->save();
                } else {
                    $saved = $profile->user;
                    $saved->status = 'Active';
                    $saved->inactive_user_has_been_reminded = 'false';
                    $saved->inactive_user_has_been_reminded_date = NULL;
                    $saved->inactive_date = NULL;
                    $saved->save();
                }


                if (!$saved) {
                    return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
                }
            } else {
                if ($validatedData['contract_request'] == 'Contract Renewal' || $validatedData['contract_request'] == 'Contract Extension' || $validatedData['contract_request'] == 'Contract Amendment') {
                    if ($contract) {
                        $this->createContractHistory($profile);

                        $profile->is_immap_inc = $validatedData['is_immap_inc'];
                        $profile->is_immap_france = $validatedData['is_immap_france'];
                        $profile->immap_contract_international = $validatedData['international_contract'];
                        $profile->under_sbp_program = $validatedData['under_surge_program'];
                        $profile->duty_station = $contract->duty_station;
                        $profile->start_of_current_contract = $validatedData['start_of_current_contract'];
                        $profile->end_of_current_contract = $validatedData['end_of_current_contract'];
                        $profile->project_code = $contract->project_code;
                        $profile->paid_from = $contract->paid_from;
                        $profile->project_task = $contract->project_task;
                        $profile->supervisor_id = $contract->supervisor;
                        $profile->unanet_approver_id = $contract->unanet_approver_name;
                        $profile->hosting_agency = $contract->hosting_agency;
                        $profile->monthly_rate = $contract->monthly_rate;
                        $profile->housing  = $contract->housing;
                        $profile->perdiem = $contract->perdiem;
                        $profile->phone = $contract->phone;
                        $profile->is_other = $contract->is_other;
                        $profile->other = $contract->other;
                        $profile->not_applicable = $contract->not_applicable;
                        $profile->cost_center = $contract->cost_center;
                        $profile->currency = $contract->currency;

                        if ($validatedData['contract_request'] == 'Contract Amendment') {
                            $profile->job_title = $contract->job ? $contract->job->title : $contract->position;
                        }

                        $profile->save();
                    } else {
                        return response()->error(__('profile.error.contact_request'), 404);
                    }
                }

                $saved = $profile->user;
                $saved->status = 'Active';
                $saved->inactive_user_has_been_reminded = 'false';
                $saved->inactive_user_has_been_reminded_date = NULL;
                $saved->inactive_date = NULL;
                $saved->archived_user = 'no';

            }

            $contract->fill(['request_status' => 'done'])->save();

            if ($validatedData['under_surge_program'] == 1) {
                $surgePing = new SurgePingService();
                $surgePing->Ping();
            }
        } else {
            return response()->error(__('profile.error.contact_request'), 404);
        }

        return response()->success(__('crud.success.default'));
    }


    /**
     * @SWG\Get(
     *   path="/api/third-party/surge/all",
     *   tags={"Third Party Client"},
     *   summary="Get all surge",
     *   description="File: app\Http\Controllers\API\ThirdPartyClient\ThirdPartyClientController@getSurgeData",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function getSurgeData() {
        $profiles  = Profile::with(['profile_roster_processes' => function($q) {
            return $q->where('is_completed', 1);
        }, 'profile_roster_processes.roster_process' => function($q) {
            return $q->where('slug', '!=', 'immap-talent-pool');
        }, 'user', 'user.user_contract_histories' => function($q) {
            return $q->where('user_contract_histories.under_sbp_program', 1);
        }, 'nationalities'])->where([
            'under_sbp_program' => 1,
            'is_immaper' => 1,
        ])->orWhereHas('profile_roster_processes', function($query) {
            $query->join('roster_processes', 'roster_processes.id', '=', 'profile_roster_processes.roster_process_id')
                ->where('is_completed', 1)->where('slug', '!=', 'immap-talent-pool');
        })->get();

        $data = [];
        foreach ($profiles as $profile) {
            $rosterProfiles = $profile->profile_roster_processes->map(function($roster) {
                if(isset($roster->roster_process)) {
                    return $roster->roster_process->name;;
                }
            });

            $status = "";
            $contracts = $profile->user->user_contract_histories->map(function($contract) {
                return $contract->start_of_contract.' - '. $contract->end_of_contract;
            })->toArray();
            // if no contract under surge and accepted on roster => roster member
            // inactive : under surge but expired contract / have contract history in the past under surge.
            // archived : the user is set to archived
            if ($profile->user->archived_user == 'yes') {
                $status = "archived";
            } else if((new Carbon($profile->end_of_current_contract))->isFuture() && $profile->under_sbp_program == 1) {
                $status = "active";
            } else if($profile->user->user_contract_histories->count() > 0 || ((new Carbon($profile->end_of_current_contract))->isPast() && $profile->under_sbp_program === 1)) {
                $status = "inactive";
            } else if(count($profile->profile_roster_processes->toArray()) > 0) {
                $status = "roster member";
            }

            $start_of_current_contract = "";
            $end_of_current_contract = "";

            if($status === 'active') {
                $start_of_current_contract = $profile->start_of_current_contract;
                $end_of_current_contract = $profile->end_of_current_contract;
            } else if($status === 'inactive' && $profile->under_sbp_program === 1) {
                array_push($contracts, $profile->start_of_current_contract.' - '. $profile->end_of_current_contract);
            }

            $sex = "";
            if(!(!isset($profile->gender) || is_null($profile->gender))) {
                switch($profile->gender) {
                    case 0:
                        $sex = "Female";
                        break;
                    case 1:
                        $sex = "Male";
                        break;
                    case 2:
                        $sex = "Do not want to specify";
                        break;
                    case 3:
                        $sex = "Other";
                        break;
                }
            }
            $names = explode(' ', $profile->user->full_name);
            array_push($data, [
                'id' => $profile->id,
                'full_name' => $profile->user->full_name,
                'first_name' =>count($names) > 1 ? join(" ",array_chunk($names, count($names) - 1)[0]): $names[0],
                'last_name' => count($names) > 1 ? $names[count($names) - 1] : "",
                'immap_email' => $profile->immap_email,
                'email' => $profile->user->email,
                'gender' => $sex,
                'nationalities' => join(',', array_unique(array_map(function($nationality) {
                    return $nationality['country_code'];
                }, $profile->nationalities->toArray()))),
                'status' => $status,
                'roster_profiles' => join(',', array_filter($rosterProfiles->toArray(), function($roster) {
                    return !is_null($roster);
                })),
                'start_of_current_contract' => $start_of_current_contract,
                'end_of_current_contract' => $end_of_current_contract,
                'contract_histories' => join(',', $contracts),
            ]);
        }

        return response()->success(__('crud.success.default'), $data);
    }
    protected function createContractHistory($profile)
    {
       return UserContractHistory::create([
            'user_id' => $profile->user_id,
            'immap_email' => $profile->immap_email,
            'job_title' => $profile->job_title,
            'is_immap_inc' => $profile->is_immap_inc,
            'is_immap_france' => $profile->is_immap_france,
            'duty_station' => $profile->duty_station,
            'line_manager' => $profile->line_manager,
            'start_of_contract' => $profile->start_of_current_contract,
            'end_of_contract' => $profile->end_of_current_contract,
            'immap_contract_international' => $profile->immap_contract_international,
            'under_sbp_program' => $profile->under_sbp_program,
            'project_code' => $profile->project_code,
            'immap_office_id' => $profile->immap_office_id,
            'role' => $profile->user->roles->pluck('name')->implode(', '),
            'paid_from' => $profile->paid_from,
            'project_task' => $profile->project_task,
            'supervisor_id' => $profile->supervisor_id,
            'unanet_approver_id' => $profile->unanet_approver_id,
            'hosting_agency' => $profile->hosting_agency,
            'monthly_rate' => $profile->monthly_rate,
            'housing' => $profile->housing,
            'perdiem' => $profile->perdiem,
            'phone' => $profile->phone,
            'is_other' =>  $profile->is_other,
            'not_applicable' => $profile->not_applicable,
            'other' => $profile->other,
            'cost_center' => $profile->cost_center,
            'currency' => $profile->currency,
        ]);
    }
}
