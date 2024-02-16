<?php

namespace App\Http\Controllers\API;

use App\Exports\JobProfileExport;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\iMMAPerTrait;
use App\Models\JobStatus;
use App\Models\Profile;
use App\Models\ReferenceHistory;
use App\Models\User;
use App\Models\Job;
use App\Models\DegreeLevel;
use App\Models\LanguageLevel;
use App\Models\JobManager;
use App\Models\JobManagerComment;
use App\Models\JobInterviewRequestContract;
use App\Models\Job_user_move_status_history;
use App\Models\Setting;
use App\Models\HR\HRToR;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobInvitation;
use App\Mail\JobAccepted;
use App\Mail\JobRejected;
use App\Mail\InterviewInvitation;
use App\Mail\JobPhysicalInterviewInvitation;
use App\Mail\JobInterviewRequestContractMail;
use App\Mail\ApplyJob;
use GuzzleHttp\Client;
use App\Mail\JobSendConfirmationMail;
use App\Mail\JobSendNotificationMailToManager;
use PDF;
use ZipArchive;
use App\Services\CalendarService;
use App\Services\WordService;
use Illuminate\Support\Carbon;
use Illuminate\Mail\Mailable;
use Illuminate\Database\Eloquent\Builder;

use App\Mail\JobInterviewSendConfirmationMail;
use App\Models\JobUser;
use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Traits\DeleteAttachmentTrait;
use Spatie\MediaLibrary\Models\Media;
use App\Traits\UserStatusTrait;
use App\Traits\SBPMemberTrait;
use Swift_TransportException;
use App\Mail\SbpJobNotification;
use App\Mail\ScriptMail;
use App\Mail\SbpJobNotificationError;
use App\Mail\SbpJobClosedNotification;
use App\Mail\SbpJobClosedNotImmapNotification;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\P11\P11Reference;
use App\Mail\ReferenceCheckMail;
use Excel;
use Microsoft\Graph\Graph;
use App\Http\Controllers\API\JobInterviewScoreController;
use App\Models\ImmapOffice;
use App\Services\SurgePingService;
use App\Models\JobUserTest;
use Illuminate\Support\Arr;

function fileStream($path_to_file) {
    $info = $filesystem->getWithMetadata($path_to_file, ['size', 'mimetype']);
    $headers = [
        'Content-Type'        => $info['mimetype'],
        'Content-Length'      => $info['size'] ,
        'Content-Disposition' => 'attachment; filename="filename.ext"'
    ];
    return Response::stream(function() use ($filesystem, $path_to_file) {
        $stream = $filesystem->readStream($path_to_file);
        fpassthru($stream);
        if (is_resource($stream)) {
            fclose($stream);
        }
    }, 200, $headers);
}

class JobController extends Controller
{
    use CRUDTrait, DeleteAttachmentTrait, iMMAPerTrait, UserStatusTrait, SBPMemberTrait;

    const MODEL = 'App\Models\Job';
    const SINGULAR = 'job';

    const PAGINATE = 5;
    const APPLICANT_PAGINATE = 20;
    const RECOMMENDATION_PAGINATE = 30;

    const FILLABLE = [
        'title',
        'status', 'opening_date', 'closing_date',
        'country_id', 'immap_office_id', 'contract_start', 'contract_end',
        'contract_length', 'tor_id', 'include_cover_letter','show_contract',
        'show_salary', 'use_test_step', 'test_step_position'
    ];

    const FILLABLE_REQUEST_CONTRACT  = [
        'job_id','profile_id', 'paid_from', 'project_code', 'project_task', 'supervisor', 'unanet_approver_name', 'hosting_agency', 'not_applicable',
         'duty_station', 'monthly_rate', 'housing','perdiem', 'phone', 'is_other', 'other', 'contract_start', 'contract_end', 'cost_center',
         'first_name', 'last_name', 'request_type', 'under_surge_program', 'currency', 'position', 'immap_office_id'
    ];

    const RULES = [
        'title' => 'required|string|max:255',
        'languages' => 'required|array',
        'status' => 'required|integer|in:0,1,3',
        'opening_date' => 'required|date',
        'closing_date' => 'required|date',
        'contract_start' => 'sometimes|nullable||date',
        'contract_end' => 'sometimes|nullable||date',
        'country_id' => 'sometimes|nullable||integer|exists:countries,id',
        'immap_office_id' => 'sometimes|nullable|integer|exists:immap_offices,id',
        'contract_length' => 'required|integer',
        'tor_id' => 'required|integer',
        'sub_sections' => 'required|array',
        'sub_sections.*.sub_section' => 'required|string',
        'sub_sections.*.sub_section_content' => 'required|string',
        'exists_manager_id' => 'sometimes|nullable|array',
        'exclude_immaper' => 'sometimes|nullable|array',
        'exclude_immaper.*.value' => 'sometimes|nullable|email',
        'include_cover_letter' => 'sometimes|nullable|boolean',
        'show_contract' => 'required|boolean',
        'show_salary' => 'required|boolean',
        'use_test_step' => 'required|boolean',
        'test_step_position' => 'sometimes|nullable|string|in:before,after',
    ];

    const FILTER_RULES = [
        'choosen_country' => 'sometimes|nullable|array',
        'choosen_language' => 'sometimes|nullable|array',
        'choosen_immap_office' => 'sometimes|nullable|array',
        'search' => 'sometimes|nullable|string',
        'contract_length_min' => 'required|integer',
        'contract_length_max' => 'required|integer',
        'job_status' => 'sometimes|nullable|array',
        'tabValue' => 'required|integer',
    ];

    const APPLICANT_FILTER_RULES = [
        'search' => 'sometimes|nullable|string',
        'experience' => 'sometimes|nullable|integer',
        'chosen_language' => 'sometimes|nullable|array',
        'chosen_language.*.id' => 'sometimes|nullable|integer',
        'chosen_language.*.is_mother_tongue' => 'sometimes|nullable|boolean',
        'chosen_language.*.language_level.value' => 'sometimes|nullable|integer',
        'chosen_sector' => 'sometimes|nullable|array',
        'chosen_sector.*.id' => 'sometimes|nullable|integer',
        'chosen_sector.*.years' => 'sometimes|nullable|integer',
        'chosen_country' => 'sometimes|nullable|array',
        'chosen_country.*.id' => 'sometimes|nullable|integer|exists:countries,id',
        'chosen_country.*.years' => 'sometimes|nullable|integer',
        'chosen_skill' => 'sometimes|nullable|array',
        'chosen_skill.*.id' => 'sometimes|nullable|integer',
        'chosen_skill.*.years' => 'sometimes|nullable|integer',
        'chosen_skill.*.rating' => 'sometimes|nullable|integer',
        'chosen_degree_level' => 'sometimes|nullable|array',
        'chosen_degree_level.*.id' => 'sometimes|nullable|integer',
        'chosen_degree_level.*.degree' => 'sometimes|nullable|string',
        'chosen_degree_level.*.study' => 'sometimes|nullable|string',
        'chosen_field_of_work' => 'sometimes|nullable|array',
        'chosen_field_of_work.*.id' => 'sometimes|nullable|integer|exists:field_of_works,id',
        'chosen_nationality' => 'sometimes|nullable|array',
        'chosen_nationality.*.id' => 'sometimes|nullable|integer|exists:countries,id',
        'chosen_country_of_residence' => 'sometimes|nullable|array',
        'chosen_country_of_residence.*.value' => 'sometimes|nullable|integer|exists:countries,id',
        'immaper_status' => 'sometimes|nullable|array',
        'immaper_status.*' => 'sometimes|nullable|in:is_immaper,not_immaper,both',
        'select_gender' => 'sometimes|nullable|array',
        'select_gender.*' => 'sometimes|nullable|in:male,female,do_not_want_specify,other,both',
        'is_available' => 'sometimes|nullable|array',
        'is_available.*' => 'sometimes|nullable|in:available,not_available,both',
        'minimum_requirements' => 'sometimes|nullable|boolean',
    ];

    const RULES_REQUEST_CONTRACT = [
        'job_id' => 'sometimes|nullable|integer',
        'profile_id' => 'required|integer',
        'request_type' => 'required|string',
        'first_name' => 'sometimes|nullable|string',
        'last_name' => 'sometimes|nullable|string',
        'paid_from' => 'sometimes|nullable|boolean',
        'project_code' => 'sometimes|nullable|string',
        'project_task' => 'sometimes|nullable|string',
        'supervisor' => 'sometimes|nullable|integer',
        'unanet_approver_name' => 'sometimes|nullable|integer',
        'hosting_agency' => 'sometimes|nullable|string',
        'duty_station' => 'sometimes|nullable|string',
        'monthly_rate' => 'sometimes|nullable|integer',
        'housing' => 'required|boolean',
        'perdiem' => 'required|boolean',
        'phone' => 'required|boolean',
        'not_applicable' => 'required|boolean',
        'is_other' => 'required|boolean',
        'other' => 'sometimes|nullable|string|required_if:is_other,1',
        'contract_start' => 'required|date_format:Y-m-d',
        'contract_end' => 'required|date_format:Y-m-d',
        'cost_center' => 'sometimes|nullable|integer|exists:immap_offices,id',
        'immap_office_id' => 'sometimes|nullable|integer',
        'position' => 'sometimes|nullable|string',
        'under_surge_program' => 'required|boolean',
        'currency' => 'required|string'
    ];

    protected $authUser;

    public function __construct()
    {
        $user = auth()->user();
        $this->authUser = ($user) ? $user : null;
        // define collection for all applicant and non archive applicant
        $this->allApplicantCollection = 'recruitment-report';
        $this->nonArchiveApplicantCollection = 'recruitment-report-without-archived-users';
        // define non archive suffix
        $this->nonArchivedSuffix = '-without-archived-users';
    }

    // Filter Job based on the jobs status
    protected function filterJobStatus($jobs, $job_status, $current_date)
    {
        $jobs = $jobs->where(function($query) use ($job_status, $current_date) {
            foreach($job_status as $key => $status) {
                if ($key == 0) {
                    if ($status == 1) {
                        $query->where(function($open_query) use ($status, $current_date) {
                            $open_query->where('status', $status)->whereDate('closing_date', '>=', $current_date)->whereDate('opening_date', '<=', $current_date);
                        });
                    } elseif ($status == 2) {
                        $query->where(function($close_query) use ($status, $current_date) {
                            $close_query->where('status', 1)->whereDate('closing_date', '<',$current_date);
                        });
                    } else {
                        $query->where('status', $status);
                    }
                } else {
                    if ($status == 1) {
                        $query->orWhere(function($open_query) use ($status, $current_date) {
                            $open_query->where('status', $status)->whereDate('closing_date', '>=', $current_date)->whereDate('opening_date', '<=', $current_date);
                        });
                    } elseif ($status == 2) {
                        $query->orWhere(function($close_query) use ($status, $current_date) {
                            $close_query->where('status', 1)->whereDate('closing_date', '<', $current_date);
                        });
                    } else {
                        $query->orWhere('status', $status);
                    }
                }
            }
        });

        return $jobs;
    }

    /**
     * @SWG\GET(
     *   path="/api/jobs/{id}",
     *   tags={"Job"},
     *   summary="Get specific job data",
     *   description="File: app\Http\Controllers\API\JobController@show",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job id"
     *    )
     * )
     *
     */
    public function show($id)
    {

        $job = $this->model::with(['country', 'immap_office', 'immap_office.country', 'languages', 'tor',
            'tor.duration:id,name', 'tor.job_standard:id,under_sbp_program,sbp_recruitment_campaign',
            'interview_questions', 'sub_sections', 'job_manager'])
            ->withCount('job_user as number_aplicant')->findOrFail($id);
        $job->torRequirements = $job->tor->matching_requirements;
        $job->hasApplied = (!empty(auth()->user()->id)) ? $job->users->contains(auth()->user()->id) : false;
        $closingDate = (new DateTime($job->closing_date, new DateTimeZone('Pacific/Niue')));
        $closingDate->setTime(23,59,59);
        $job->closed = ($closingDate < (new DateTime('now', new DateTimeZone('Pacific/Niue'))) || $job->status == 3) ;

        return response()->success(__('crud.success.default'), $job);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs",
     *   tags={"Job"},
     *   summary="Store job",
     *   description="File: app\Http\Controllers\API\JobController@store, permission:Add Job|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="job",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"title", "status", "opening_date", "closing_date", "immap_office_id",
     *              "contract_length", "tor_id", "sub_sections", "show_contract", "show_salary"
     *          },
     *          @SWG\Property(property="title", type="string", description="Job Title", example="Fullstack developer"),
     *          @SWG\Property(property="languages", type="array", description="Language needed for the job",
     *              @SWG\Items(type="integer", description="Language id", example=1)
     *          ),
     *          @SWG\Property(property="status", type="integer", enum={0,1}, description="Job status [0 = draft, 1 = open, 3 = close]", example=0),
     *          @SWG\Property(property="opening_date", type="string", format="date", description="Job opening date (format date : Y-m-d)", example="2021-01-01"),
     *          @SWG\Property(property="closing_date", type="string", format="date", description="Job closing date (format date : Y-m-d)", example="2021-02-24"),
     *          @SWG\Property(property="contract_start", type="string", format="date", description="Contract start date (format date : Y-m-d)", example="2021-03-01"),
     *          @SWG\Property(property="contract_end", type="string", format="date", description="Contract end date (format date : Y-m-d)", example="2021-12-31"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=2),
     *          @SWG\Property(property="immap_office_id", type="integer", description="iMMAP Office id", example=2),
     *          @SWG\Property(property="contract_length", type="integer", description="Contract length id", example=2),
     *          @SWG\Property(property="tor_id", type="integer", description="ToR id", example=2),
     *          @SWG\Property(
     *              property="sub_sections",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="level", type="integer", description="Sub section order", example=0),
     *                  @SWG\Property(property="sub_section", type="string", description="Sub section title", example="Organization"),
     *                  @SWG\Property(property="sub_section_content", type="string", description="Sub section content", example="<p>Organization description</p>")
     *              )
     *          ),
     *          @SWG\Property(
     *              property="manager",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="email", type="string", format="email", description="iMMAPer email address", example="jdoe@organization.org"),
     *                  @SWG\Property(property="label", type="string", description="iMMAPer name and email as label in Select Field", example="jdoe@organization.org - (John Doe)"),
     *                  @SWG\Property(property="value", type="integer", description="User id", example=6)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="exclude_immaper",
     *              type="array",
     *              description="list of user who can't access the view applicants page",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="string", format="email", description="iMMAPer email address", example="jdoe@organization.org")
     *              )
     *          ),
     *          @SWG\Property(property="include_cover_letter", type="integer", enum={0,1}, description="Need cover letter for applying the job [0 = no, 1 = yes]", example=0),
     *          @SWG\Property(property="show_contract", type="integer", enum={0,1}, description="Show contract information on job posting", example=0),
     *          @SWG\Property(property="show_salary", type="integer", enum={0,1}, description="Show salary range on job posting", example=1)
     *       )
     *    )
     * )
     *
     */
    public function store(Request $request)
    {
        $validateTorId = $this->validate($request, ['tor_id' => 'required|integer|exists:hr_tor,id']);

        $tor = HRToR::where('id', $validateTorId['tor_id'])->first();
        if (!$tor) {
            return response()->not_found();
        }

        $rules = $this->rules;
        if ($tor->job_standard->under_sbp_program == "no" && $tor->job_standard->sbp_recruitment_campaign == "no") {
            $rules['manager'] = 'required|array';
            $rules['manager.*.value'] = 'required|integer|exists:users,id';
        }

        $validatedData = $this->validate($request, $rules);

        $jobData = $request->only($this->fillable);

        if (!empty($validatedData['exclude_immaper'])) {
            $jobData['exclude_immaper'] = json_encode($validatedData['exclude_immaper']);
        }

        $record = $this->model::create($jobData);

        if (!empty($validatedData['sub_sections'])) {
            $record->sub_sections()->createMany($validatedData['sub_sections']);
        }

        if (!empty($validatedData['languages'])) {
            $record->languages()->sync($validatedData['languages']);
        }

        if ($record && $tor->job_standard->under_sbp_program == "no" && $tor->job_standard->sbp_recruitment_campaign == "no") {
            foreach ($validatedData['manager'] as $mng) {

                $userid=User::select('id','full_name')->where('id', $mng['value'])
                   ->first();

                $manager = JobManager::create([
                    'job_id'=>$record->id,
                    'user_id'=>$mng['value'],
                    'email'=>$mng['email'],
                    'label'=>$mng['label'],
                    'name'=>$userid['full_name']
                ]);

                if($jobData['status']==1) {

                    Mail::to($mng['email'])->send(
                        new JobSendNotificationMailToManager(
                            $record, $userid
                        )
                    );

                    JobManager::where('id', $manager->id)
                        ->update(['has_been_notified' => 1]);

                }

            }

        }

        if ($record) {
            if ($tor->job_standard->under_sbp_program == "no") {
                $this->sendToImmapWebsite($record);
            }

            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}",
     *   tags={"Job"},
     *   summary="Update job",
     *   description="File: app\Http\Controllers\API\JobController@update, permission:Edit Job",
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
     *       description="Job id"
     *   ),
     *   @SWG\Parameter(
     *       name="job",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"_method", "title", "status", "opening_date", "closing_date","immap_office_id",
     *              "contract_length", "tor_id", "sub_sections", "show_contract", "show_salary"
     *          },
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="title", type="string", description="Job Title", example="Fullstack developer"),
     *          @SWG\Property(property="languages", type="array", description="Language needed for the job",
     *              @SWG\Items(type="integer", description="Language id", example=1)
     *          ),
     *          @SWG\Property(property="status", type="integer", enum={0,1}, description="Job status [0 = draft, 1 = open, 3 = close]", example=0),
     *          @SWG\Property(property="opening_date", type="string", format="date", description="Job opening date (format date : Y-m-d)", example="2021-01-01"),
     *          @SWG\Property(property="closing_date", type="string", format="date", description="Job closing date (format date : Y-m-d)", example="2021-02-24"),
     *          @SWG\Property(property="contract_start", type="string", format="date", description="Contract start date (format date : Y-m-d)", example="2021-03-01"),
     *          @SWG\Property(property="contract_end", type="string", format="date", description="Contract end date (format date : Y-m-d)", example="2021-12-31"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=2),
     *          @SWG\Property(property="immap_office_id", type="integer", description="iMMAP Office id", example=2),
     *          @SWG\Property(property="contract_length", type="integer", description="Contract length id", example=2),
     *          @SWG\Property(property="tor_id", type="integer", description="ToR id", example=2),
     *          @SWG\Property(
     *              property="sub_sections",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="level", type="integer", description="Sub section order", example=0),
     *                  @SWG\Property(property="sub_section", type="string", description="Sub section title", example="Organization"),
     *                  @SWG\Property(property="sub_section_content", type="string", description="Sub section content", example="<p>Organization description</p>")
     *              )
     *          ),
     *          @SWG\Property(
     *              property="manager",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="email", type="string", format="email", description="iMMAPer email address", example="jdoe@organization.org"),
     *                  @SWG\Property(property="label", type="string", description="iMMAPer name and email as label in Select Field", example="jdoe@organization.org - (John Doe)"),
     *                  @SWG\Property(property="value", type="integer", description="User id", example=6)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="exists_manager_id",
     *              type="array",
     *              description="list of hiring manager ids that already saved / assigned",
     *              @SWG\Items(type="integer", example=2)
     *          ),
     *          @SWG\Property(
     *              property="exclude_immaper",
     *              type="array",
     *              description="list of user who can't access the view applicants page",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="string", format="email", description="iMMAPer email address", example="jdoe@organization.org")
     *              )
     *          ),
     *          @SWG\Property(property="include_cover_letter", type="integer", enum={0,1}, description="Need cover letter for applying the job [0 = no, 1 = yes]", example=0),
     *          @SWG\Property(property="show_contract", type="integer", enum={0,1}, description="Show contract information on job posting", example=0),
     *          @SWG\Property(property="show_salary", type="integer", enum={0,1}, description="Show salary range on job posting", example=1)
     *       )
     *    )
     *
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validateTorId = $this->validate($request, ['tor_id' => 'required|integer|exists:hr_tor,id']);

        $tor = HRToR::where('id', $validateTorId['tor_id'])->first();
        if (!$tor) {
            return response()->not_found();
        }

        $rules = $this->rules;
        if ($tor->job_standard->under_sbp_program == "no" && $tor->job_standard->sbp_recruitment_campaign == "no") {
            $rules['manager'] = 'required|array';
            $rules['manager.*.value'] = 'required|integer|exists:users,id';
        }

        $validatedData = $this->validate($request, $rules);
        $record = $this->model::findOrFail($id);
        $jobs = $record;
        $jobData = $request->only($this->fillable);

        if (!empty($validatedData['exclude_immaper'])) {
            $jobData['exclude_immaper'] = json_encode($validatedData['exclude_immaper']);
        }
        $record->fill($jobData);

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', $this->singular), 500);
        }

        if (!empty($validatedData['sub_sections'])) {
            $record->sub_sections()->delete();
            $record->sub_sections()->createMany($validatedData['sub_sections']);
        }

        $record->languages()->sync($validatedData['languages']);

        if ($tor->job_standard->under_sbp_program == "no" && $tor->job_standard->sbp_recruitment_campaign == "no") {
            JobManager::where('job_id', $id)
                ->whereNotIn('id', $validatedData['exists_manager_id'])->delete();

            $managerArray = Array();
            foreach ($validatedData['manager'] as $mng) {

                $userid=User::select('id','full_name')->where('id', $mng['value'])
                       ->first();

                array_push($managerArray, [
                    'id'=>$mng['value'],
                    'label'=>$mng['label'],
                    'value'=>$mng['email'],
                ]);

                //don't insert exists data
                if (empty($mng['managers_id'])) {
                    $manager = JobManager::create([
                        'job_id'=>$record->id,
                        'user_id'=>$mng['value'],
                        'email'=>$mng['email'],
                        'label'=>$mng['label'],
                        'name'=> !empty($mng['name']) ? $mng['name']:$userid['full_name'],
                        'has_been_notified'=> !empty($mng['notified']) ? $mng['notified']:0
                    ]);
                }

                if($record->status==1) {

                    if (!empty($mng['managers_id'])) {
                        $has_been_notified = JobManager::select('id', 'email', 'has_been_notified')
                            ->where('id', $mng['managers_id'])
                            ->first();
                    } else {
                        $has_been_notified = JobManager::select('id', 'email', 'has_been_notified')
                            ->where('id', $manager->id)
                            ->first();
                    }

                    if($has_been_notified['has_been_notified']==0) {
                        // send email
                        Mail::to($mng['email'])->send(
                            new JobSendNotificationMailToManager(
                                $jobs, $userid
                            )
                        );


                        JobManager::where('id', $has_been_notified['id'])
                            ->update(['has_been_notified' => 1]);
                    }

                }

            }

            $if_job_has_user = DB::table('job_user')->where('job_id', $id)->first();
            //update job_user table
            if($if_job_has_user) {
                DB::table('job_user')->where('job_id', $id)
                    ->update(['panel_interview' => json_encode($managerArray)]);
            }
        }

        if ($record) {
            if ($tor->job_standard->under_sbp_program == "no") {
                $this->sendToImmapWebsite($record, 'PUT');
            }
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/jobs/{id}",
     *   tags={"Job"},
     *   summary="Delete job",
     *   description="File: app\Http\Controllers\API\JobController@destroy, permission:Delete Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        if ($record->job_user->isNotEmpty()) {
            $this->deleteCoverLetter($record->job_user->toArray());
        }
        if ($record->job_interview_files->isNotEmpty()) {
            $this->deleteInterviewFiles($record->job_interview_files->toArray());
        }
        $record->users()->detach();
        $record->languages()->detach();
        $record->sub_sections()->delete();
        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\GET(
     *   path="/api/jobs/countries",
     *   tags={"Job"},
     *   summary="Get list of countries related to the job (for job filter)",
     *   description="File: app\Http\Controllers\API\JobController@getCountryByJob",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getCountryByJob()
    {
        $countries = $this->model::with('country')
                          ->join('countries', 'jobs.country_id', 'countries.id')
                          ->orderBy('countries.name');
        $isHiringManager = false;
        $authUserIsIMMAPer = false;

        if(!empty($this->authUser)) {
            $isHiringManager = count($this->authUser->jobManager) > 0 ? true : false;
            $authUserIsIMMAPer = $this->checkIMMAPerFromSelectedUser($this->authUser);
        }

        if (empty($this->authUser) || !$this->authUser->hasAnyPermission(['Add Job', 'Edit Job', 'Delete Job']) || !$authUserIsIMMAPer) {
            $countries = $countries->where('status', 1)->where('closing_date', '>=', date('Y-m-d'))->where('opening_date', '<=', date('Y-m-d'));
        }

        if ($isHiringManager && !$this->authUser->hasAnyPermission(['Set as Manager', 'Set as Admin'])) {
            $countries = $countries->orWhereHas('job_manager', function (Builder $query) {
                $query->where('user_id', $this->authUser->id);
            });
        }

        $countries = $countries->get()->pluck('country')->unique()->flatten();

        return response()->success(__('crud.success.default'), $countries);
    }

    /**
     * @SWG\GET(
     *   path="/api/jobs/languages",
     *   tags={"Job"},
     *   summary="Get list of languages related to the job (for job filter)",
     *   description="File: app\Http\Controllers\API\JobController@getLanguageByJob",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getLanguageByJob()
    {
        $languages = $this->model::with(['languages' => function($query) {
            $query->orderBy('name', 'ASC');
          }]);
        $isHiringManager = false;
        $authUserIsIMMAPer = false;

        if(!empty($this->authUser)) {
            $isHiringManager = count($this->authUser->jobManager) > 0 ? true : false;
            $authUserIsIMMAPer = $this->checkIMMAPerFromSelectedUser($this->authUser);
        }

        if (empty($this->authUser) || !$this->authUser->hasAnyPermission(['Add Job', 'Edit Job', 'Delete Job']) || !$authUserIsIMMAPer) {
            $languages = $languages->where('status', 1)->where('closing_date', '>=', date('Y-m-d'))->where('opening_date', '<=', date('Y-m-d'));
        }

        if ($isHiringManager && !$this->authUser->hasAnyPermission(['Set as Manager', 'Set as Admin'])) {
            $languages = $languages->orWhereHas('job_manager', function (Builder $query) {
                $query->where('user_id', $this->authUser->id);
            });
        }

        $languages = $languages->get()->pluck('languages')->flatten()->keyBy('id')->flatten();

        return response()->success(__('crud.success.default'), $languages);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/search-filter",
     *   tags={"Job"},
     *   summary="filter job",
     *   description="File: app\Http\Controllers\API\JobController@searchFilter",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="jobFilter",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *         required={"contract_length_min", "contract_length_max", "tabValue"},
     *         @SWG\Property(property="search", type="string", description="Keyword for searching job title", example="IMO"),
     *         @SWG\Property(property="contract_length_min", type="integer", description="Minimum contract length", example=6),
     *         @SWG\Property(property="contract_length_max", type="integer", description="Maximum Contract length", example=12),
     *         @SWG\Property(property="job_status", type="array", description="Job status",
     *             @SWG\Items(type="integer", description="job status value [0 = draft, 1 = open, 2 = expired, 3 = close]", example=2)
     *         ),
     *         @SWG\Property(property="tabValue", type="integer", description="tab value (0 = all jobs, 1 = my recruitment, 2 = archives)", example=0),
     *         @SWG\Property(
     *             property="choosen_language",
     *             type="array",
     *             description="List of language ids selected for filter",
     *             @SWG\Items(type="integer", description="Language id", example=1)
     *         ),
     *         @SWG\Property(
     *             property="choosen_country",
     *             type="array",
     *             description="List of country ids selected for filter (country of the job)",
     *             @SWG\Items(type="integer", description="Country id", example=1)
     *         ),
     *         @SWG\Property(
     *              property="choosen_immap_office",
     *              type="array",
     *              description="List of iMMAP office ids selected for filter (iMMAP office of the job)",
     *              @SWG\Items(type="integer", description="Country id", example=1)
     *         )
     *      )
     *    )
     * )
     *
     */

    /*
     * Showing the job list in Home and Jobs page
     */
    public function searchFilter(Request $request) {
        $validatedData = $this->validate($request, self::FILTER_RULES);
        $jobs = $this->model::with([
            'country',
            'languages',
            'tor:id,duty_station,duration_id,relationship,organization,min_salary,max_salary,job_standard_id,skillset,cluster,cluster_seconded',
            'tor.duration:id,name',
            'tor.job_standard:id,under_sbp_program,sbp_recruitment_campaign',
            'job_manager'
        ])->withCount([
            'job_user as number_aplicant' => function($query) {
                $query->whereHas('user', function($subQuery) {
                    $subQuery->where('users.status', 'Active');

                    // for a user who don't have access to archive feature
                    if ($this->authUser == null) {
                        $subQuery->where('users.archived_user', "no");
                    } else {
                        if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile']))
                        {
                            $subQuery->where('users.archived_user', "no");
                        }
                    }
                });
            },
            'interviewScore as number_interview_files'
        ])->orderBy('created_at', 'desc');

        // search filter
        if (!empty($validatedData['search'])) {
            $jobs = $jobs->where('title', 'like', '%' . $validatedData['search'] . '%');
        }

        // max contract filter
        if (!empty($validatedData['contract_length_max'])) {
            $jobs = $jobs->where('contract_length', '<=', $validatedData['contract_length_max']);
        }

        // min contract filter
        if (!empty($validatedData['contract_length_min'])) {
            $jobs = $jobs->where('contract_length', '>=', $validatedData['contract_length_min']);
        }

        // language filter
        if (!empty($validatedData['choosen_language'])) {
            $jobs = $jobs->whereHas('languages', function ($query) use ($validatedData) {
                $query->whereIn('languages.id', $validatedData['choosen_language']);
            });
        }

        // country filter
        if (!empty($validatedData['choosen_country'])) {
            $jobs = $jobs->whereIn('country_id', $validatedData['choosen_country'])->whereNotNull('country_id');
        }

        // immap office
        if (!empty($validatedData['choosen_immap_office'])) {
            $jobs = $jobs->whereIn('immap_office_id', $validatedData['choosen_immap_office']);
        }

        /*
         * Filter based on Tabs and Completed Profile User / iMMAPer / Manager / Admin
         * Manager
         *  - All Jobs is containing the open and expired jobs (filter: open, expired, close)
         *  - My Recruitments is containing the open and expired jobs related to manager
         *  - Archive is containing the close job for jobs related to manager
         * Admin
         *  - All Jobs is containing the open and expired jobs (filter: draft, open, expired, close)
         *  - My Recruitments is containing the open and expired jobs related to admin
         *  - Archive the close job for all jobs (not restricted by who is the job manager)
         * Job status explanation
         *  - draft = 0 -> status = 0
         *  - open = 1 -> status = 1 && closing_date <= date_now && opening_date >= date_now
         *  - expired = 2 -> status = 1 && closing_date >= date_now
         *  - close = 3 -> status = 3
         * TabValue explanation
         *  - All Jobs = 0
         *  - My Recruitments = 1
         *  - Archives = 2
         */


        $authUserIsIMMAPer = empty($this->authUser) ? false : $this->checkIMMAPerFromSelectedUser($this->authUser);
        if (empty($this->authUser) || !$this->authUser->hasAnyPermission(['Add Job', 'Edit Job', 'Delete Job', 'Set as Admin', 'Set as Manager', 'View SBP Job']) || !$authUserIsIMMAPer) {
            // This condition is for Completed Profile User / iMMAPer
            $isHiringManager = false;
            $isAcceptedRosterMember = false;
            if (!empty($this->authUser)) {
                $isHiringManager = count($this->authUser->jobManager) > 0 ? true : false;
                $isAcceptedRosterMember = $this->isAcceptedSbpRosterMemberFromSelectedUser($this->authUser);
            }

            if ($validatedData['tabValue'] == 0) {
                $jobs = $jobs->where('status', 1)->whereDate('closing_date', '>=', date('Y-m-d'))->where('opening_date', '<=', date('Y-m-d'))
                            ->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                                $query->where('under_sbp_program', "no")->where('sbp_recruitment_campaign', 'no');
                            });

                if ($isHiringManager) {
                    // for immaper who is a temporary hiring manager in 'all jobs' tab
                    $jobs = $jobs->orWhere(function ($query) use ($validatedData) {
                        $query->whereHas('tor.job_standard', function(Builder $subQuery) use ($validatedData) {
                            $subQuery->where('under_sbp_program', "no");
                        })->whereHas('job_manager', function (Builder $subQuery) use ($validatedData) {
                            $subQuery->where('user_id', $this->authUser->id)->where('status', '<>', 3);
                            if (!empty($validatedData['choosen_country'])) {
                                $subQuery->whereIn('country_id', $validatedData['choosen_country']);
                            }
                        });
                    });
                }

            }

            if ($validatedData['tabValue'] == 3 && !$isAcceptedRosterMember) {
                return response()->success(__('crud.success.default'), $this->model::where('id', "to return empty data")->paginate(self::PAGINATE));
            }

            if ($validatedData['tabValue'] == 3 && $isAcceptedRosterMember) {
                $skillSets=Array();
                $rosterProcesses = ProfileRosterProcess::select('id', 'roster_process_id')->with(['roster_process:id,skillset'])->where('profile_id', $this->authUser->profile->id)->where('is_completed', 1)->get();
                if ($rosterProcesses->count() > 0) {
                   foreach ($rosterProcesses as $key => $value) {
                       if (!empty($value->roster_process->skillset)) {
                           array_push($skillSets, $value->roster_process->skillset);
                       }
                   }
                }

                $jobs = $jobs->where('status', 1)->whereDate('closing_date', '>=', date('Y-m-d'))->where('opening_date', '<=', date('Y-m-d'))
                            ->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                                $query->where('under_sbp_program', "yes");
                            })->whereHas('tor', function(Builder $query) use ($skillSets) {
                        $query->whereIn('skillset', $skillSets);
                 });
            }

            // for immaper who is a temporary hiring manager either on 'my recruitments' and 'archives' tab
            if ($isHiringManager && ($validatedData['tabValue'] == 1 || $validatedData['tabValue'] == 2)) {
                // Get only close jobs that are related to the manager
                $jobs = $jobs->whereHas('job_manager', function (Builder $query) {
                    $query->where('user_id', $this->authUser->id);
                });

                $current_date = date('Y-m-d');
                $job_status = [];

                if(!empty($validatedData['job_status'])) {
                    $job_status = $validatedData['job_status'];
                }

                // filter job status if tabValue == 2 (Archives) [status == 3], tabValue == 1 (MyRecruitment) [status == [1,2]]
                $job_status = empty($job_status) ? $validatedData['tabValue'] == 2 ? [3] : [1,2] : $job_status;
                $jobs = $this->filterJobStatus($jobs, $job_status, $current_date);
            }

            if ($validatedData['tabValue'] == 4) {
                $jobs = $jobs->where('status', 1)->whereDate('closing_date', '>=', date('Y-m-d'))->where('opening_date', '<=', date('Y-m-d'))
                ->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                    $query->where('sbp_recruitment_campaign', "yes");
                });
            }
        } else {
            // This is for SBP Manager, Manager and Admin
            $current_date = date('Y-m-d');
            $job_status = [];

            if(!empty($validatedData['job_status'])) {
                $job_status = $validatedData['job_status'];
            }

            $is_manager = $this->authUser->hasPermissionTo('Set as Manager');
            $is_sbp_manager = $this->authUser->hasPermissionTo('View SBP Job');
            $is_admin = $this->authUser->hasPermissionTo('Set as Admin');

            if ($validatedData['tabValue'] == 0 || $validatedData['tabValue'] == 1 || $validatedData['tabValue'] == 3) {
                // Get jobs based on job status (default 1 and 2)
                $job_status = empty($job_status) ? [1,2] : $job_status;
                $jobs = $this->filterJobStatus($jobs, $job_status, $current_date);

                // Get only the jobs that are related to user (it can be manager or admin)
                // My Recruitments Tab
                if ($validatedData['tabValue'] == 1) {
                    $jobs = $jobs->whereHas('job_manager', function (Builder $query) {
                                $query->where('user_id', $this->authUser->id);
                     })->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                                $query->where('sbp_recruitment_campaign', 'no');
                    });
                }

                // All Jobs and Surge Program Jobs Tab
                if ($validatedData['tabValue'] == 0 || $validatedData['tabValue'] == 3) {
                    $jobs = $jobs->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                        $query->where('under_sbp_program', $validatedData['tabValue'] == 3 ? "yes" : "no")->where('sbp_recruitment_campaign', 'no');
                    });
                }
            }

            // Archives Tab
            if ($validatedData['tabValue'] == 2) {
                // Get jobs based on close job status (status = 3)
                $job_status = empty($job_status) ? [3] : $job_status;
                $oldJobs = $jobs;
                $jobs = $this->filterJobStatus($jobs, $job_status, $current_date);

                // Get only close jobs that are related to the manager
                if ($is_manager && !$is_sbp_manager) {
                    $jobs = $jobs->whereHas('job_manager', function (Builder $query) {
                                $query->where('user_id', $this->authUser->id);
                    })->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                        $query->where('sbp_recruitment_campaign', 'no');
                    });
                }

                // Get closed jobs that are related to manager or sbp manager
                if (($is_manager && $is_sbp_manager) || $is_admin) {
                    $jobs = $jobs->where(function ($query) use ($validatedData) {
                        $query->whereHas('job_manager', function (Builder $query) {
                            $query->where('user_id', $this->authUser->id);
                        })->orWhere(function($query) {
                            $query->whereHas('tor.job_standard', function(Builder $query) {
                                $query->where('under_sbp_program', "yes")->where('sbp_recruitment_campaign', 'no');
                            })->where('jobs.status', 3);
                        });
                    });
                }
            }

             // Surge Program Recruitment Tab
             if ($validatedData['tabValue'] == 4) {
                $jobs = $jobs->whereHas('tor.job_standard', function(Builder $query) use ($validatedData) {
                    $query->where('sbp_recruitment_campaign', 'yes');
                });
            }
        }

        return response()->success(__('crud.success.default'), $jobs->paginate(self::PAGINATE));
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/apply-job",
     *   tags={"Job"},
     *   summary="Apply job",
     *   description="File: app\Http\Controllers\API\JobController@applyJob, Permission: Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="applyJob",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *         @SWG\Property(property="job_id", type="integer", description="Job id", example=53)
     *      )
     *   )
     * )
     *
     */
    public function applyJob(Request $request)
    {
        $validatedData = $this->validate($request, ['job_id' => 'required|integer|exists:jobs,id']);
        $defaultStatus = JobStatus::where('default_status', 1)->first();
        $rejectedStatus = JobStatus::where('set_as_rejected', 1)->first();
        $job = $this->model::findOrFail($validatedData['job_id']);

        $pivotData = ['job_status_id' => $defaultStatus->id];

        if ($job->tor->job_standard->under_sbp_program == "yes") {
            $validatedData = $this->validate($request, [
                'job_id' => 'required|integer|exists:jobs,id',
                'start_date_availability' => 'required|date_format:Y-m-d',
                'departing_from' => 'required|string'
            ]);
            $pivotData['start_date_availability'] = $validatedData['start_date_availability'];
            $pivotData['departing_from'] = $validatedData['departing_from'];
        }

        if (!$this->isAcceptedSbpRosterMemberFromSelectedUser($this->authUser) && $job->tor->job_standard->under_sbp_program == "yes") {
            return response()->error(__('job.error.not_sbp_member'), 500);
        }

        $user_id = $this->authUser->id;
        $historyStatus = [
            [
                'job_status_id' => $defaultStatus->id,
                'is_current_status' => 1
            ]
        ];

        if ($this->authUser->archived_user == "yes") {
            $pivotData['job_status_id'] = $rejectedStatus->id;
            $historyStatus[0]['is_current_status'] = 0;
            array_push($historyStatus, [
                'job_status_id' => $rejectedStatus->id,
                'is_current_status' => 1
            ]);
        }

        if ($job->users->contains($user_id)) {
            return response()->error(__('job.error.already_applied'), 500);
        }

        if ($job->status === 0) {
            return response()->error(__('job.error.cannot_apply'), 500);
        }

        $job->users()->attach($user_id, $pivotData);

        foreach($historyStatus as $stepStatus) {
            Job_user_move_status_history::create([
                'job_id'=> $validatedData['job_id'],
                'user_id'=> $user_id,
                'job_status_id'=> $stepStatus['job_status_id'],
                'user_move_id' => null,
                'is_current_status' => $stepStatus['is_current_status']
            ]);
        }

        Mail::to($this->authUser->email)->send(new ApplyJob($job, $this->authUser->full_name));

        return response()->success(__('job.success.apply_job'));
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/applicants/{status_id}/filter",
     *   tags={"Job"},
     *   summary="Filter applicant",
     *   description="File: app\Http\Controllers\API\JobController@filterApplicants, Permission: View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(name="status_id", in="path", required=true, type="integer", description="job status id (see job status table)"),
     *   @SWG\Parameter(
     *      name="filterApplicant",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *         @SWG\Property(property="search", type="string", description="Keyword for searching profile name", example="John"),
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
     *         ),
     *         @SWG\Property(
     *              property="chosen_country_of_residence",
     *              type="array",
     *              description="Selected country of residence data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="value", type="integer", description="Country id", example=1)
     *              )
     *         ),
     *         @SWG\Property(
     *              property="immaper_status",
     *              type="array",
     *              description="Selected immaper status for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"is_immaper","not_immaper"},
     *                  description="it can be is_immaper or not_immaper"
     *              )
     *         ),
     *         @SWG\Property(
     *              property="select_gender",
     *              type="array",
     *              description="Selected gender for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"male","female","do_not_want_specify", "other"},
     *                  description="it can be male or female or Do not want to specify or other"
     *              )
     *         ),
     *         @SWG\Property(
     *              property="is_available",
     *              type="array",
     *              description="Selected available or not for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"available","not_available"},
     *                  description="it can be available or not_available"
     *              )
     *         )
     *      )
     *    )
     *
     * )
     *
     **/
    public function filterApplicants(Request $request, $id, $status_id)
    {
        $validatedData = $this->validate($request, self::APPLICANT_FILTER_RULES);

        $search = $validatedData['search'];
        $degree_levels = $validatedData['chosen_degree_level'];
        $languages = $validatedData['chosen_language'];
        $sectors = $validatedData['chosen_sector'];
        $skills = $validatedData['chosen_skill'];
        $countries = $validatedData['chosen_country'];
        $field_of_works = $validatedData['chosen_field_of_work'];
        $nationalities = $validatedData['chosen_nationality'];
        $experience = $validatedData['experience'];
        $immaper_status = $validatedData['immaper_status'];
        $select_gender = $validatedData['select_gender'];
        $country_of_residence = $validatedData['chosen_country_of_residence'];
        $is_available = $validatedData['is_available'];


        $job = $this->model::findOrFail($id)
                ->users()
                ->whereIn('users.status', ['Active', 'Inactive'])
                ->orderBy('job_user.created_at', 'desc');

        $movedusers = User::whereIn('status', ['Active', 'Inactive']);

        // for a user who don't have access to archive feature
        if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile']))
        {
            $job = $job->where('users.archived_user', "no");
            $movedUsers = $movedusers->where('archived_user', 'no');
        }

        if (!empty($validatedData['search'])) {
            $job = $job->search($search);
        }

        $users = $job->wherePivot('job_status_id', $status_id);

        $users = $users->with(['job_user_history_status'=>function($q) use ($id){
            return $q->select('id', 'user_id', 'user_move_id', 'created_at')
                ->with(['mover'=>function($q){
                    return $q->select('id', 'full_name');
                }])
                ->where('job_id', $id)->where('is_current_status', 1);
        }]);

        $movedusers = $movedusers->whereHas('job_user_history_status',
            function($q) use($status_id, $id) {
                $q->where('is_current_status', 0)->where('job_status_id', $status_id)->where('job_id', $id)
                    ->where('deleted', 0);
            })->with(['job_user_history_status'=>function($q) use ($id){
                return $q->select('id', 'user_id', 'job_status_id', 'user_move_id', 'created_at')
                    ->with(['mover'=>function($q){
                        return $q->select('id', 'full_name');
                    }])->with(['order_status'=>function($q){
                        return $q->select('id', 'order');
                    }])
                    ->where('job_id', $id)->where('is_current_status', 1)->where('deleted', 0);
                }])->with(['job_user'=>function($q) use($id){
            return $q->where('job_id', $id)->with('job_user_tests');
        }]);

        if (!empty($is_available)) {
            if (count($is_available) == 1 && in_array("available", $is_available)) {
                $users = $users->whereDoesntHave('profile.p11_employment_records', function($query) {
                    $query->where('untilNow', 1);
                });
                $movedusers = $movedusers->whereDoesntHave('profile.p11_employment_records', function($query) {
                    $query->where('untilNow', 1);
                });

            }

            if (count($is_available) == 1 && in_array("not_available", $is_available)) {
                $users = $users->whereHas('profile.p11_employment_records', function($query) {
                    $query->where('untilNow', 1);
                });

                $movedusers = $movedusers->whereHas('profile.p11_employment_records', function($query) {
                    $query->where('untilNow', 1);
                });
            }
        }
       if(!empty($validatedData['minimum_requirements']) && $validatedData['minimum_requirements'] === true) {
        foreach ($this->model::findOrFail($id)->tor->matching_requirements as $matching_requirement) {
            switch ($matching_requirement['requirement']) {
                case "skill":
                    $users = $users->whereHas('profile.skills', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "skill")) {
                            $query->where('skill_id', $matching_requirement['requirement_value']->skill->value);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "proficiency")) {
                            $query = $this->minParameter('proficiency', $matching_requirement['requirement_value']->proficiency, $query);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "experience")) {
                            $query = $this->minParameter('years', $matching_requirement['requirement_value']->experience, $query);
                        }
                    });
                    break;

                case "language":
                    $users = $users->whereHas('profile.p11_languages', function ($query) use ($matching_requirement) {
                        $query->where('language_id', $matching_requirement['requirement_value']->language->value);
                        if (property_exists($matching_requirement['requirement_value'], "language_level")) {
                            $language_level = LanguageLevel::findOrFail($matching_requirement['requirement_value']->language_level->value);
                        }
                        $language_levels = LanguageLevel::select('id')->where('order', '>=', $language_level->order)->orderBy('order', 'asc')->get();
                        $language_levels = $language_levels->pluck('id');

                        foreach ($language_levels as $key => $language_id) {
                            if ($key == 0) {
                                $query->where('language_level_id', $language_id);
                            } else {
                                $query->orWhere('language_level_id', $language_id);
                            }
                        }

                        $query = $this->languageParameter($matching_requirement['requirement_value'], $query);
                    });
                    break;

                case "sector":
                    $users  = $users->whereHas('profile.sectors', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "sector")) {
                            $query->where('sector_id', $matching_requirement['requirement_value']->sector->value);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "experience")) {
                            $query = $this->minParameter('years', $matching_requirement['requirement_value']->experience, $query);
                        }
                    });
                    break;

                case "degree_level":
                    $users = $users->whereHas('profile.p11_education_universities', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "degree_level")) {
                            $degree_level = DegreeLevel::findOrFail($matching_requirement['requirement_value']->degree_level->value);
                        }
                        $degree_levels = DegreeLevel::select('id')->where('order', '>=', $degree_level->order)->orderBy('order', 'asc')->get();
                        $degree_levels = $degree_levels->pluck('id');

                        foreach ($degree_levels as $key => $degree_id) {
                            if ($key == 0) {
                                $query->where('degree_level_id', $degree_id);
                            } else {
                                $query->orWhere('degree_level_id', $degree_id);
                            }
                        }

                        if (!empty($matching_requirement['requirement_value']->study)) {
                            $query = $this->textParameter('study', $matching_requirement['requirement_value']->study, $query);
                        }
                        if (!empty($matching_requirement['requirement_value']->degree)) {
                            $query = $this->textParameter('degree', $matching_requirement['requirement_value']->degree, $query);
                        }
                    });
                    break;
                default:
            }
           }
          }

        if (!empty($country_of_residence)) {
            $users = $users->whereHas('profile', function($query) use ($country_of_residence) {
                $query->where('country_residence_id', $country_of_residence['value']);
            });

            $movedusers = $movedusers->whereHas('profile', function($query) use ($country_of_residence) {
                $query->where('country_residence_id', $country_of_residence['value']);
            });
        }

        if (!empty($immaper_status)) {
            if (count($immaper_status) < 2) {
                foreach ($immaper_status as $immaper) {
                    if ($immaper == "is_immaper") {
                        $users = $this->iMMAPerFromUserQuery($users);
                        $movedusers = $users = $this->iMMAPerFromUserQuery($movedusers);
                    } elseif ($immaper == "not_immaper") {
                        $users = $this->nonIMMAPerFromUserQuery($users);
                        $movedusers = $this->nonIMMAPerFromUserQuery($movedusers);
                    }
                }
            }
        }

        if (!empty($select_gender)) {
            $users = $users->whereHas('profile', function ($query) use ($select_gender) {
                foreach ($select_gender as $key => $gender) {
                    if ($key == 0) {
                        if ($gender == 'male') {
                            $query->where(function($male_gender) use ($gender) {
                                $male_gender->where('gender', 1);
                            });
                        }elseif ($gender == 'female') {
                            $query->where(function($female_gender) use ($gender) {
                                $female_gender->where('gender', 0);
                            });
                        }elseif ($gender == 'do_not_want_specify') {
                            $query->where(function($specify_gender) use ($gender) {
                                $specify_gender->where('gender', 2);
                            });
                        }elseif ($gender == 'other') {
                            $query->where(function($other) use ($gender) {
                                $other->where('gender', 3);
                            });
                        }
                    }else {
                        if ($gender == 'male') {
                            $query->orWhere(function($male_gender) use ($gender) {
                                $male_gender->where('gender', 1);
                            });
                        }elseif ($gender == 'female') {
                            $query->orWhere(function($female_gender) use ($gender) {
                                $female_gender->where('gender', 0);
                            });
                        }elseif ($gender == 'do_not_want_specify') {
                            $query->orWhere(function($specify_gender) use ($gender) {
                                $specify_gender->where('gender', 2);
                            });
                        }elseif ($gender == 'other') {
                            $query->orWhere(function($other) use ($gender) {
                                $other->where('gender', 3);
                            });
                        }
                    }
                }
            });
        }


        if (!empty($degree_levels)) {
            $users = $users->whereHas('profile.p11_education_universities', function ($query) use ($degree_levels) {
                foreach($degree_levels as $key => $degree_level) {
                    $whereRaw = '( degree_level_id = ' . $degree_level['id'];

                    if (!empty($degree_level['degree'])) {
                        $whereRaw = $whereRaw . " AND " . '`degree` LIKE "%' . $degree_level['degree'] . '%" ';
                    }

                    if (!empty($degree_level['study'])) {
                        $whereRaw = $whereRaw . " AND " . '`study` LIKE "%' . $degree_level['study'] . '%" ';
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                       $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }

            });

            $movedusers = $movedusers->whereHas('profile.p11_education_universities', function ($query) use ($degree_levels) {
                foreach($degree_levels as $key => $degree_level) {
                    $whereRaw = '( degree_level_id = ' . $degree_level['id'];

                    if (!empty($degree_level['degree'])) {
                        $whereRaw = $whereRaw . " AND " . '`degree` LIKE "%' . $degree_level['degree'] . '%" ';
                    }

                    if (!empty($degree_level['study'])) {
                        $whereRaw = $whereRaw . " AND " . '`study` LIKE "%' . $degree_level['study'] . '%" ';
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                       $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }

            });
        }

        if (!empty($languages)) {
            $users = $users->whereHas('profile.p11_languages', function ($query) use ($languages) {
                foreach($languages as $key => $language) {
                    $whereRaw = '( language_id = ' . $language['id'];

                    if ($language['is_mother_tongue'] == 1) {
                        $whereRaw = $whereRaw . " AND " . 'is_mother_tongue = ' . $language['is_mother_tongue'];
                    }

                    if (!empty($language['language_level']['value'])) {
                        $whereRaw = $whereRaw . " AND " . 'language_level_id >= ' . $language['language_level']['value'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });

            $movedusers = $movedusers->whereHas('profile.p11_languages', function ($query) use ($languages) {
                foreach($languages as $key => $language) {
                    $whereRaw = '( language_id = ' . $language['id'];

                    if ($language['is_mother_tongue'] == 1) {
                        $whereRaw = $whereRaw . " AND " . 'is_mother_tongue = ' . $language['is_mother_tongue'];
                    }

                    if (!empty($language['language_level']['value'])) {
                        $whereRaw = $whereRaw . " AND " . 'language_level_id >= ' . $language['language_level']['value'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($sectors)) {
            $users = $users->whereHas('profile.p11_sectors', function ($query) use ($sectors) {
                foreach ($sectors as $key => $sector) {
                    $whereRaw = '( sector_id = ' . $sector['id'];

                    if ($sector['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $sector['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });

            $movedusers = $movedusers->whereHas('profile.p11_sectors', function ($query) use ($sectors) {
                foreach ($sectors as $key => $sector) {
                    $whereRaw = '( sector_id = ' . $sector['id'];

                    if ($sector['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $sector['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($countries)) {
            $users = $users->whereHas('profile.p11_country_of_works', function ($query) use ($countries) {
                foreach ($countries as $key => $country) {
                    $whereRaw = '( country_id = ' . $country['id'];

                    if ($country['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $country['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });

            $movedusers = $movedusers->whereHas('profile.p11_country_of_works', function ($query) use ($countries) {
                foreach ($countries as $key => $country) {
                    $whereRaw = '( country_id = ' . $country['id'];

                    if ($country['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $country['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($field_of_works)) {
            $users = $users->whereHas('profile.p11_field_of_works', function ($query) use ($field_of_works) {
                foreach ($field_of_works as $key => $field_of_work) {
                    if ($key == 0) {
                        $query->where('field_of_work_id', '=', $field_of_work['id']);
                    } else {
                        $query->orWhere('field_of_work_id', '=', $field_of_work['id']);
                    }
                }
            });

            $movedusers = $movedusers->whereHas('profile.p11_field_of_works', function ($query) use ($field_of_works) {
                foreach ($field_of_works as $key => $field_of_work) {
                    if ($key == 0) {
                        $query->where('field_of_work_id', '=', $field_of_work['id']);
                    } else {
                        $query->orWhere('field_of_work_id', '=', $field_of_work['id']);
                    }
                }
            });
        }

        if (!empty($nationalities)) {
            $users = $users->whereHas('profile.present_nationalities', function ($query) use ($nationalities) {
                foreach($nationalities as $key => $nationality) {
                    if ($key == 0) {
                        $query->where('p11_country_profile.country_id', '=', $nationality['id']);
                    } else {
                        $query->orWhere('p11_country_profile.country_id', '=', $nationality['id']);
                    }
                }
            });

            $movedusers = $movedusers->whereHas('profile.present_nationalities', function ($query) use ($nationalities) {
                foreach($nationalities as $key => $nationality) {
                    if ($key == 0) {
                        $query->where('p11_country_profile.country_id', '=', $nationality['id']);
                    } else {
                        $query->orWhere('p11_country_profile.country_id', '=', $nationality['id']);
                    }
                }
            });
        }

        if (!empty($skills)) {
            $users = $users->whereHas('profile.p11_skills', function ($query) use ($skills) {
                foreach ($skills as $key => $skill) {
                    $profiles = $profiles->whereHas('p11_skills', function ($query) use ($validatedData, $skill) {
                            $whereRaw = '( skill_id = ' . $skill['id'];

                            if ($skill['years'] > 0) {
                                $whereRaw = $whereRaw . " AND " . 'years >= ' . $skill['years'];
                            }

                            if ($skill['rating'] > 0) {
                                $whereRaw = $whereRaw . " AND " . 'proficiency >= ' . $skill['rating'];
                            }

                            $whereRaw = $whereRaw . ' )';
                            $query->whereRaw($whereRaw);
                        });
                    }
            });


            $movedusers = $movedusers->whereHas('profile.p11_skills', function ($query) use ($skills) {
                foreach ($skills as $key => $skill) {
                    $whereRaw = '( skill_id = ' . $skill['id'];

                    if ($skill['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $skill['years'];
                    }

                    if ($skill['rating'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'proficiency >= ' . $skill['rating'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if ($experience > 0) {
            $users = $users->whereHas('profile', function ($query) use ($experience) {
                $query->where('work_experience_years', '>=', $experience);
            });

            $movedusers = $movedusers->whereHas('profile', function ($query) use ($experience) {
                $query->where('work_experience_years', '>=', $experience);
            });
        }

        $users = $users->select('users.id', 'full_name', 'users.archived_user')->with([
            'profile:id,user_id,gender',
            'profile.p11_references' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'profile.p11_references.referenceHistories' => function ($query) use ($id) {
                $query->where('job_id', $id);
            },
            'profile.p11_references.referenceHistories.attachment',
            'profile.interview_request_contract'=> function ($query) use ($id) {
                return $query->orderBy('created_at', 'desc');
            },
            'profile.latest_education_universities' => function ($query) {
                return $query->select('id','profile_id','degree_level_id','attended_to','degree');
            },
            'profile.latest_education_universities.degree_level' => function ($query) {
                return $query->select('id', 'name');
            },
            'user_interview_files' => function ($query) use ($id) {
                return $query->select('id','job_id','user_id','media_id','user_interview_name','user_interview_email','file_name','user_interview_id')->where('job_id', $id);
            },
            'job_user'=> function ($query) use ($id) {
                return $query->where('job_id', $id);
            },
            'job_user.job',
            'job_user.job.interview_questions',
            'job_user.job_interview_scores',
            'job_user.job_interview_global_impression',
            'job_user.job_interview_scores.interviewQuestion',
            'job_user.job_user_tests',
        ])->withCount([
            'user_comments' => function ($query) use ($id) {
                return $query->where('job_id', $id)->whereNotNull('comment_by_id');
            },
        ])->get();

        $movedusers = $movedusers->select('users.id', 'full_name', 'users.archived_user')->with([
            'profile:id,user_id',
            'profile.latest_education_universities' => function ($query) {
                return $query->select('id','profile_id','degree_level_id','attended_to','degree');
            },
            'profile.latest_education_universities.degree_level' => function ($query) {
                return $query->select('id', 'name');
            },

        ])->get();
        $users->each(function ($user) {
            $profile = $user->profile;
            $profile->p11_references->each(function ($reference) {
            if(isset($reference->referenceHistories) && isset($reference->referenceHistories[0])) {
                $attachment = $reference->referenceHistories[0]->attachment;
                if (isset($attachment) && $attachment !== null) {
                   $media = Media::where('model_id', $attachment->id)->where('collection_name', 'p11_references')->where('disk', 's3')->where('model_type', 'App\Models\Attachment')->latest('id')->first();
                   if($media) {
                          $reference->reference_file = collect([
                            'url' => '/storage/'.$media->id.'/'.$media->file_name,
                            'mime_type' => $media->mime_type,
                            'file_name' => $media->file_name,
                          ]);
                          $reference->setHidden(['media', 'attachment']);
                   }
                }
            }
        });
        $user->profile = $profile;
    });

        $isManager= JobManager::select('id')->where('job_id', $id)->where('user_id', auth()->user()->id)->first();

        return response()->success(__('crud.success.default'),
            array('users'=>$users,'moveduser'=>$movedusers, 'is_manager'=>$isManager, )
        );
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/change-status",
     *   tags={"Job"},
     *   summary="Change applicants status",
     *   description="File: app\Http\Controllers\API\JobController@changeApplicantStatus, permission:Change Applicant Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"job_status_id", "user_id"},
     *          @SWG\Property(property="job_status_id", type="integer", description="Job status id", example=3),
     *          @SWG\Property(property="user_id", type="integer", description="User id", example=3)
     *      )
     *   )
     *
     * )
     *
     **/
    public function changeApplicantStatus(Request $request, $id)
    {
        $rules = [
            'job_status_id' => 'required|integer|exists:job_status,id',
            'user_id' => 'required|integer'
        ];
        $validatedData = $this->validate($request, $rules);
        $job = $this->model::with(['users', 'users.profile'])->findOrFail($id);

        if ($job->tor->job_standard->under_sbp_program == "yes") {
            $sbpJobStatus = JobStatus::where('under_sbp_program', 'yes')->get()->pluck('id')->toArray();
            if (!in_array($validatedData['job_status_id'], $sbpJobStatus) && !empty($sbpJobStatus)) {
                return response()->error(__('job.error.incorrect_step_for_sbp_job'), 422);
            }
        }

        $user = $job->users()->with(['profile'])->find($validatedData['user_id']);
        $user->pivot->job_status_id = $validatedData['job_status_id'];

        $this->changeUserStatusBasedOnNewJobStatus($user, $validatedData['job_status_id']);

        Job_user_move_status_history::where('job_id', $id)->where('user_id', $validatedData['user_id'])->update(
            array(
                "is_current_status" => 0
            )
        );

        if($validatedData['job_status_id']==7) {//active
            Job_user_move_status_history::where('job_id', $id)->where('user_id', $validatedData['user_id'])
                ->where('is_current_status', 0)->whereIn('job_status_id', [8, 4, 1, 7])
                ->update(
                    array(
                        "deleted" => 1
                    )
            );
        }
        elseif ($validatedData['job_status_id']==8) {//shortlisted
            Job_user_move_status_history::where('job_id', $id)->where('user_id', $validatedData['user_id'])
                ->where('is_current_status', 0)->whereIn('job_status_id', [4, 1, 8])
                ->update(
                    array(
                        "deleted" => 1
                    )
            );
        }
        elseif ($validatedData['job_status_id']==9) {//Reference Check
            $references = P11Reference::where('profile_id', $user->profile->id)->get();
            if($references->count() > 0) {
                foreach ($references as $reference) {
                    $reference->clearMediaCollection('reference_file'.$reference->id.$job->title);
                }
            }
        }
        elseif ($validatedData['job_status_id']==4) {//Interview
            Job_user_move_status_history::where('job_id', $id)->where('user_id', $validatedData['user_id'])
                ->where('is_current_status', 0)->whereIn('job_status_id', [1, 6, 4])
                ->update(
                    array(
                        "deleted" => 1
                    )
            );
        }
        elseif ($validatedData['job_status_id']==1) {//Accepted
            Job_user_move_status_history::where('job_id', $id)->where('user_id', $validatedData['user_id'])
                ->where('is_current_status', 0)->whereIn('job_status_id', [6, 1, 8])
                ->update(
                    array(
                        "deleted" => 1
                    )
            );
        }

        $move=Job_user_move_status_history::create([
            'job_id'=>$id,
            'user_id'=>$validatedData['user_id'],
            'job_status_id'=>$validatedData['job_status_id'],
            'user_move_id' =>auth()->user()->id
        ]);

        $user->pivot->save();

        $job_status = JobStatus::findOrFail($validatedData['job_status_id']);

       /* if ($job_status->last_step == 1) {
            $hr_manager = auth()->user();
            Mail::to($user->email)->cc(config('immapemail.hrImmapEmail'))->send(new JobAccepted($job->title, $user->full_name, $hr_manager->immap_email, $hr_manager['immap_email']));
        }*/

        // if ($validatedData['job_status_id']==6) {
        //     Mail::to($user->email)->send(new JobRejected($job->title, $user->full_name));
        // }

        $managerArray=Array();
        if ($validatedData['job_status_id']==4) {

            $userids=Array();
            $jobuser = DB::table('job_user')->select('user_id')
                ->where('job_status_id', 4)
                ->where('job_id', $id)->get()->toArray();

            foreach($jobuser as $iduser){
                array_push($userids, $iduser->user_id);
            }

            $getManager= JobManager::select('job_id', 'user_id', 'email', 'label', 'name')
                ->where('job_id', $id)
                ->get();

            if($getManager->count()>0) {

                foreach($getManager->toArray() as $mn){
                    array_push($managerArray, [
                        'id'=>$mn['user_id'],
                        'label'=>$mn['name'],
                        'value'=>$mn['email'],
                    ]);
                }
                DB::table('job_user')->where('job_id', $id)->whereIn('user_id', $userids)
                    ->update(['panel_interview' => json_encode($managerArray)]);


            }

        }

        return response()->success(__('job.success.change_applicant_status'));
    }


    protected function languageParameter($param, $query)
    {

        if ($param->is_mother_tongue == 1) {
            $query = $query->where('is_mother_tongue', $param->is_mother_tongue);
        }

        return $query;
    }

    protected function rangeParameter($field, $parameter_value, $query)
    {
        $param = json_decode($parameter_value);
        return $query->where($field, '>=', $param->min)->where($field, '<=', $param->max);
    }

    protected function minParameter($field, $parameter_value, $query)
    {
        return $query->where($field, '>=', $parameter_value);
    }

    protected function maxParameter($field, $parameter_value, $query)
    {
        return $query->where($field, '<=', $parameter_value);
    }

    protected function numberParameter($field, $parameter_value, $query)
    {
        return $query->where($field, $parameter_value);
    }

    protected function textParameter($field, $parameter_value, $query)
    {
        return $query->where($field, 'like', '%' . $parameter_value . '%');
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/recommendations",
     *   tags={"Job"},
     *   summary="Filter recommendation",
     *   description="File: app\Http\Controllers\API\JobController@recommendations, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="filterRecommendation",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *         @SWG\Property(property="search", type="string", description="Keyword for searching profile name", example="John"),
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
     *         ),
     *         @SWG\Property(
     *              property="chosen_country_of_residence",
     *              type="array",
     *              description="Selected country of residence data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="value", type="integer", description="Country id", example=1)
     *              )
     *         ),
     *         @SWG\Property(
     *              property="immaper_status",
     *              type="array",
     *              description="Selected immaper status for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"is_immaper","not_immaper"},
     *                  description="it can be is_immaper or not_immaper"
     *              )
     *         ),
     *         @SWG\Property(
     *              property="select_gender",
     *              type="array",
     *              description="Selected gender for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"male","female","do_not_want_specify", "other"},
     *                  description="it can be male or female or Do not want to specify or other"
     *              )
     *         ),
     *         @SWG\Property(
     *              property="is_available",
     *              type="array",
     *              description="Selected available or not for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"available","not_available"},
     *                  description="it can be available or not_available"
     *              )
     *         )
     *      )
     *    )
     * )
     */
    public function recommendations(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'chosen_sector' => 'sometimes|nullable|array',
            'chosen_sector.*.id' => 'sometimes|nullable|integer',
            'chosen_sector.*.years' => 'sometimes|nullable|integer',
            'chosen_skill' => 'sometimes|nullable|array',
            'chosen_skill.*.id' => 'sometimes|nullable|integer',
            'chosen_skill.*.years' => 'sometimes|nullable|integer',
            'chosen_skill.*.rating' => 'sometimes|nullable|integer',
            'chosen_language' => 'sometimes|nullable|array',
            'chosen_language.*.id' => 'sometimes|nullable|integer',
            'chosen_language.*.is_mother_tongue' => 'sometimes|nullable|boolean',
            'chosen_language.*.language_level.value' => 'sometimes|nullable|integer',
            'chosen_degree_level' => 'sometimes|nullable|array',
            'chosen_degree_level.*.id' => 'sometimes|nullable|integer',
            'chosen_degree_level.*.degree' => 'sometimes|nullable|string',
            'chosen_degree_level.*.study' => 'sometimes|nullable|string',
            'chosen_field_of_work' => 'sometimes|nullable|array',
            'chosen_field_of_work.*.id' => 'sometimes|nullable|integer|exists:field_of_works,id',
            'chosen_nationality' => 'sometimes|nullable|array',
            'chosen_nationality.*.id' => 'sometimes|nullable|integer|exists:countries,id',
            'chosen_country' => 'sometimes|nullable|array',
            'chosen_country.*.id' => 'sometimes|nullable|integer|exists:countries,id',
            'chosen_country.*.years' => 'sometimes|nullable|integer',
            'chosen_country_of_residence' => 'sometimes|nullable|array',
            'chosen_country_of_residence.*.value' => 'sometimes|nullable|integer|exists:countries,id',
            'search' => 'sometimes|nullable|string',
            'experience' => 'sometimes|nullable|integer|min:0|max:10',
            'immaper_status' => 'sometimes|nullable|array',
            'immaper_status.*' => 'sometimes|nullable|in:is_immaper,not_immaper,both',
            'select_gender' => 'sometimes|nullable|array',
            'select_gender.*' => 'sometimes|nullable|in:male,female,do_not_want_specify,other,both',
            'is_available' => 'sometimes|nullable|array',
            'is_available.*' => 'sometimes|nullable|in:available,not_available,both'
        ]);

        $job = $this->model::findOrFail($id);
        $profiles = Profile::select('*')->whereHas('user', function ($query) {
            $query->where('p11Completed', 1)->whereIn('status', ['Active', 'Inactive'])->where('archived_user', 'no');
        });

        foreach ($job->tor->matching_requirements as $matching_requirement) {
            switch ($matching_requirement['requirement']) {
                case "skill":
                    $profiles = $profiles->whereHas('skills', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "skill")) {
                            $query->where('skill_id', $matching_requirement['requirement_value']->skill->value);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "proficiency")) {
                            $query = $this->minParameter('proficiency', $matching_requirement['requirement_value']->proficiency, $query);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "experience")) {
                            $query = $this->minParameter('years', $matching_requirement['requirement_value']->experience, $query);
                        }
                    });
                    break;

                case "language":
                    $profiles = $profiles->whereHas('p11_languages', function ($query) use ($matching_requirement) {
                        $query->where('language_id', $matching_requirement['requirement_value']->language->value);
                        if (property_exists($matching_requirement['requirement_value'], "language_level")) {
                            $language_level = LanguageLevel::findOrFail($matching_requirement['requirement_value']->language_level->value);
                        }
                        $language_levels = LanguageLevel::select('id')->where('order', '>=', $language_level->order)->orderBy('order', 'asc')->get();
                        $language_levels = $language_levels->pluck('id');

                        foreach ($language_levels as $key => $language_id) {
                            if ($key == 0) {
                                $query->where('language_level_id', $language_id);
                            } else {
                                $query->orWhere('language_level_id', $language_id);
                            }
                        }

                        $query = $this->languageParameter($matching_requirement['requirement_value'], $query);
                    });
                    break;

                case "sector":
                    $profiles = $profiles->whereHas('sectors', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "sector")) {
                            $query->where('sector_id', $matching_requirement['requirement_value']->sector->value);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "experience")) {
                            $query = $this->minParameter('years', $matching_requirement['requirement_value']->experience, $query);
                        }
                    });
                    break;

                case "degree_level":
                    $profiles = $profiles->whereHas('p11_education_universities', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "degree_level")) {
                            $degree_level = DegreeLevel::findOrFail($matching_requirement['requirement_value']->degree_level->value);
                        }
                        $degree_levels = DegreeLevel::select('id')->where('order', '>=', $degree_level->order)->orderBy('order', 'asc')->get();
                        $degree_levels = $degree_levels->pluck('id');

                        foreach ($degree_levels as $key => $degree_id) {
                            if ($key == 0) {
                                $query->where('degree_level_id', $degree_id);
                            } else {
                                $query->orWhere('degree_level_id', $degree_id);
                            }
                        }

                        if (!empty($matching_requirement['requirement_value']->study)) {
                            $query = $this->textParameter('study', $matching_requirement['requirement_value']->study, $query);
                        }
                        if (!empty($matching_requirement['requirement_value']->degree)) {
                            $query = $this->textParameter('degree', $matching_requirement['requirement_value']->degree, $query);
                        }
                    });
                    break;
                default:
            }
        }

        if (!empty($validatedData['search'])) {
            $profiles = $profiles->whereHas('user', function ($query) use ($request) {
                $query->search($request->search);
            });
        }

        if ($validatedData['experience'] > 0) {
            $profiles = $profiles->where('work_experience_years', '>=', $validatedData['experience']);
        }

        if (!empty($validatedData['immaper_status'])) {
            if (count($validatedData['immaper_status']) < 2) {
                foreach ($validatedData['immaper_status'] as $immaper) {
                    if ($immaper == "is_immaper") {
                        $profiles = $this->iMMAPerFromProfileQuery($profiles);
                    } elseif ($immaper == "not_immaper") {
                        $profiles = $this->nonIMMAPerFromProfileQuery($profiles);
                    }
                }
            }
        }

        if (!empty($validatedData['select_gender'])) {
            $profiles = $profiles->where(function($query) use ($validatedData) {
                foreach($validatedData['select_gender'] as $key => $gender) {
                    if ($key == 0) {
                        if ($gender == 'male') {
                            $query->where(function($male_gender) use ($gender) {
                                $male_gender->where('gender', 1);
                            });
                        }elseif ($gender == 'female') {
                            $query->where(function($female_gender) use ($gender) {
                                $female_gender->where('gender', 0);
                            });
                        }elseif ($gender == 'do_not_want_specify') {
                            $query->where(function($specify_gender) use ($gender) {
                                $specify_gender->where('gender', 2);
                            });
                        }elseif ($gender == 'other') {
                            $query->where(function($other) use ($gender) {
                                $other->where('gender', 3);
                            });
                        }
                    }else {
                        if ($gender == 'male') {
                            $query->orWhere(function($male_gender) use ($gender) {
                                $male_gender->where('gender', 1);
                            });
                        }elseif ($gender == 'female') {
                            $query->orWhere(function($female_gender) use ($gender) {
                                $female_gender->where('gender', 0);
                            });
                        }elseif ($gender == 'do_not_want_specify') {
                            $query->orWhere(function($specify_gender) use ($gender) {
                                $specify_gender->where('gender', 2);
                            });
                        }elseif ($gender == 'other') {
                            $query->orWhere(function($other) use ($gender) {
                                $other->where('gender', 3);
                            });
                        }
                    }
                }
            });
        }

        if (!empty($validatedData['is_available'])) {
            if (count($validatedData['is_available']) == 1 && in_array("available", $validatedData['is_available'])) {
                $profiles = $profiles->whereDoesntHave('p11_employment_records', function ($query) {
                    $query->where('untilNow', 1);
                });
            }

            if (count($validatedData['is_available']) == 1 && in_array("not_available", $validatedData['is_available'])) {
                $profiles = $profiles->whereHas('p11_employment_records', function ($query) {
                    $query->where('untilNow', 1);
                });
            }
        }

        if (!empty($validatedData['chosen_country_of_residence'])) {
            $profiles = $profiles->where('country_residence_id', $validatedData['chosen_country_of_residence']['value']);
        }

        if (!empty($validatedData['chosen_language'])) {
            $profiles = $profiles->whereHas('p11_languages', function ($query) use ($validatedData) {
                foreach($validatedData['chosen_language'] as $key => $language) {
                    $whereRaw = '( language_id = ' . $language['id'];

                    if ($language['is_mother_tongue'] == 1) {
                        $whereRaw = $whereRaw . " AND " . 'is_mother_tongue = ' . $language['is_mother_tongue'];
                    }

                    if (!empty($language['language_level']['value'])) {
                        $whereRaw = $whereRaw . " AND " . 'language_level_id >= ' . $language['language_level']['value'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });

        }

        if (!empty($validatedData['chosen_degree_level'])) {
            $degree_levels = $validatedData['chosen_degree_level'];
            $profiles = $profiles->whereHas('p11_education_universities', function ($query) use ($degree_levels) {
                foreach($degree_levels as $key => $degree_level) {
                    $whereRaw = '( degree_level_id = ' . $degree_level['id'];

                    if (!empty($degree_level['degree'])) {
                        $whereRaw = $whereRaw . " AND " . '`degree` LIKE "%' . $degree_level['degree'] . '%" ';
                    }

                    if (!empty($degree_level['study'])) {
                        $whereRaw = $whereRaw . " AND " . '`study` LIKE "%' . $degree_level['study'] . '%" ';
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                       $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }

            });

        }

        if (!empty($validatedData['chosen_sector'])) {
            $profiles = $profiles->whereHas('p11_sectors', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_sector'] as $key => $sector) {
                    $whereRaw = '( sector_id = ' . $sector['id'];

                    if ($sector['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $sector['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_country'])) {
            $profiles = $profiles->whereHas('p11_country_of_works', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_country'] as $key => $country) {
                    $whereRaw = '( country_id = ' . $country['id'];

                    if ($country['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $country['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_skill'])) {
            $profiles = $profiles->whereHas('p11_skills', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_skill'] as $key => $skill) {
                    $whereRaw = '( skill_id = ' . $skill['id'];

                    if ($skill['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $skill['years'];
                    }

                    if ($skill['rating'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'proficiency >= ' . $skill['rating'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_field_of_work'])) {
            $profiles = $profiles->whereHas('p11_field_of_works', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_field_of_work'] as $key => $field_of_work) {
                    if ($key == 0) {
                        $query->where('field_of_work_id', '=', $field_of_work['id']);
                    } else {
                        $query->orWhere('field_of_work_id', '=', $field_of_work['id']);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_nationality'])) {
            $profiles = $profiles->whereHas('present_nationalities', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_nationality'] as $key => $nationality) {
                    if ($key == 0) {
                            $query->where('country_id', '=', $nationality['id']);
                    } else {
                            $query->orWhere('country_id', '=', $nationality['id']);
                    }
                }
            });
        }

        if (!empty($validatedData['download'])) {
            if ($validatedData['download']) {
                $profiles = $profiles->select('id', 'skype', 'is_immaper', 'verified_immaper', 'immap_email', 'user_id')->get();
                $roster_profiles = [];
                foreach ($profiles as $key => &$profile) {
                    $roster_profile = new \stdClass;
                    $roster_profile->fullname = $profile->user->full_name;
                    $roster_profile->status = $rosterStep->step;
                    $roster_profile->email = $profile->user->email;
                    $roster_profile->is_immaper = $this->checkIMMAPerFromSelectedProfile($profile) ? 'iMMAPer' : 'Not iMMAPer';
                    $roster_profile->immap_email = $profile->immap_email;
                    $roster_profile->skype = $profile->skype;
                    if (!empty($profile->sectors)) {
                        $roster_profile->sectors = $profile->sectors()->pluck('name')->implode(', ');
                    }
                    if (!empty($profile->skills)) {
                        $roster_profile->skills = $profile->skills()->pluck('skill')->implode(', ');
                    }
                    if (!empty($profile->languages)) {
                        $roster_profile->languages = $profile->languages()->pluck('name')->implode(', ');
                    }
                    if (!empty($profile->field_of_works)) {
                        $roster_profile->field_of_works = $profile->field_of_works()->pluck('field')->implode(', ');
                    }
                    if (!empty($profile->present_nationalities)) {
                        $roster_profile->nationalities = $profile->present_nationalities()->pluck('name')->implode(', ');
                    }
                    array_push($roster_profiles, $roster_profile);
                }

                $roster_profiles = collect($roster_profiles);

                $roster_profiles = new RosterExport($roster_profiles);
                ob_end_clean(); // this
                ob_start(); // and this
                return Excel::download($roster_profiles, 'roster.csv');
            }
        }

        $profiles = $profiles->with('user')->paginate(self::RECOMMENDATION_PAGINATE);


        return response()->success(__('crud.success.default'), ['title' => $job->title, 'country' => $job->country->name, 'profiles' => $profiles]);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/send-invitations",
     *   tags={"Job"},
     *   summary="send invitations",
     *   description="File: app\Http\Controllers\API\JobController@sendInvitations, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *       name="job",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"ids"},
     *          @SWG\Property(
     *              property="ids", type="array",
     *              @SWG\Items(
     *                  type="integer",
     *                  description="Profile id",
     *                  example=1,
     *              )
     *          )
     *       )
     *   )
     *
     * )
     *
     **/
    public function sendInvitations(Request $request, $id)
    {
        $validatedData = $this->validate($request, ['ids' => 'required|array', 'ids.*' => 'required|integer']);
        $job = $this->model::findOrFail($id);


        foreach ($request->ids as $profileId) {
            $profile = Profile::findOrFail($profileId);
            if (!empty($profile)) {
                $hr_manager = auth()->user();
                Mail::to($profile->user->email)->send(new JobInvitation($job, $profile, $hr_manager['immap_email']));

                if (Mail::failures()) {
                    return response()->error(__('crud.error.default'), 500);
                }

                $hr_manager = auth()->user();

                Mail::to($hr_manager['immap_email'])->send(
                    new JobSendConfirmationMail($profile->user->full_name, $job->id, $job->title, $hr_manager['full_name'])
                );
            }
        }

        return response()->success(__('job.success.send_invitation'));
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/save-interview-date",
     *   tags={"Job"},
     *   summary="save interview date",
     *   description="File: app\Http\Controllers\API\JobController@saveInterviewDate, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="jobs",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"user_id", "interviewDate", "job_status_id"},
     *          @SWG\Property(property="user_id", type="integer", description="User id", example=6),
     *          @SWG\Property(
     *              property="interviewDate",
     *              description="Interview date (date_format: Y-m-d H:i:s)",
     *              type="string",
     *              format="date"
     *          ),
     *          @SWG\Property(property="job_status_id", type="integer", description="Job status id", example=1)
     *      )
     *    )
     * )
     *
     **/
    public function saveInterviewDate(Request $request, $id)
    {
        $validatedData = $this->validate($request, ['user_id' => 'required|integer', 'interviewDate' => 'required|date_format:Y-m-d H:i:s', 'job_status_id' => 'required|integer', 'timezone' => 'sometimes|string']);
        $jobStatus = JobStatus::select('id')->where('is_interview', 1)->findOrFail($validatedData['job_status_id']);

        if (empty($jobStatus)) {
            return response()->error(__('job.error.notFoundOrIsNotInterview'), 404);
        }

        if ($jobStatus->id != $validatedData['job_status_id']) {
            return response()->error(__('job.error.notFoundOrIsNotInterview'), 404);
        }

        $job = $this->model::findOrFail($id);

        $job->users()->where('job_status_id', $validatedData['job_status_id'])->updateExistingPivot($validatedData['user_id'], ['interview_date' => $validatedData['interviewDate']]);
        if(isset($validatedData['timezone'])) $job->users()->where('job_status_id', $validatedData['job_status_id'])->updateExistingPivot($validatedData['user_id'], ['timezone' => $validatedData['timezone']]);
        return response()->success(__('crud.success.default'), $job);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/send-interview-invitation",
     *   tags={"Job"},
     *   summary="send interview invitation",
     *   description="File: app\Http\Controllers\API\JobController@sendInterviewInvitation, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="jobs",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"user_id", "interviewDate", "timezone", "immaper_invite", "panel_interview", "interview_type"},
     *          @SWG\Property(property="user_id", type="integer", description="User id", example=6),
     *          @SWG\Property(
     *              property="interviewDate",
     *              description="Interview date (date_format: Y-m-d H:i:s)",
     *              type="string",
     *              format="date"
     *          ),
     *          @SWG\Property(property="timezone", type="string", description="timezone (value should exist in timezone.php inside config folder)", example="Asia/Jakarta"),
     *          @SWG\Property(property="skype_id", type="string", description="Skype id", example="live:johndoe"),
     *          @SWG\Property(
     *              property="immaper_invite",
     *              type="array",
     *              description="List of iMMAPer email address who are invited in the interview",
     *              @SWG\Items(
     *                  type="string",
     *                  description="iMMAPer email address",
     *                  example="jdoe@organization.org"
     *              )
     *          ),
     *          @SWG\Property(property="interview_type", type="integer", enum={0,1}, description="Interview type, (0 = online interview, 1 = physical interview)", example=1),
     *          @SWG\Property(property="interview_address", type="string", description="Interview address if physical interview", example="Baker Street 221B"),
     *          @SWG\Property(
     *              property="panel_interview",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="id",
     *                      type="integer",
     *                      description="User id",
     *                      example=3
     *                  ),
     *                  @SWG\Property(
     *                      property="label",
     *                      type="string",
     *                      description="email and name for select field",
     *                      example="jdoe@organization.org - (John Doe)"
     *                  ),
     *                  @SWG\Property(
     *                      property="value",
     *                      type="string",
     *                      description="iMMAPer email address",
     *                      example="jdoe@organization.org"
     *                  )
     *              )
     *          ),
     *      )
     *    )
     * )
     *
     **/
    public function sendInterviewInvitation(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'user_id' => 'required|integer',
            'interview_date' => 'required|date_format:Y-m-d H:i:s',
            'timezone' => 'required|in:' . implode(",", config('timezone')),
            'skype_id' => 'sometimes|nullable|string',
            'immaper_invite' => 'required|array',
            'panel_interview' => 'required|array',
            'interview_type' => 'required|boolean',
            'interview_address' => 'sometimes|nullable|required_if:interview_type,1|string',
            'microsoft_access_token' => 'sometimes|nullable|string',
            'microsoft_refresh_token' => 'sometimes|nullable|string',
            'microsoft_token_expire' => 'sometimes|nullable|string',
            'commentText' => 'sometimes|nullable|string',
        ]);


        $calendarService = new CalendarService();

        if(empty($validatedData['microsoft_access_token'])) {
            return response()->error(config('microsoft_graph.URL_AUTHORIZE'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $graphKeys = [];
        $graphKeys['microsoft_access_token'] = $validatedData['microsoft_access_token'];
        $graphKeys['microsoft_refresh_token'] = $validatedData['microsoft_refresh_token'];
        $graphKeys['microsoft_token_expire'] = $validatedData['microsoft_token_expire'];

        $job = $this->model::findOrFail($id);
        $user = User::findOrFail($validatedData['user_id']);

        $hr_manager = auth()->user();
        $result = '';

        if (!empty($hr_manager->profile->end_of_current_contract) && $hr_manager->can('Change Applicant Status')) {
            if ($this->checkIMMAPerFromSelectedUser($hr_manager)) {

                // Create online event

                $event = [];
                $event['eventSubject'] = $job->title;
                $event['isOnline'] = $validatedData['interview_type'] != 1;
                $event['eventAttendees'] = array_merge($validatedData['immaper_invite'], [$hr_manager->immap_email, $user->email]);
                $event['eventEnd'] = Carbon::parse($validatedData['interview_date'])->addHour(1)->format('l, d F Y, H:i');
                $event['eventStart'] = date('l, d F Y, H:i', strtotime($validatedData['interview_date']));
                $event['timezone'] = $validatedData['timezone'];
                if($validatedData['interview_type'] != 1) {
                $event['eventBody'] = '<p style="font-size:16px;color:#74787e;line-height:1.4"><span style="color:black;font-weight:bold;">Dear '.$user->full_name.'</span>,<br /><br />Congratulations, your profile was selected as a match for the <strong>'.$job->title.'</strong> position.<br /><br />We would like to invite you for an online interview using the link from below (Microsoft Teams).<br />
                Proposed date: <strong>'.date('l, d F Y, H:i', strtotime($validatedData['interview_date'])).' '.$validatedData['timezone'].' time</strong>.<br /><br />
                Please confirm the scheduled interview by accepting this online meeting invite. Alternatively, please reply to '.$hr_manager->immap_email.' with your suggested date and time.<br /><br />
                <span style="padding-top: 10px;padding-bottom: 10px;font-size:16px;color:#74787e;line-height:1.4"><b>Additional Comments</b></br><i>'.nl2br($validatedData['commentText']).'</i></span><br /><br />
                Thank you and best regards,<br />
                3iSolution Careers</p>';
                } else {
                    $event['eventBody'] = '<p style="font-size:16px;color:#74787e;line-height:1.4"><span style="color:black;font-weight:bold;">Dear '.$user->full_name.'</span>,<br /><br />Congratulations, your profile was selected as a match for the <strong>'.$job->title.'</strong> position.<br /><br />We would like to invite you for an interview at '.$validatedData['interview_address'].'.<br />
                    Proposed date: <strong>'.date('l, d F Y, H:i', strtotime($validatedData['interview_date'])).' '.$validatedData['timezone'].' time</strong>.<br /><br />
                    Please confirm the scheduled interview by accepting this meeting invite. Alternatively, please reply to '.$hr_manager->immap_email.' with your suggested date and time.<br /><br />
                    <span style="padding-top: 10px;padding-bottom: 10px;font-size:16px;color:#74787e;line-height:1.4"><b>Additional Comments</b></br><i>'.nl2br($validatedData['commentText']).'</i></span><br /><br />
                    Thank you and best regards,<br />
                    3iSolution Careers</p>';
                }
                if($validatedData['interview_address']) {
                    $event['address'] = $validatedData['interview_address'];
                }

                $result = $calendarService->createNewEvent((object) $event, (object) $graphKeys);

                if(empty($result)) {
                    return response()->error(config('microsoft_graph.URL_AUTHORIZE'), Response::HTTP_INTERNAL_SERVER_ERROR);
                }

                try {
                if ($validatedData['interview_type'] == 1) {

                    Mail::to($user->email)->bcc($validatedData['immaper_invite'])
                        ->send(new JobPhysicalInterviewInvitation(
                            $job->title,
                            $user->full_name,
                            date('l, d F Y, H:i', strtotime($validatedData['interview_date'])),
                            $validatedData['timezone'],
                            $validatedData['skype_id'],
                            $hr_manager->immap_email,
                            $validatedData['interview_address'],
                            nl2br($validatedData['commentText']))
                        );

                    $job->users()->where('user_id', $validatedData['user_id'])->updateExistingPivot($validatedData['user_id'], ['interview_invitation_done' => 1, 'timezone' => $validatedData['timezone'], 'skype_id' => '', 'interview_date' => $validatedData['interview_date'], 'interview_type' => $validatedData['interview_type'], 'interview_address' => $validatedData['interview_address'], 'panel_interview' => json_encode($validatedData['panel_interview'])]);
                } else {
                    $skype = empty($request->skype_id) ? null : $request->skype_id;
                    Mail::to($user->email)->bcc($validatedData['immaper_invite'])
                        ->send(new InterviewInvitation(
                            $job->title,
                            $user->full_name,
                            date('l, d F Y, H:i', strtotime($validatedData['interview_date'])),
                            $validatedData['timezone'],
                            $skype,
                            $hr_manager->immap_email,
                            nl2br($validatedData['commentText']))
                        );

                    $job->users()->where('user_id', $validatedData['user_id'])->updateExistingPivot($validatedData['user_id'], ['interview_invitation_done' => 1, 'timezone' => $validatedData['timezone'], 'skype_id' => $skype, 'interview_date' => $validatedData['interview_date'], 'interview_type' => 0, 'interview_address' => '', 'panel_interview' => json_encode($validatedData['panel_interview'])]);
                }
            } catch(Swift_TransportException $err) {
                Log::info($err);
            }


                return response()->success(__('crud.success.default'), $result);
            }
        }

        return response()->error(__('crud.error.default'), Response::HTTP_FORBIDDEN);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/{id}/change-physical-interview",
     *   tags={"Job"},
     *   summary="change physical interview",
     *   description="File: app\Http\Controllers\API\JobController@changePhysicalInterview, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"user_id", "interview_type"},
     *          @SWG\Property(property="user_id", type="integer", description="User id", example=5),
     *          @SWG\Property(property="interview_type", type="integer", enum={0,1}, description="Interview type, (0 = online interview, 1 = physical interview)", example=1),
     *
     *      )
     *   )
     * )
     *
     **/
    public function changePhysicalInterview(Request $request, $id) {
        $validatedData = $this->validate($request, [
            'user_id' => 'required|integer|exists:users,id',
            'interview_type' => 'required|boolean',
        ]);

        $job = $this->model::findOrFail($id);

        if($validatedData['interview_type'] == 1) {
            $job->users()->where('user_id', $validatedData['user_id'])->updateExistingPivot($validatedData['user_id'], ['skype_id' => '', 'interview_type' => 1]);
        }

        if($validatedData['interview_type'] == 0) {
            $job->users()->where('user_id', $validatedData['user_id'])->updateExistingPivot($validatedData['user_id'], ['interview_address' => '', 'interview_type' => 0]);
        }

    }


    /**
     * @SWG\Post(
     *   path="/api/jobs/change_interview_order",
     *   tags={"Job"},
     *   summary="change interview order",
     *   description="File: app\Http\Controllers\API\JobController@update_interview_order, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"job_user_id", "interview_order"},
     *          @SWG\Property(property="job_user_id", type="integer", description="Job user id", example=5),
     *          @SWG\Property(property="interview_order", type="string", description="Interview order", example="1,2"),
     *
     *      )
     *   )

     * )
     *
     **/
    public function update_interview_order(Request $request) {
        $validatedData = $this->validate($request, [
            'job_id' => 'required|integer',
            'interview_order' => 'required|string',
        ]);

        $job = $this->model::findOrFail($validatedData['job_id']);
        if($job) {
            $job->interview_order =  $validatedData['interview_order'];
            $job->save();
        }

        return response()->success();
    }

    protected function sendToImmapWebsite($job, $method = "POST")
    {
        if (env('APP_ENV') == 'production') {
            $client = new Client();
            $url = config('immapwebsite.URL');
            $accessToken = config('immapwebsite.SECRET');

            if (!empty($url) && !empty($accessToken)) {
                $data = [
                    'headers' => ['AccessToken' => $accessToken],
                    'http_errors' => false,
                    'form_params' => [
                        'job_id' => $job->id,
                        'title' => $job->title,
                        'country' => $job->country->name,
                        'duty_station' => $job->tor->duty_station,
                        'status' => $job->status == 1 ? 'publish' : 'draft',
                        'opening_date' => $job->opening_date,
                        'closing_date' => $job->closing_date,
                        'link' => secure_url('/jobs',[$job->id])
                    ]
                ];

                if($method == "PUT") {
                    $method = "POST";
                    $url = $url . "/" . $job->id;
                }

                $res = $client->request($method, $url, $data);
            }
        }
    }

    protected function deleteInImmapWebsite($job)
    {
        if (env('APP_ENV') == 'production') {
            $client = new Client();
            $url = config('immapwebsite.URL') . $job->id;

            $res = $client->request('DELETE', $url, [
                'headers' => ['AccessToken' => config('immapwebsite.SECRET')],
            ]);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/apply-job-with-cover-letter",
     *   tags={"Job"},
     *   summary="Apply job with cover letter",
     *   description="File: app\Http\Controllers\API\JobController@applyJobWithCoverLetter, permission:Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="applyJob",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"job_id", "cover_letter_url"},
     *          @SWG\Property(property="job_id", type="integer", description="Job id", example=53),
     *          @SWG\Property(property="cover_letter_url", type="string", description="Cover letter url", example="https://careers.immap.org/storage/987/cover-letter.pdf")
     *      )
     *   )
     * )
     *
     */
    public function applyJobWithCoverLetter(Request $request)
    {
        $validatedData = $this->validate($request, ['job_id' => 'required|integer', 'cover_letter_url' => 'required|url']);
        $defaultStatus = JobStatus::where('default_status', 1)->first();
        $rejectedStatus = JobStatus::where('set_as_rejected', 1)->first();
        $job = $this->model::findOrFail($validatedData['job_id']);

        if (!$this->isAcceptedSbpRosterMemberFromSelectedUser($this->authUser) && $job->tor->job_standard->under_sbp_program == "yes") {
            return response()->error(__('job.error.cannot_apply'), 500);
        }

        $user_id = $this->authUser->id;

        $historyStatus = [
            [
                'job_status_id' => $defaultStatus->id,
                'is_current_status' => 1
            ]
        ];

        $pivotData = [
            'job_status_id' => $defaultStatus->id,
            'cover_letter_url' => $validatedData['cover_letter_url']
        ];

        if ($this->authUser->archived_user == "yes") {
            $pivotData['job_status_id'] = $rejectedStatus->id;
            $historyStatus[0]['is_current_status'] = 0;
            array_push($historyStatus, [
                'job_status_id' => $rejectedStatus->id,
                'is_current_status' => 1
            ]);
        }

        if ($job->users->contains($user_id)) {
            return response()->error(__('job.error.already_applied'), 500);
        }

        if ($job->status === 0) {
            return response()->error(__('job.error.cannot_apply'), 500);
        }

        $job->users()->attach($user_id, $pivotData);

        foreach($historyStatus as $stepStatus) {
            Job_user_move_status_history::create([
                'job_id' => $validatedData['job_id'],
                'user_id' => $user_id,
                'job_status_id' => $stepStatus['job_status_id'],
                'user_move_id' => null,
                'is_current_status' => $stepStatus['is_current_status']
            ]);
        }

        Mail::to($this->authUser->email)->send(new ApplyJob($job, $this->authUser->full_name));

        return response()->success(__('job.success.apply_job'));
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/save-comment",
     *   tags={"Job"},
     *   summary="save jobs comment",
     *   description="File: app\Http\Controllers\API\JobController@saveComment",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"jobid", "user_id","root", "comment", "tab"},
     *          @SWG\Property(
     *              property="jobid",
     *              type="integer"
     *          ),
     *          @SWG\Property(property="user_id", type="integer"),
     *          @SWG\Property(property="root", type="integer"),
     *          @SWG\Property(property="comment", type="string"),
     *          @SWG\Property(property="tab", type="string"),
     *      )
     *   )
     *
     * )
     *
     */
    protected function saveComment(Request $request) {
        $validatedData = $this->validate($request,
            [
                'jobid' => 'required|integer',
                'userid' => 'required|integer',
                'root' => 'required|integer',
                'comment' => 'required|string',
                'tab' => 'required|integer',
            ]
        );

        $co = JobManagerComment::create([
            'job_id' => $validatedData['jobid'],
            'user_id' => $validatedData['userid'],
            'root' => $validatedData['root'],
            'comments' => $validatedData['comment'],
            'comment_by_id' => auth()->user()->id,
            'order_job_status' => $validatedData['tab']
        ]);

        return response()->success(__('crud.success.store'), $co);
    }

    /**
     * @SWG\Delete(
     *   path="/api/jobs/delete-comment/{id}",
     *   tags={"Job"},
     *   summary="Delete jobs comment",
     *   description="File: app\Http\Controllers\API\JobController@deleteComment",
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
     *       description="Comment id"
     *    ),
     * )
     *
     */
    protected function deleteComment($id) {

        $comment = JobManagerComment::findOrFail($id);

        if (!$comment) {
            return response()->error(__('crud.error.not_found'), 404);
        } else {
            JobManagerComment::where('root', $id)->delete();
            $comment->delete();
        }

        return response()->success(__('Comment successfully deleted'));
    }

    protected function getReplies($comment) {
        $replies = $comment->replies;
        if ($replies) {
            foreach($replies as $reply) {
                $reply->commentby = $reply->commentby()->select('id', 'full_name')->first();
                if ($reply->replies) {
                    $this->getReplies($reply);
                }
            }
        }

        return $comment;
    }
    /**
     * @SWG\GET(
     *   path="/api/jobs/get-comment-by-job-user-id/{id}/{userId}",
     *   tags={"Job"},
     *   summary="get comment by job and user id",
     *   description="File: app\Http\Controllers\API\JobController@getCommentByJobByUserId",
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
     *       description="Job id"
     *    ),
     *    @SWG\Parameter(
     *       name="userId",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="User id"
     *    ),
     * )
     *
     */
    protected function getCommentByJobByUserId($id, $user) {
        // Get the job
        $job = $this->model::select('id')->find($id);

        // Get First Level (root = 0) comment from manager
        $comments = $job->managerComments()->where('user_id', $user)->with([
            'commentby' => function ($query) {
                $query->select('id', 'full_name');
            }])->orderBy('created_at', 'desc')->get();

        // Get the replied comment for each first level comment
        foreach($comments as $comment) {
            $comment = $this->getReplies($comment);
        }

        return response()->success(__('crud.success.default'), ['comment' => $comments, 'loginid' => auth()->user()->id]);
    }

    /**
     * @SWG\GET(
     *   path="/api/jobs/get-comment-by-job-id/{id}",
     *   tags={"Job"},
     *   summary="get comment by job id",
     *   description="File: app\Http\Controllers\API\JobController@getCommentByJobId",
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
     *       description="Job id"
     *    )
     * )
     *
     */
    protected function getCommentByJobId($id) {

        $com = JobManagerComment::where('job_id', $id)->with(['commentby'=>function($q){
            return $q->select('id', 'full_name');
        }])->with(['user'=>function($q){
            return $q->select('id', 'full_name');
        }])->orderBy('id', 'DESC')->get();

        return response()->success(__('crud.success.default'), array('comment'=>$com, 'loginid'=>auth()->user()->id));
    }

    /**
     * @SWG\POST(
     *   path="/api/jobs/update-comment",
     *   tags={"Job"},
     *   summary="update comment",
     *   description="File: app\Http\Controllers\API\JobController@updateComment",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"commentID", "comment"},
     *          @SWG\Property(
     *              property="commentID",
     *              type="integer",
     *              description="comment id",
     *              example=56
     *          ),
     *          @SWG\Property(property="comment", type="string", description="comment", example="This profile is quite good"),
     *      )
     *   )
     * )
     *
     */
    protected function updateComment(Request $request) {

        $validatedData = $this->validate($request,
        [
            'comment' => 'required|string',
            'commentID' => 'required|integer'
        ]
        );

        JobManagerComment::where('id', '=', $validatedData['commentID'])
            ->update(
                array(
                    'comments' => $validatedData['comment']
                )
            );

        return response()->success(__('crud.success.store'));
    }

    /**
     * @SWG\POST(
     *   path="/api/jobs/save-manager",
     *   tags={"Job"},
     *   summary="store jobs manager",
     *   description="File: app\Http\Controllers\API\JobController@saveManager",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"jobid", "userid", "manager"},
     *          @SWG\Property(
     *              property="jobid",
     *              type="integer",
     *               description="Job id",
     *          ),
     *          @SWG\Property(
     *              property="userid",
     *              type="integer",
     *              description="User id",
     *          ),
     *          @SWG\Property(property="manager", type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="User id", example=2)
     *              )
     *          ),
     *      )
     *   )
     * )
     *
     */
    function saveManager(Request $request) {

        $validatedData = $this->validate($request,
        [
            'jobid' => 'required|integer',
            'userid' => 'required|integer',
            'manager' => 'required|array',
        ]
        );

        $idmanager=Array();

        foreach($validatedData['manager'] as $mn) {
            array_push($idmanager, $mn['id']);
        }

        //delete manager
        $delete=JobManager::where('job_id', $validatedData['jobid'])
            ->whereNotIn('user_id', $idmanager);

        $datadelete=0;
        $toDelete = $delete->get();
        if($toDelete->count()>0) {
            foreach($toDelete as $mn) {
                $applicantNumber = JobUser::select('id')
                                    ->where(DB::raw("JSON_CONTAINS(JSON_EXTRACT(panel_interview, '$[*].id'), '".$mn->user_id."')"), '=', 1)
                                    ->where('job_id', $mn->job_id)
                                    ->get();
                if($applicantNumber->count() < 2) {
                    $mn->delete();
                }
            }
            $datadelete='delete';
        }
        //end delete manager

        //create new manager
        foreach($validatedData['manager'] as $mn) {

            $jobmanager = JobManager::where('user_id', $mn['id'])->where('job_id', $validatedData['jobid'])
                ->get();

            if ($jobmanager->count()==0) {

                $userid=User::select('id','full_name')->where('id', $mn['id'])
                    ->first();

                JobManager::create([
                    'job_id'=>$validatedData['jobid'],
                    'user_id'=>$mn['id'],
                    'email'=>$mn['value'],
                    'label'=>$mn['label'],
                    'name'=>$userid['full_name'],
                ]);
            }

        }
        // end create new manager

        //get user id
        $userids=Array();
        $jobuser = DB::table('job_user')->select('user_id')
            ->where('job_status_id', 4)
            ->where('job_id', $validatedData['jobid'])->get()->toArray();

        foreach($jobuser as $id){
            array_push($userids, $id->user_id);
        }
        //end get user id

        $getManager= JobManager::select('job_id', 'user_id', 'email', 'label', 'name')
            ->where('job_id', $validatedData['jobid'])
            ->whereIn('user_id', $idmanager)
            ->get();
        if($getManager->count()>0) {

            $managerArray=Array();

            foreach($getManager->toArray() as $mn){
                array_push($managerArray, [
                    'id'=>$mn['user_id'],
                    'label'=>$mn['name'],
                    'value'=>$mn['email'],
                ]);
            }

            DB::table('job_user')->where('job_id', $validatedData['jobid'])->where('user_id', $validatedData['userid'])
                ->update(['panel_interview' => json_encode($managerArray)]);
        }
        (new JobInterviewScoreController)->setFinalScore($validatedData['jobid'],$validatedData['userid']);
        return response()->success(__('Manager successfully deleted'));

    }

    /**
     * zipCvForEachStep is a function to zip the applicant cvs
     */
    function zipCvForEachStep(Job $job, JobStatus $jobStatus, bool $jobUnderSbp, bool $includeAllApplicants)
    {
         // the folder should exist in HR-Roster/storage/public/recruitment-report
         $statusForZipFile = $jobUnderSbp ? Str::slug($jobStatus->status_under_sbp_program) : $jobStatus->slug;
         $suffix = $includeAllApplicants ? '-all' : '-users';
         $zip_file = storage_path('app/public/recruitment-report/'.$job->id .'-'. Str::slug($job->title) .'-'. $statusForZipFile . $suffix .'-cv-list.zip');
         $zip = new ZipArchive();
         $zip->open($zip_file, ZipArchive::CREATE);

         $mediaAdded = false;

         $applicants = $includeAllApplicants ? $job->users : $job->users()->where('users.archived_user', 'no')->get();

         foreach($applicants as $user) {
             if ($user->pivot->job_status_id == $jobStatus->id) {
                 $media = $user->profile->p11_cv->getMedia('cv_files')->first();
                 if (!empty($media)) {
                     $fileAdded = $zip->addFile($media->getPathFromS3(), $user->first_name.'-'.$user->family_name.'-cv.pdf');
                     if ($fileAdded) {
                         $mediaAdded = true;
                     }
                 }
             }
         }

         $collectionName = $jobUnderSbp ? 'recruitment-interested' : 'recruitment-active';
         if ($jobStatus->last_step == 1 && !$jobUnderSbp) {
             $collectionName = 'recruitment-rejected';
         }
         if ($jobStatus->last_step == 1 && $jobUnderSbp) {
             $collectionName = 'recruitment-not-selected';
         }
         if ($jobStatus->is_interview == 1 && !$jobUnderSbp) {
             $collectionName = 'recruitment-interview';
         }
         if ($jobStatus->is_interview == 1 && $jobUnderSbp) {
             $collectionName = 'recruitment-partner-selection';
         }
         if ($jobStatus->set_as_shortlist == 1 && !$jobUnderSbp) {
             $collectionName = 'recruitment-shortlisted';
         }
         if ($jobStatus->set_as_shortlist == 1 && $jobUnderSbp) {
             $collectionName = 'recruitment-nominated';
         }

         if ($collectionName !== '' && !$includeAllApplicants) {
            $collectionName = $collectionName . $this->nonArchivedSuffix;
        }

         if (!empty($job->getMedia($collectionName))) {
             $job->clearMediaCollection($collectionName);
         }

         $zip->close();
         if($mediaAdded) {
             $job->addMedia($zip_file)->toMediaCollection($collectionName, 's3');
         }
    }

    /**
     * @SWG\POST(
     *   path="/api/jobs/update-status-job",
     *   tags={"Job"},
     *   summary="update job status",
     *   description="File: app\Http\Controllers\API\JobController@updateStatusJob",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"jobid", "jobstatus"},
     *          @SWG\Property(
     *              property="jobid",
     *              type="integer",
     *              description="Job id",
     *              example=53
     *          ),
     *          @SWG\Property(property="jobstatus", type="integer", description="Job status id", example=1),
     *      )
     *   )
     * )
     *
     */
    function updateStatusJob (Request $request) {
        $validatedData = $this->validate($request, [
                'jobid' => 'required|string|exists:jobs,id',
                'jobstatus' => 'required|boolean',
                'closeSurgeAlert' => 'sometimes|nullable|string'
            ]
        );

        $status = 3;

        if($validatedData['jobstatus'] === false) {
            $status = 1;
        }

        $job = $this->model::with(['users'])->find($validatedData['jobid']);
        $jobType = "normal-job";

        if ($job->tor->job_standard->under_sbp_program === "yes") {
            $jobType = "surge-alert";
        }

        if ($job->tor->job_standard->sbp_recruitment_campaign === "yes") {
            $jobType = "roster-recruitment";
        }

        $acceptedStep = JobStatus::where('last_step', 1)->first();
        $acceptedApplicants = $job->users()->where('job_status_id', $acceptedStep->id)->get();

        $job->status = $status;
        $result = $job->save();

        if ($status == 1 && $result) {
            // zip file for all applicant
            $isPdfCreated = DB::table('media')->select('id')
            ->where('model_id', $validatedData['jobid'])->where('collection_name', $this->allApplicantCollection)->get();
            if ($isPdfCreated->count() > 0) {
                $job->clearMediaCollection($this->allApplicantCollection);
            }
            // zip file for unarchive applicant only
            $nonArchivePdfCreated = DB::table('media')->select('id')
            ->where('model_id', $validatedData['jobid'])->where('collection_name', $this->nonArchiveApplicantCollection)->get();
            if ($nonArchivePdfCreated->count() > 0) {
                $job->clearMediaCollection($this->nonArchiveApplicantCollection);
            }
        }
        if ($status == 3 && $result) {
            if ($jobType == "normal-job") {
                $isInterview = JobStatus::where('is_interview', 1)->first();
                $now = now();
                foreach($job->users as $key => $job_user) {
                    $jobStatusID = $job_user->pivot->job_status_id;
                    if ($jobStatusID == $isInterview->id) {
                        Mail::to($job_user->email)->later($now->addSeconds(3 * $key), new JobRejected($job->title, $job_user->full_name));
                    }
                }
            }

            $allJobStatus = JobStatus::orderBy('order','asc');
            if ($jobType == "surge-alert") {
                $allJobStatus = $allJobStatus->where('under_sbp_program', 'yes');
            }

            $allJobStatus = $allJobStatus->get();

            if(env('DUMMY_SURGE_ADDRESS') === null) {
                if ($jobType !== "roster-recruitment") {
                    $jobUnderSbp = ($jobType == "surge-alert") ? true : false;
                    foreach($allJobStatus as $jobStatus) {
                        if ($jobStatus->set_as_rejected == 0 && $jobStatus->last_step == 0) {
                            // zip file for all applicant
                            $this->zipCvForEachStep($job, $jobStatus, $jobUnderSbp, true);
                            // zip file for unarchive applicant only
                            $this->zipCvForEachStep($job, $jobStatus, $jobUnderSbp, false);
                        }
                    }
                }
            }

            if ($jobType == "surge-alert") {
                $arr = array(10, 20, 30, 40);
                foreach ($arr as &$value) {
                    $value = $value * 2;
                    $now = now();
                    $when = $now->addSeconds($value);
                    if(env('DUMMY_SURGE_ADDRESS') !== null) {
                        $this->sendCloseAlertNotification($when, [], new SbpJobClosedNotification($job, 'test name'));
                    }
                }
                $sbpRosterProcess = $this->getSbpRosterProcessData($job->tor->skillset);
                $sbpRosterProcessName = is_null($sbpRosterProcess) ? 'Surge Roster' : $sbpRosterProcess->name;
                $acceptedSbpMember = $this->getAcceptedSbpRosterMember($job->tor->skillset);
                if (!is_null($acceptedSbpMember)) {
                    $acceptedApplicants = $acceptedApplicants->pluck('email')->all();
                    $acceptedSbpMember = $acceptedSbpMember->pluck('email')->all();
                    $emailList = array_diff($acceptedSbpMember, $acceptedApplicants);
                    array_push($emailList, 'surge@organization.org');
                    $emailList = array_chunk($emailList, 10);

                    if (!empty($validatedData['closeSurgeAlert'])) {
                        $now = now();
                        foreach($emailList as $key => $emailListChunk) {
                            $delay = 360 * $key;
                            $when = $now->addSeconds($delay);
                            Log::info("Send Surge Alert for closing When: ".$delay." order: ".$key);
                            switch($validatedData['closeSurgeAlert']) {
                                case "filled-by-iMMAP":
                                    $this->sendCloseAlertNotification($when, $emailListChunk, new SbpJobClosedNotification($job, $sbpRosterProcessName));
                                    break;
                                case "not-filled-by-iMMAP":
                                    $this->sendCloseAlertNotification($when, $emailListChunk, new SbpJobClosedNotImmapNotification($job, $sbpRosterProcessName));
                                    break;
                                default:
                            }
                        }
                    }
                } else {
                    Log::error("Send Surge Alert for closing $job->title job failed to sent, since there is no roster process under surge roster program alert");
                }
            }
        }

        if ($jobType !== "surge-alert") {
            $this->sendToImmapWebsite($job, 'PUT');
        }
        return response()->success(__('crud.success.default'));
    }

    function sendCloseAlertNotification(DateTime $delayTime, array $bccList, Mailable $emailTemplate)
    {
        if(env('DUMMY_SURGE_ADDRESS') === null) {
            //Send email to applicant with later method
            return Mail::to(env('MAIL_FROM_ADDRESS', 'careers@organization.org'))->bcc($bccList)->later($delayTime, $emailTemplate);
        } else {
            $bccList = ["test@organization.org"];
            return Mail::to(env('MAIL_FROM_ADDRESS', 'careers@organization.org'))->bcc($bccList)->later($delayTime, $emailTemplate);
        }
    }

    /**
     * function to generate job pdf report
     */
    function generateJobPdfReport(int $id, Job $job, bool $includeAllApplicants, string $reportCollectionName)
    {
        // determine if the job is surge alert or not
        $sbpJob = $job->tor->job_standard->under_sbp_program == "yes" ? true : false;

        $allJobStatus = JobStatus::orderBy('order','asc');
        if ($sbpJob) {
            $allJobStatus = $allJobStatus->where('under_sbp_program', 'yes');
        }
        $allJobStatus = $allJobStatus->get();

        $reportData = [];
        $totalApplicants = 0;

        foreach($allJobStatus as $jobStatus) {
            $withArray = [
                'users' => function ($query) use ($jobStatus, $includeAllApplicants) {
                    if (!$includeAllApplicants) {
                        $query->where('users.archived_user', 'no');
                    }
                    return $query->select('users.id', 'users.full_name', 'users.email')->wherePivot('job_status_id', $jobStatus->id);

                },
                'users.profile' => function ($query) {
                    return $query->select('profiles.id', 'profiles.cv_id', 'profiles.user_id');
                },
                'users.profile.p11_education_universities' => function ($query) {
                    return $query->orderBy('attended_to', 'desc');
                },
                'users.profile.p11_cv'
            ];
            if ($jobStatus->is_interview == 1) {
                $withArray['users.user_interview_files'] = function ($query) use ($id) {
                    return $query->select('jobs_interview_files.id', 'jobs_interview_files.user_id', 'jobs_interview_files.job_id', 'jobs_interview_files.user_interview_email', 'jobs_interview_files.user_interview_name', 'jobs_interview_files.download_url')->where('job_id', $id);
                };
            }



            $collectionName = '';
            if ($jobStatus->default_status == 1 && !$sbpJob) {
                $collectionName = 'recruitment-active';
            }
            if ($jobStatus->default_status == 1 && $sbpJob) {
                $collectionName = 'recruitment-interested';
            }
            if ($jobStatus->last_step == 1 && !$sbpJob) {
                $collectionName = 'recruitment-rejected';
            }
            if ($jobStatus->last_step == 1 && $sbpJob) {
                $collectionName = 'recruitment-not-selected';
            }
            if ($jobStatus->is_interview == 1 && !$sbpJob) {
                $collectionName = 'recruitment-interview';
            }
            if ($jobStatus->is_interview == 1 && $sbpJob) {
                $collectionName = 'recruitment-partner-selection';
            }
            if ($jobStatus->set_as_shortlist == 1 && !$sbpJob) {
                $collectionName = 'recruitment-shortlisted';
            }
            if ($jobStatus->set_as_shortlist == 1 && $sbpJob) {
                $collectionName = 'recruitment-nominated';
            }

            if ($collectionName !== '' && !$includeAllApplicants) {
                $collectionName = $collectionName . $this->nonArchivedSuffix;
            }

            $zippedCVs = '';
            if (!empty($collectionName)) {
                $zippedCVs = $job->getMedia($collectionName)->first();
                if (empty($zippedCVs)) {
                    $zippedCVs = '';
                } else {
                    $zippedCVs = $zippedCVs->getMediaDownloadUrl();
                }
            }

            $listApplicant = $this->model::with($withArray)->findOrFail($id)->users;
            $listApplicant->map(function($user) {
                $user->cv = $user->profile->p11_cv->getMedia('cv_files')->first();
                if (empty($user->cv)) {
                    $user->cv = '';
                } else {
                    $user->cv = $user->cv->getMediaDownloadUrl();
                }
                $user->profile->latest_degree = $user->profile->p11_education_universities[0]->degree;
                $jobUser = JobUser::where(["id" => $user->pivot->id])->latest()->first();
                $user->scoring_sheet = $jobUser->getMedia('recruitment-interview-report')->first();
                if(empty($user->scoring_sheet)) {
                    $user->scoring_sheet = '';
                } else {
                    $user->scoring_sheet = $user->scoring_sheet->getMediaDownloadUrl();
                }
                unset($user->profile->p11_cv);
                unset($user->profile->p11_education_universities);

                return $user;
            });
            $managerArray = DB::table('job_managers')->select('id', 'user_id', 'name')->where('job_id', $id)->get();
            $managers = $managerArray->implode('name', ', ');


            $totalApplicantsForTheStep = count($listApplicant);
            $reportData[$jobStatus->order] = [
                'total' => $totalApplicantsForTheStep,
                'listApplicant' => $listApplicant,
                'jobStatus' => $jobStatus,
                'zippedCVs' => $zippedCVs
            ];

            $totalApplicants = $totalApplicants + $totalApplicantsForTheStep;
        }

        $managers = DB::table('job_managers')->select('id', 'name')->where('job_id', $id)->get();
        $managers = $managers->implode('name', ', ');

        $header=view('header')->render();
        $footer=view('footer')->render();

        $view = view('recruitment-report.index', [
            'job' => $job,
            'reportData' => $reportData,
            'number_of_applicant' => $totalApplicants,
            'job_manager' => $managers,
            'sbpJob' => $sbpJob
        ])->render();

        $pdf = PDF::loadHTML($view)
            ->setPaper('a4')
            ->setOption('margin-top', '38.1mm')
            ->setOption('margin-bottom', '27.4mm')
            ->setOption('margin-left', '25.4mm')
            ->setOption('margin-right', '25.4mm')
            ->setOption('footer-html', $footer)
            ->setOption('header-html', $header)
            ->setOption('enable-local-file-access', true);

        // the folder should exist in HR-Roster/storage/public/recruitment-report
        $fileName = $job->id.'-'.Str::slug($job->title) . ((!$includeAllApplicants) ? '-users' : '-all');
        $path = storage_path("app/public/recruitment-report/". $fileName .".pdf");
        $pdf->save($path);
        $job->addMedia($path)->toMediaCollection($reportCollectionName, 's3');
    }

    /**
     * @SWG\Get(
     *   path="/api/jobs/{id}/pdf",
     *   tags={"Job"},
     *   summary="Get recruitment report",
     *   description="File: app\Http\Controllers\API\JobController@getReport, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="Id of the job"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    function getReport($id) {
        $job = $this->model::with(['country'=>function($q){
            return $q->SELECT('id', 'name');
        }])->with([
            'tor' => function($q) {
                return $q->select('id', 'organization', 'duty_station', 'relationship', 'job_standard_id');
            },
            'tor.job_standard:id,under_sbp_program'
        ])->findOrFail($id);

        // check if the requester can see archive applicant or not
        $authUserCanSeeArchiveUsers = $this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile']) ? true : false;

        // check if all applicant pdf report has been created
        $isPdfCreated = DB::table('media')->select('id')
            ->where('model_id', $id)->where('collection_name', $this->allApplicantCollection)->get();

        // check if non archive applicant pdf report has been created
        $nonArchivePdfCreated = DB::table('media')->select('id')
            ->where('model_id', $id)->where('collection_name', $this->nonArchiveApplicantCollection)->get();

        if($isPdfCreated->count() == 0) {
            // generate pdf report for all applicant
            $this->generateJobPdfReport($id, $job, true, $this->allApplicantCollection);
        }

        if($nonArchivePdfCreated->count() == 0) {
            // generate pdf report for unarchive applicant only
            $this->generateJobPdfReport($id, $job, false, $this->nonArchiveApplicantCollection);
        }

        $collection = $authUserCanSeeArchiveUsers ? $this->allApplicantCollection : $this->nonArchiveApplicantCollection;

        $job = $this->model::with(['country'=>function($q){
            return $q->SELECT('id', 'name');
        }])->with(['tor'=>function($q){
            return $q->select('id', 'organization', 'duty_station', 'relationship');
        }])
        ->findOrFail($id);

        $pdf = $job->getMedia($collection);

        return response()->success(__('crud.success.default'), $pdf[0]->getFullUrlFromS3());

    }


    /**
     * @SWG\Post(
     *   path="/api/jobs/request-contract",
     *   tags={"Job", "Request Contract"},
     *   summary="Store Request Contract Data",
     *   description="File: app\Http\Controllers\API\JobController@storeRequestContract, Permission: View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="requestContract",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"job_id", "profile_id", "first_name", "last_name", "paid_from", "project_code", "supervisor", "unanet_approver_name", "duty_station", "monthly_rate", "housing", "perdiem", "phone", "not_applicable", "is_other", "contract_start", "contract_end", "cost_center"},
     *              @SWG\Property(property="job_id", type="integer", description="Job id, should be exists on jobs table", example=1),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id, should be exists on profiles table", example=1),
     *              @SWG\Property(property="first_name", type="string", description="First name of applicant", example="John"),
     *              @SWG\Property(property="last_name", type="string", description="Last name of applicant", example="Doe"),
     *              @SWG\Property(property="paid_from", type="integer", enum={0,1}, description="Paid from HQ if paid_from == 0, from field if paid_from == 1", example=0),
     *              @SWG\Property(property="project_code", type="string", description="Project Code", example="IMO"),
     *              @SWG\Property(property="project_task", type="string", description="Project Task", example="The task"),
     *              @SWG\Property(property="supervisor", type="integer", description="supervisor id in users table (should be immaper)", example=1),
     *              @SWG\Property(property="unanet_approver_name", type="integer", description="unanet_approver id in users table (should be immaper)", example=1),
     *              @SWG\Property(property="hosting_agency", type="string", description="Hosting Agency", example="The agency"),
     *              @SWG\Property(property="duty_station", type="string", description="Duty Station", example="Washington"),
     *              @SWG\Property(property="monthly_rate", type="integer", description="Monthly rate", example=5000),
     *              @SWG\Property(property="housing", type="integer", enum={0,1}, description="Allowance include housing or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="perdiem", type="integer", enum={0,1}, description="Allowance include perdiem or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="phone", type="integer", enum={0,1}, description="Allowance include phone or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="not_applicable", type="integer", enum={0,1}, description="Allowance not applicable (1 == Not applicable, 0 == Applicable)", example=0),
     *              @SWG\Property(property="is_other", type="integer", enum={0,1}, description="Has allowance besides housing, perdiem or phone(1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="other", type="string", description="Other type of allowance, (required if is_other == 1)", example="Other type of allowance"),
     *              @SWG\Property(property="contract_start", type="string", description="Date with format Y-m-d in php", example="2020-10-01"),
     *              @SWG\Property(property="contract_end", type="string", description="Date with format Y-m-d in php", example="2020-12-31"),
     *              @SWG\Property(property="cost_center", type="integer", description="iMMAP Office HQ id, should be exists on immap_offices table", example=5)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function storeRequestContract(Request $request)
    {
        $validatedData = $this->validate($request, self::RULES_REQUEST_CONTRACT);
        $immapOffice = "";

        if (!empty($validatedData['job_id']) || !is_null($validatedData['job_id'])) {
            $job = $this->model::findOrFail($validatedData['job_id']);
            $checkAlertJob = $job->tor->job_standard->under_sbp_program == "yes" ? true : false;
            if ($checkAlertJob) {
                $office = ImmapOffice::where('city', 'Washington DC')->first();
                if ($office) {
                    $immapOffice = $office->id;
                }
            } else {
                $immapOffice = $job->immap_office_id;
            }
        }

        $record = JobInterviewRequestContract::create([
            'job_id' => $validatedData['job_id'],
            'profile_id' => $validatedData['profile_id'],
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'request_type' => $validatedData['request_type'],
            'paid_from' => $validatedData['paid_from'],
            'project_code' => $validatedData['project_code'],
            'project_task' => $validatedData['project_task'],
            'supervisor' => $validatedData['supervisor'],
            'unanet_approver_name' => $validatedData['unanet_approver_name'],
            'hosting_agency' => $validatedData['hosting_agency'],
            'duty_station' => $validatedData['duty_station'],
            'monthly_rate' => $validatedData['monthly_rate'],
            'housing' => $validatedData['housing'],
            'perdiem' => $validatedData['perdiem'],
            'phone' => $validatedData['phone'],
            'is_other' => $validatedData['is_other'],
            'not_applicable' => $validatedData['not_applicable'],
            'other'=> $validatedData['other'],
            'contract_start' => $validatedData['contract_start'],
            'contract_end'=> $validatedData['contract_end'],
            'cost_center' => $validatedData['cost_center'],
            'under_surge_program' => $validatedData['under_surge_program'],
            'currency' => $validatedData['currency'],
            'immap_office_id' => $immapOffice ? $immapOffice : $validatedData['immap_office_id']
        ]);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

     /**
     * @SWG\Post(
     *   path="/api/jobs/request-contract/{id}",
     *   tags={"Job", "Request Contract"},
     *   summary="Update Specific Request Contract Data",
     *   description="File: app\Http\Controllers\API\JobController@updateRequestContract, Permission: View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="requestContract",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "job_id", "profile_id", "first_name", "last_name", "paid_from", "project_code", "supervisor", "unanet_approver_name", "duty_station", "monthly_rate", "housing", "perdiem", "phone", "not_applicable", "is_other", "contract_start", "contract_end", "cost_center"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="job_id", type="integer", description="Job id, should be exists on jobs table", example=1),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id, should be exists on profiles table", example=1),
     *              @SWG\Property(property="first_name", type="string", description="First name of applicant", example="John"),
     *              @SWG\Property(property="last_name", type="string", description="Last name of applicant", example="Doe"),
     *              @SWG\Property(property="paid_from", type="integer", enum={0,1}, description="Paid from HQ if paid_from == 0, from field if paid_from == 1", example=0),
     *              @SWG\Property(property="project_code", type="string", description="Project Code", example="IMO"),
     *              @SWG\Property(property="project_task", type="string", description="Project Task", example="The task"),
     *              @SWG\Property(property="supervisor", type="integer", description="supervisor id in users table (should be immaper)", example=1),
     *              @SWG\Property(property="unanet_approver_name", type="integer", description="unanet_approver id in users table (should be immaper)", example=1),
     *              @SWG\Property(property="hosting_agency", type="string", description="Hosting Agency", example="The agency"),
     *              @SWG\Property(property="duty_station", type="string", description="Duty Station", example="Washington"),
     *              @SWG\Property(property="monthly_rate", type="integer", description="Monthly rate", example=5000),
     *              @SWG\Property(property="housing", type="integer", enum={0,1}, description="Allowance include housing or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="perdiem", type="integer", enum={0,1}, description="Allowance include perdiem or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="phone", type="integer", enum={0,1}, description="Allowance include phone or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="not_applicable", type="integer", enum={0,1}, description="Allowance not applicable (1 == Not applicable, 0 == Applicable)", example=0),
     *              @SWG\Property(property="is_other", type="integer", enum={0,1}, description="Has allowance besides housing, perdiem or phone(1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="other", type="string", description="Other type of allowance, (required if is_other == 1)", example="Other type of allowance"),
     *              @SWG\Property(property="contract_start", type="string", description="Date with format Y-m-d in php", example="2020-10-01"),
     *              @SWG\Property(property="contract_end", type="string", description="Date with format Y-m-d in php", example="2020-12-31"),
     *              @SWG\Property(property="cost_center", type="integer", description="iMMAP Office HQ id, should be exists on immap_offices table", example=5)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function updateRequestContract(Request $request, $id)
    {
        $validatedData = $this->validate($request, self::RULES_REQUEST_CONTRACT);
        $record = JobInterviewRequestContract::findOrFail($id);

        $requestContractData = $request->only(self::FILLABLE_REQUEST_CONTRACT);

        $updated = $record->fill($requestContractData)->save();

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        $record = JobInterviewRequestContract::findOrFail($id);
        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/send-email-request-contract",
     *   tags={"Job", "Request Contract"},
     *   summary="Send email while storing or updating request contract data",
     *   description="File: app\Http\Controllers\API\JobController@sendEmailContractRequest, Permission: View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="requestContract",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"job_id", "profile_id", "first_name", "last_name", "paid_from", "project_code", "supervisor", "unanet_approver_name", "duty_station", "monthly_rate", "housing", "perdiem", "phone", "not_applicable", "is_other", "contract_start", "contract_end", "cost_center"},
     *              @SWG\Property(property="job_id", type="integer", description="Job id, should be exists on jobs table", example=1),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id, should be exists on profiles table", example=1),
     *              @SWG\Property(property="first_name", type="string", description="First name of applicant", example="John"),
     *              @SWG\Property(property="last_name", type="string", description="Last name of applicant", example="Doe"),
     *              @SWG\Property(property="paid_from", type="integer", enum={0,1}, description="Paid from HQ if paid_from == 0, from field if paid_from == 1", example=0),
     *              @SWG\Property(property="project_code", type="string", description="Project Code", example="IMO"),
     *              @SWG\Property(property="project_task", type="string", description="Project Task", example="The task"),
     *              @SWG\Property(property="supervisor", type="integer", description="supervisor id in users table (should be immaper)", example=1),
     *              @SWG\Property(property="unanet_approver_name", type="integer", description="unanet_approver id in users table (should be immaper)", example=1),
     *              @SWG\Property(property="hosting_agency", type="string", description="Hosting Agency", example="The agency"),
     *              @SWG\Property(property="duty_station", type="string", description="Duty Station", example="Washington"),
     *              @SWG\Property(property="monthly_rate", type="integer", description="Monthly rate", example=5000),
     *              @SWG\Property(property="housing", type="integer", enum={0,1}, description="Allowance include housing or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="perdiem", type="integer", enum={0,1}, description="Allowance include perdiem or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="phone", type="integer", enum={0,1}, description="Allowance include phone or not (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="not_applicable", type="integer", enum={0,1}, description="Allowance not applicable (1 == Not applicable, 0 == Applicable)", example=0),
     *              @SWG\Property(property="is_other", type="integer", enum={0,1}, description="Has allowance besides housing, perdiem or phone(1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="other", type="string", description="Other type of allowance, (required if is_other == 1)", example="Other type of allowance"),
     *              @SWG\Property(property="contract_start", type="string", description="Date with format Y-m-d in php", example="2020-10-01"),
     *              @SWG\Property(property="contract_end", type="string", description="Date with format Y-m-d in php", example="2020-12-31"),
     *              @SWG\Property(property="id", type="integer", description="Request contract id, if empty or null, it wiil saved in the table, if not it will update the data", example=7),
     *              @SWG\Property(property="cost_center", type="integer", description="iMMAP Office HQ id, should be exists on immap_offices table", example=5)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error / Incomplete Contract Request Recipient"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function sendEmailContractRequest(Request $request)
    {
        $sendEmailRules = self::RULES_REQUEST_CONTRACT;
        $sendEmailRules['id'] = 'sometimes|nullable|integer|exists:job_interview_request_contracts,id';
        $validatedData = $this->validate($request, $sendEmailRules);
        $immapOffice = "";

        if (!empty($validatedData['job_id']) || !is_null($validatedData['job_id'])) {
            $job = $this->model::findOrFail($validatedData['job_id']);
            $checkAlertJob = $job->tor->job_standard->under_sbp_program == "yes" ? true : false;
            if ($checkAlertJob) {
                $office = ImmapOffice::where('city', 'Washington DC')->first();
                if ($office) {
                    $immapOffice = $office->id;
                }
            } else {
                $immapOffice = $job->immap_office_id;
            }
        }

        if(empty($validatedData['id']) || is_null($validatedData['id'])) {
            $record = JobInterviewRequestContract::create([
                'job_id' => $validatedData['job_id'],
                'profile_id' => $validatedData['profile_id'],
                'first_name' => $validatedData['first_name'],
                'request_type' => $validatedData['request_type'],
                'last_name' => $validatedData['last_name'],
                'paid_from' => $validatedData['paid_from'],
                'project_code' => $validatedData['project_code'],
                'project_task' => $validatedData['project_task'],
                'supervisor' => $validatedData['supervisor'],
                'unanet_approver_name' => $validatedData['unanet_approver_name'],
                'hosting_agency' => $validatedData['hosting_agency'],
                'duty_station' => $validatedData['duty_station'],
                'monthly_rate' => $validatedData['monthly_rate'],
                'housing' => $validatedData['housing'],
                'perdiem' => $validatedData['perdiem'],
                'phone' => $validatedData['phone'],
                'is_other' => $validatedData['is_other'],
                'not_applicable'  => $validatedData['not_applicable'],
                'other' => $validatedData['other'],
                'contract_start' => $validatedData['contract_start'],
                'contract_end' => $validatedData['contract_end'],
                'cost_center' => $validatedData['cost_center'],
                'under_surge_program' => $validatedData['under_surge_program'],
                'currency' => $validatedData['currency'],
                'position' => $validatedData['position'],
                'immap_office_id' => $immapOffice ? $immapOffice : $validatedData['immap_office_id']
            ]);
        } else {
            $record = JobInterviewRequestContract::findOrFail($validatedData['id']);
            $record->fill($request->only(self::FILLABLE_REQUEST_CONTRACT))->save();
            $record = JobInterviewRequestContract::findOrFail($validatedData['id']);
        }

        $emails = Setting::select('value')->where('slug', 'contract-request-recipients-' .  $record->costCenterHQ->country->slug)->first();
        $authUserEmail = auth()->user()->profile->immap_email;
        $hiringManagerEmails = [];
        if ($validatedData['job_id']) {
            $hiringManagers = $this->model::findOrFail($validatedData['job_id'])->job_manager;
            if (count($hiringManagers)) {
                $hiringManagerEmails = $hiringManagers->pluck('email')->toArray();
                if (!empty($authUserEmail)) {
                    if (!in_array($authUserEmail, $hiringManagerEmails)) {
                        array_push($hiringManagerEmails, $authUserEmail);
                    }
                }
            }
        } else {
            array_push($hiringManagerEmails, $authUserEmail);
        }

        $profile = Profile::find($record->profile_id);
        /*if ($record->under_surge_program == true) {
            array_push($hiringManagerEmails, 'surge@organization.org');
        }*/

        if (!empty($emails)) {
            $emails = explode("\n", $emails->value);
            if (count($emails) > 0) {
                Mail::to($emails)
                ->cc(count($hiringManagerEmails) ? $hiringManagerEmails : [])
                ->bcc($this->authUser->profile->immap_email)->send(new JobInterviewRequestContractMail(
                    $record->first_name,
                    $record->last_name,
                    $validatedData['position'],
                    $record->paid_from,
                    $record->project_code,
                    $record->project_task,
                    $record->supervisor_user ? $record->supervisor_user->full_name : 'N/A',
                    (is_null($record->unanet_approver_name) ? 'N/A' : $record->unanet_approver_user->full_name),
                    $record->hosting_agency,
                    $record->duty_station,
                    $record->monthly_rate,
                    $record->housing,
                    $record->perdiem,
                    $record->phone,
                    $record->other,
                    $this->authUser->full_name,
                    date_format(date_create($record->contract_start), "d F Y"),
                    date_format(date_create($record->contract_end), "d F Y"),
                    $record->not_applicable,
                    $record->costCenterHQ->country->name,
                    $record->job ? $record->job->country->slug : 'N/A',
                    $record->request_type,
                    $record->currency
                ));
            }

            //$this->sendContractToShirePoint($record);

            $record->fill(['request_status' => 'sent'])->save();

            if ($record->under_surge_program == true) {
                $surgePing = new SurgePingService();
                $surgePing->Ping();
            }

            return response()->success(__('crud.success.default'), $record);
        }

        return response()->error(__('job.error.requestContractRecipientNotComplete'), 422);
    }

     /**
     * @SWG\Get(
     *   path="/api/check-has-assign-as-job-manager",
     *   tags={"Job"},
     *   summary="Check if the current user has ever been a hiring manager",
     *   description="File: app\Http\Controllers\API\JobController@checkHasAssignAsJobManager",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function checkHasAssignAsJobManager()
    {
        $hasAssignJobManager = false;
        $hasAssignSbpJobManager = false;
        if (!empty($this->authUser)) {
            $hasAssignJobManager = $this->authUser->jobManager()->whereHas('job.tor.job_standard', function($query) {
                $query->where('under_sbp_program', 'no');
            })->get();
            $hasAssignJobManager = $hasAssignJobManager->count() > 0 ? true : false;

            $hasAssignSbpJobManager = $this->authUser->jobManager()->whereHas('job.tor.job_standard', function($query) {
                $query->where('under_sbp_program', 'yes');
            })->get();
            $hasAssignSbpJobManager = $hasAssignSbpJobManager->count() > 0 ? true : false;
        }

        return response()->success(__('crud.success.default'), [
            'hasAssignJobManager' => $hasAssignJobManager,
            'hasAssignSbpJobManager' => $hasAssignSbpJobManager
        ]);
    }

    /**
     * @SWG\GET(
     *   path="/api/jobs/{id}/applicants/count",
     *   tags={"Job"},
     *   summary="Get total number of applicants for each job status",
     *   description="File: app\Http\Controllers\API\JobController@getUserByStatus",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job id"
     *    )
     * )
     *
     */

    public function getUserByStatus($id)
    {
        $userByStatus = DB::table('jobs')
            ->join('job_user', 'jobs.id', '=', 'job_user.job_id')
            ->join('users', 'users.id', '=', 'job_user.user_id')
            ->where('jobs.id', '=', $id)
            ->whereIn('users.status', ['Active', 'Inactive']);

        // for a user who don't have access to archive feature
        if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile'])) {
            $userByStatus = $userByStatus->where('users.archived_user', "no");
        }

        $userByStatus = $userByStatus->select('job_user.job_status_id as status', DB::raw("count(job_user.job_status_id) as count"))
            ->groupBy('job_user.job_status_id')
            ->get();
        return response()->success(__('crud.success.default'), $userByStatus);
    }

    /**
     *  @SWG\Get(
     *      path="/api/jobs/{id}/interview-score/download",
     *      tags={"Job"},
     *      summary="Get Applicant Interview Score File",
     *      description="File: app\Http\Controllers\API\JobController@downloadInterviewScore",
     *      security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *      @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="Job id"
     *      ),
     *      @SWG\Parameter(
     *          name="jobUserId",
     *          in="query",
     *          required=true,
     *          type="integer",
     *          description="id on pivot table between job and user (job_user)"
     *      ),
     *      @SWG\Parameter(
     *          name="mediaId",
     *          in="query",
     *          required=true,
     *          type="integer",
     *          description="id media table"
     *      ),
     *      @SWG\Response(response=200, description="Success"),
     *      @SWG\Response(response=404, description="Job Not Found or Interview Data Not Found or Interview File Not Found"),
     *      @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function downloadInterviewScore(Request $request, $id)
    {
        $job = $this->model::find($id);

        if (empty($job) || is_null($job)) {
            return response()->error(__('job.error.notFound'), 404);
        }

        $validatedData = $this->validate($request, [
            'jobInterviewFileId' => 'required|integer|exists:jobs_interview_files,id',
            'mediaId' => 'required|integer|exists:media,id'
        ]);

        $interviewFile = \App\Models\JobInterviewFiles::where([
            'id' => $validatedData['jobInterviewFileId'],
            'media_id' => $validatedData['mediaId'],
            'job_id' => $id,
        ])->first();

        if (empty($interviewFile) || is_null($interviewFile)) {
            return response()->error(__('job.error.interviewDataNotFound'), 404);
        }

        $media = $interviewFile->attachment->getMedia('job_interview_files')->first();

        if (empty($media) || is_null($media)) {
            return response()->error(__('job.error.interviewFileNotFound'), 404);
        }

        return response()->download($media->getPathFromS3());
    }

     /**
     * @SWG\Delete(
     *   path="/api/jobs/delete-applicant/{id}/{userId}",
     *   tags={"Job"},
     *   summary="Delete jobs applicant",
     *   description="File: app\Http\Controllers\API\JobController@deleteApplicant, Permission: Set As Admin",
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
     *       description="applicant id"
     *    ),
     *    @SWG\Parameter(
     *       name="userId",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="User id"
     *    )
     * )
     *
     */

    protected function deleteApplicant($id, $userId)
    {
        $jobUser= JobUser::where('job_id',$id)->where('user_id',$userId)->first();

        if (!$jobUser) {
            return response()->error(__('crud.error.not_found'), 404);
        } else {
            JobManagerComment::where('job_id', $id)->where('user_id', $userId)->delete();
            Job_user_move_status_history::where('job_id',$id)->where('user_id', $userId)->delete();
            $jobUser->delete();
        }

        return response()->success(__('Applicant successfully deleted'));
    }

        /**
     * @SWG\Post(
     *   path="/api/job/send-sbp-roster-notification/error",
     *   tags={"Job", "Surge Program Alert"},
     *   summary="process error happening when sending sbp roster notification",
     *   description="File: app\Http\Controllers\API\JobController@processSbpNotificationError, permissions:View SBP Job|Set as Admin, and iMMAPer middleware",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *    @SWG\Parameter(
     *       name="error",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"userId, error"},
     *          @SWG\Property(
     *              property="userId", type="string", description="applicant id", example="1",
     *              property="error", type="string", description="error", example="error",
     *          ),
     *       ),
     *    ),
     * )
     */
    protected function processSbpNotificationError(Request $request)
    {
        $validatedData = $this->validate($request, [
            'userId' => 'required|integer',
            'error' => 'required|string'
        ]);

        $user = User::find($validatedData['userId']);
        Log::error($validatedData['error']);
        Log::error('user => '.$user->email.' user id : '.$user->id);

        $message = 'Error: '.$validatedData['error'].', user => '.$user->email.' , user id => '.$user->id;

        Mail::to(env('SCRIPT_MAIL_TO'))->send(new ScriptMail('Sbp roster notification error', $message));
    }

    /**
     * @SWG\Post(
     *   path="/api/send-sbp-roster-notification/{id}",
     *   tags={"Job", "Surge Program Alert"},
     *   summary="send notification to accepted surge roster member",
     *   description="File: app\Http\Controllers\API\JobController@sendSbpNotification, permissions:View SBP Job|Set as Admin, and iMMAPer middleware",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job id"
     *   ),
     * )
     */
    protected function sendSbpNotification($id)
    {
        try {
            $job = $this->model::findOrFail($id);

            if ($job->tor->job_standard->under_sbp_program == "no") {
                return response()->error(__('sbp.error.normal_tor'), 422);
            }

            $acceptedSbpMember = $this->getAcceptedSbpRosterMember($job->tor->skillset);

            // Check if there is no roster process under sbp program
            if (is_null($acceptedSbpMember)) {
                return response()->error(__('sbp.error.no_roster_process_under_sbp_program'), 500, ['noRosterProcessUnderSbpProgram' => true]);
            }

            $memberCount = $acceptedSbpMember->count();

            // Check if there is no accepted sbp member
            if ($memberCount < 1) {
                return response()->error(__('sbp.error.no_accepted_sbp_member'), 404, ['noAcceptedSbpMember' => true]);
            }

            // Split the accepted sbp member by 100
            $emailListBcc = $acceptedSbpMember->pluck('email')->toArray();
            array_push($emailListBcc, 'surge@organization.org');

            $emailList = array_chunk($emailListBcc, 100);
            $sbpRosterProcess = $this->getSbpRosterProcessData($job->tor->skillset);
            $sbpRosterProcessName = is_null($sbpRosterProcess) ? 'Surge Roster' : $sbpRosterProcess->name;

            // Send your message
            foreach($emailList as $key => $emailListChunk) {
                Mail::to(env('MAIL_FROM_ADDRESS', 'careers@organization.org'))->bcc($emailListChunk)->send(new SbpJobNotification($job, $sbpRosterProcessName, $memberCount));

                if (Mail::failures()) {
                    Log::error("Send Surge Alert for $job->title job failed to sent - [Batch " . ($key + 1) . "]");
                    $emailString = implode(", ", $emailListChunk);
                    Log::error("Error Chunk Failed: $emailString");

                    Mail::to(env('SCRIPT_MAIL_TO'))->send(new SbpJobNotificationError($job, $sbpRosterProcessName, $emailListChunk, $key));
                }

                if (count($emailList) > 1) {
                    sleep(3);
                }
            }

            $job->surge_alert_sent = "yes";
            $job->save();

            return response()->success(__('crud.success.default'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->success(__('crud.success.default'));
        }
    }

     /**
     *  @SWG\Get(
     *      path="/api/jobs/download-profiles/{id}/{status}",
     *      tags={"Job"},
     *      summary="Get Applicant Profile for a particular job with selected status",
     *      description="File: app\Http\Controllers\API\JobController@getJobProfilesExport",
     *      security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *      @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="Job id"
     *      ),
     *       @SWG\Parameter(
     *          name="status",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="Job Statuss id"
     *      ),
     *      @SWG\Response(response=200, description="Success"),
     *      @SWG\Response(response=404, description="Job Not Found or Interview Data Not Found or Interview File Not Found"),
     *      @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getJobProfilesExport(int $id, int $status_id)
    {
        $validatedData = $this->validate( new Request(['id' => $id, 'status_id' => $status_id]),[
            'id' => 'required|integer|exists:jobs,id',
            'status_id' => 'required|integer|exists:job_status,id'
        ]);

        $job = $this->model::findOrFail($validatedData['id']);
        $status = JobStatus::findOrFail($validatedData['status_id']);

        if(!empty($job) && !empty($status)){
            $users = JobUser::with('user')
                        ->where('job_id', $job->id)
                        ->where('job_status_id', $status->id)
                        ->whereHas('user', function(Builder $query) {
                            $query->whereIn('users.status', ['Active', 'Inactive']);

                            if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile']))
                            {
                                // show unarchive user only
                                $query->where('users.archived_user', "no");
                            }
                        })->get();
        }

        $profiles =  [];

        foreach($users as $profile) {
            $data['name'] = $profile->user->full_name;
            $data['email'] = $profile->user->email;
            $data['degree'] = count($profile->user->profile->p11_education_universities) != 0 ? $profile->user->profile->p11_education_universities[0]->degree_level->name : '-';
            $data['Education'] = count($profile->user->profile->p11_education_universities) != 0 ? $profile->user->profile->p11_education_universities[0]->degree : '-';
            $data['nationality'] = count($profile->user->profile->birth_nationalities) != 0 ? $profile->user->profile->birth_nationalities[0]->nationality : '-' ;
            $data['present_country'] =  count($profile->user->profile->birth_nationalities) != 0 ? $profile->user->profile->present_nationalities[0]->name : '-' ;
            $data['applied_date'] =   $profile->created_at->format('d/m/Y, H:i');
            array_push($profiles, $data);
        }

        $profiles = new JobProfileExport($profiles, $job->title, $status->status);
        ob_end_clean(); // this
        ob_start(); // and this

        $time = date('Y-m-d-H-i-s');
        return Excel::download($profiles, "profiles-$job->id-$status->status-$time.xlsx");
    }


    protected function sendContractToShirePoint($data)
    {
        $guzzle = new Client();
        $url = config('microsoft_graph.URL_ACCESS_TOKEN');

        $user_token = json_decode($guzzle->post($url, [
            'form_params' => [
                'grant_type' => 'client_credentials',
                'client_id' => config('microsoft_graph.CLIENT_ID'),
                'client_secret' => config('microsoft_graph.CLIENT_SECRET'),
                'scope' => 'https://graph.microsoft.com/.default'
            ],
        ])->getBody()->getContents());
        $user_accessToken = $user_token->access_token;

        $graph = new Graph();
        $graph->setAccessToken($user_accessToken);

        $sharepointURL = "/sites/". env('ONBOARDING_LIST_SITE_ID') . "/lists/". env('ONBOARDING_LIST_ID') . "/items";

        // $names = explode(' ',trim($data->profile->user->full_name));
        // $firstName = count($names) > 2 ? $names[0] .' '. $names[1] : $names[0];
        // $lastName = $names[count($names)-1];
        $lineManager = User::find($data->profile->line_manager_id);

        if ($data->request_type == 'contract-extension') {
            $request_type = 'Contract Extension';
        } else if ($data->request_type == 'contract-amendment') {
            $request_type = 'Contract Amendment';
        } else {
            $request_type = 'New Contract';
        }

        $nationality = '-';
        if (count($data->profile->present_nationalities) != 0) {
                $nationality = implode(', ', Arr::pluck($data->profile->present_nationalities, 'nationality'));
        }

        $body = [
            "fields" => [
                "Title" => $data->first_name,
                "LastName" => $data->last_name,
                "Personal_x0020_email_x0020_addre" => $data->profile->email,
                "Job_x0020_position" => $data->job ? $data->job->title : $data->position,
                "Duty_x0020_station" => $data->duty_station,
                "Start_x0020_date" =>  date_format(date_create($data->contract_start), "Y-m-d"),
                "End_x0020_date" => date_format(date_create($data->contract_end), "Y-m-d"),
                "Nationality" => $nationality,
                "iMMAPLineManager" => $data->supervisor_user ? $data->supervisor_user->immap_email : $lineManager->immap_email,
                "ProjectCode" => $data->project_code,
                "iMMAPCareersProfileID" => strval($data->profile_id),
                "Organization" => $data->costCenterHQ->country->name == "United States" ? "US" : $data->costCenterHQ->country->name,
                "ContractRequest" => $request_type,
                "iMMAPCareersNotes" => $data->profile->user->access_platform == 0 ? "Creating 3iSolution Email address is not necessary for this person" : "",
            ]
        ];

        $graph->createRequest("POST", $sharepointURL)
                 ->addHeaders(["Content-Type" => "application/json"])
                 ->attachBody($body)
                 ->execute();
    }

    /**
     * Generate Reference in the Word format
     *
     * @param object data
     * @param object reference
     *
     *
     */
    public function referenceWordFile($data, $reference, $referenceHistory)
    {
        $date = date("Y-m-d");
        $fileName = "Reference-{$reference->id}";
        $jobTitle = preg_replace('/[^A-Za-z0-9\-]/', '-', $data['job']->title);
        $storagePath = storage_path("app/public/references/Reference-{$data['user']->full_name}-{$jobTitle}.docx");
        $templatePath = resource_path("views/reference-check/reference-check.docx");

        $data['reference'] = $reference;
        $data['type'] = 'job';
        // //$view = view('reference-check.word', $data)->render();
        $values = [
            'applicant' => $data['user']->full_name,
            'position_name' => $data['job']->title,
            'referee' => $reference->full_name,
        ];

        WordService::fromTemplate($storagePath, $templatePath, $values);
        $referenceHistory->addMedia($storagePath)->toMediaCollection('reference_file'.$reference->id.$data['job']->title, 's3');
    }

    /**
     * send reference invite
     *
     * @param object referenceId
     * @param object $job
     * @param object profile
     * @param object code
     * @param object validatedData
     * @param object hr_manager
     */
    public function sendReferenceCheckInvitation($referenceId, $job, $profile, $code, $validatedData, $hr_manager) {

        $reference = P11Reference::where('id', $referenceId)->first();
        $referenceHistory = ReferenceHistory::where('reference_id', $referenceId)->where('job_id', $job->id)->first();
        if($referenceHistory) {
            $referenceHistory->code = $code;
            $referenceHistory->save();
        } else {
            ReferenceHistory::create([
                'reference_id' => $referenceId,
                'job_id' => $job->id,
                'code' => $code,
                'reference_sender_id' => $hr_manager->id,
            ]);
        }
        $referenceHistory = ReferenceHistory::where('reference_id', $referenceId)->where('job_id', $job->id)->first();

        $file = $referenceHistory->getMedia('reference_file'.$referenceId.$job->title)->first();
        if(!isset($file) || empty($file)) {
            $this->referenceWordFile(['job' => $job, 'user' => $profile->user, 'profile' => $profile], $reference, $referenceHistory);
            $file = ReferenceHistory::where('reference_id', $referenceId)->where('job_id', $job->id)->first()->getMedia('reference_file'.$referenceId.$job->title)->first();
        }
        Mail::to($reference->email)->send(new ReferenceCheckMail($reference->full_name, $profile->user->full_name, $validatedData["job_user_id"], $referenceHistory->id, $hr_manager->immap_email, $reference->organization, $code, $file->getPathFromS3(), 'job', $job->title));
    }

    /**
     * @SWG\Post(
     *   path="/api/jobs/reference-check-invitation",
     *   tags={"Job"},
     *   summary="Send invitation to fill reference form for everey reference listed in profile",
     *   description="File: app\Http\Controllers\API\JobController@referenceCheckInvitation",
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
     *              required={"job", "current_step", "job_user_id", "profile_id", "reference_check_id"},
     *              @SWG\Property(property="job", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="current_step", type="integer", description="Current step (step order), saved inside pivot table between profiles and jobes", example=0),
     *              @SWG\Property(property="job_user_id", type="integer", description="Roster step id", example=2),
     *              @SWG\Property(property="reference_check_id", type="integer", enum={0,1}, description="Check if current step has_reference_check == 1, if true send invitation", example=1),
     *            )
     *         ),
     *
     *       )
     *    )
     * )
     *
     **/
    public function referenceCheckInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'jobId' => 'required|integer',
            'current_step' => 'required|integer',
            'profile_id' => 'required|integer|exists:profiles,id',
            'job_user_id' => 'required|integer',
            'p11_reference_id' => 'sometimes|integer',
        ]);

        $profile = Profile::with('user')->findOrFail($validatedData['profile_id']);
        $job_status = JobStatus::findOrFail($validatedData['current_step']);
        $job = Job::findOrFail($validatedData['jobId']);

        $hr_manager = auth()->user();

        if ($job_status->has_reference_check == 1) {
            foreach ($profile->p11_references as $reference) {
                $code = rand(1231,7879);
                if(isset($validatedData["p11_reference_id"]) && $validatedData["p11_reference_id"] == $reference->id) {
                    $this->sendReferenceCheckInvitation($reference->id, $job, $profile, $code, $validatedData, $hr_manager);
                    break;
                } else if(!isset($validatedData["p11_reference_id"])) {
                    $this->sendReferenceCheckInvitation($reference->id, $job, $profile, $code, $validatedData, $hr_manager);
                }
            }
            // Email notification to the profile
            // Mail::to($profile->user->email)->send(new ReferenceCheckMail($profile->user->full_name, date('l, d F Y, H:i',strtotime($validatedData['interview_date'])), $validatedData['interview_timezone'], $validatedData['interview_skype'], auth()->user()->immap_email ,auth()->user()->full_name));

            $saved = JobUser::where('id', $validatedData['job_user_id'])->update(['reference_check_sent' => 1]);

            if ($saved && $profile) {
                return response()->success(__('job.success.send_invitation'));
            }

            return response()->error(__('crud.error.default'), 500);
        }

        return response()->error(__('job.error.not_reference_check'), 404);
    }

    /**
     * @SWG\Post(
     *   path="/api/job-p11-verify-reference",
     *   tags={"Roster"},
     *   summary="Verify reference check invitation link",
     *   description="File: app\Http\Controllers\API\RosterController@referenceCheckVerifyCode",
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
     *              required={"profile_id", "code", "reference_id"},
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="code", type="integer", description="code to verify link", example=0),
     *              @SWG\Property(property="reference_id", type="integer", description="Reference Id", example=2),
     *            )
     *         ),
     *
     *       )
     *    )
     * )
     *
     **/
    public function referenceCheckVerifyCode(Request $request)
    {
        $validatedData = $this->validate($request, [
            'reference_id' => 'required|integer',
            'job_user_id' => 'required|integer',
            'code' => 'required|string',
        ]);
        $jobUser = JobUser::with(['user', 'user.profile', 'job'])->findOrFail($validatedData['job_user_id']);
        if(!$jobUser) {
            return response()->error(__('roster.error.not_found'), 404);
        }
        $existingReference = ReferenceHistory::where('id', $validatedData['reference_id'])->where('job_id', $jobUser->job_id)->where('code', $validatedData['code'])->whereNotNull('code')->get()->first();
        if($existingReference) return response()->success(__('roster.success.interview_invite'), $jobUser);
        return response()->error(__('roster.error.not_reference_check'), 404);
    }
      /**
     * @SWG\Post(
     *   path="/api/roster/save-applicant-test-score/{id}",
     *   tags={"Job"},
     *   summary="Job - Save Test Score for applicant",
     *   description="File: app\Http\Controllers\API\JobController@saveApplicantTestScore",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="profile roster process id"),
     *   @SWG\Parameter(
     *          name="jobUser",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "test_link", "test_score", "position_to_interview_step"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="test_link", type="string", description="link to the test"),
     *              @SWG\Property(property="test_score", type="integer", minimum=0, maximum=100, description="test score in (%)", example="75"),
     *              @SWG\Property(property="position_to_interview_step", type="string", description="Test position to the interview step", example="before"),
     *
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function saveApplicantTestScore(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'test_link' => 'required|url',
            'test_score' => 'required|integer|min:0|max:100',
            'position_to_interview_step' => 'required|string|in:before,after'
        ]);

        $jobUser = JobUser::find($id);

        if (!$jobUser) {
            return response()->not_found();
        }
        if (empty($jobUser->job_user_tests)){
            $test = new JobUserTest();
            $test->job_user_id = $jobUser->id;
            $test->test_link = $validatedData['test_link'];
            $test->test_score = $validatedData['test_score'];
            $test->position_to_interview_step = $validatedData['position_to_interview_step'];
            $test->save();
        } else {
            $test = JobUserTest::where('job_user_id', $jobUser->id)->where('position_to_interview_step', $validatedData['position_to_interview_step'])->first();
            if (!empty($test)) {
                $test->test_link = $validatedData['test_link'];
                $test->test_score = $validatedData['test_score'];
                $test->position_to_interview_step = $validatedData['position_to_interview_step'];
                $test->save();
            } else {
                $test = new JobUserTest();
                $test->job_user_id = $jobUser->id;
                $test->test_link = $validatedData['test_link'];
                $test->test_score = $validatedData['test_score'];
                $test->position_to_interview_step = $validatedData['position_to_interview_step'];
                $test->save();
            }
        }

        return response()->success(__('crud.success.default'));
    }

    /*public function deletingdb()
    {
        for ($i = 1; $i <= 2; $i++) {
            echo "deleting id:" . $i . "<br>";
            if (TARRequest::where('id', $i)->exists()) {
                $record = TARRequest::find($i);
                $result = $record->delete();
                if (!$result) {
                    echo "error";
                }
                echo "success";
            }else{
                echo "no exists";
            }
        }
    }*/
}
