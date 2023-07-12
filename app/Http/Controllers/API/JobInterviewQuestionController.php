<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\JobInterviewScoreController;
use App\Models\InterviewQuestions;
use App\Models\Job;
use App\Models\JobInterviewFiles;
use App\Models\InterviewScores;
use App\Models\JobManager;
use App\Models\JobUser;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\Roster\RosterProcess;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
class JobInterviewQuestionController extends Controller
{

    /**
     * @SWG\GET(
     *   path="/api/job-interview-questions/{jobID}",
     *   tags={"Job Interview Questions"},
     *   summary="Get specific job interview questions",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestion@get",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="jobID",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job id"
     *   ),
     * )
     * 
     */
    public function get($jobID)
    {
        // Check if user is job manager
        $check = JobManager::select('id')->where(['user_id'=>auth()->user()->id, 'job_id'=>$jobID] )->get();
        // check if user is admin
        $isAdmin = auth()->user()->hasAnyPermission(['Set as Admin']);

        if ($check->count() == 0 && !$isAdmin) {
            return response()->error(__('interviewquestion.forbidden'), 403);
        }
        $adminEarliestInterview = null;
        $adminQuestionCount = 0;
        $interviewDate = null;
        $canAddQuestion= true;
        if($isAdmin) {
            $adminQuestionCount = InterviewQuestions::select('id')->where(['editable' => 0])
                ->where('job_id', '=', $jobID)->count();
 
            $adminEarliestInterview = JobUser::with('user')
                                ->join('job_status', 'job_status.id', '=', 'job_status_id')
                                ->where('job_status.slug', '=', 'interview')
                                ->where(['job_id'=>$jobID])
                                ->whereNotNull('interview_date')
                                ->orderBy('interview_date', 'desc')
                                ->limit('1')
                                ->get();
        }
        if($check->count() > 0) {
            $questionCount = InterviewQuestions::select('id')->where(['editable' => 1])->join('job_managers', function ($join) use($jobID) {
                $join->on('interview_questions.job_id', '=', 'job_managers.job_id')
                ->where('job_managers.user_id', '=', auth()->user()->id)
                ->where('job_managers.job_id', '=', $jobID);
            })->count();

            $earliestInterview = JobUser::with('user')
                                ->join('job_status', 'job_status.id', '=', 'job_status_id')
                                ->where('job_status.slug', '=', 'interview')
                                ->where(['job_id'=>$jobID])
                                ->where(DB::raw("JSON_CONTAINS(JSON_EXTRACT(panel_interview, '$[*].id'), '".auth()->user()->id."')"), '=', 1)
                                ->whereNotNull('interview_date')
                                ->orderBy('interview_date', 'asc')
                                ->limit('1')
                                ->get();

            // Check if edit questions have already been disabled
            if($earliestInterview->first() !== null) {
                $interviewDate = new Carbon($earliestInterview->first()->interview_date);
                
                $interviewNow = Carbon::now();
                if($earliestInterview->first()->timezone) {
                    $interviewDate->shiftTimezone($earliestInterview->first()->timezone);
                    $interviewNow->setTimezone($earliestInterview->first()->timezone);
                }
                $canAddQuestion = $interviewDate->gte($interviewNow);
                if($questionCount > 0 && isset($earliestInterview->first()->interview_date)) {
                    if($interviewDate->lt($interviewNow)) {
                        InterviewQuestions::select('id')->join('job_managers', function ($join) use($jobID) {
                            $join->on('interview_questions.job_id', '=', 'job_managers.job_id')
                            ->where('job_managers.job_id', '=', $jobID);
                        })->update(['editable'=> 0]);
                    }
                }
            }
        }

        $q = Job::with(['interview_questions', 'job_manager'])->where(['id' => $jobID])->get();

        if($adminEarliestInterview) $earliestInterview = $adminEarliestInterview;

        return response()->success(__('crud.success.default'), ['questions' => $q,
        'earliestInterview' => $earliestInterview, 'nonEditableQuestionsCount' => $adminQuestionCount, 'canAddQuestion' =>$canAddQuestion]);
    }

    /**
     * @SWG\GET(
     *   path="/api/job-interview-questions-roster/{rosterProcessID}",
     *   tags={"Roster Interview Questions"},
     *   summary="Get specific job interview questions",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestion@get",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="rosterID",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Roster id"
     *   ),
     * )
     * 
     */
    public function getRosterQuestions($rosterProfileID)
    {
        $isAdmin = auth()->user()->hasAnyPermission(['Set as Admin']);

        $adminEarliestInterview = null;
        $adminQuestionCount = 0;
        $interviewDate = null;
        $canAddQuestion= true;
        if($isAdmin) {
            $adminQuestionCount = InterviewQuestions::select('id')->where(['editable' => 0])
                ->where('roster_profile_id', '=', $rosterProfileID)->count();
 
            $adminEarliestInterview = ProfileRosterProcess::with('profile')
                                ->where(['id'=>$rosterProfileID])
                                ->whereNotNull('interview_date')
                                ->orderBy('interview_date', 'desc')
                                ->limit('1')
                                ->get();
        }
        $questionCount = InterviewQuestions::select('id')->where(['editable' => 0, 'roster_profile_id'=>$rosterProfileID])->count();

        $earliestInterview = ProfileRosterProcess::with('profile')
                            ->where(['id'=>$rosterProfileID])
                            ->where(DB::raw("JSON_CONTAINS(JSON_EXTRACT(panel_interview, '$[*].id'), '".auth()->user()->id."')"), '=', 1)
                            ->whereNotNull('interview_date')
                            ->orderBy('interview_date', 'asc')
                            ->limit('1')
                            ->get();

        // Check if edit questions have already been disabled
        if($earliestInterview->first() !== null) {
            $interviewDate = new Carbon($earliestInterview->first()->interview_date);
            
            $interviewNow = Carbon::now();
            if($earliestInterview->first()->timezone) {
                $interviewDate->shiftTimezone($earliestInterview->first()->timezone);
                $interviewNow->setTimezone($earliestInterview->first()->timezone);
            }

            $canAddQuestion = $interviewDate->gte($interviewNow);
            if($questionCount === 0 && isset($earliestInterview->first()->interview_date)) {
                if($interviewDate->lt($interviewNow)) {
                     InterviewQuestions::select('id')->where(['roster_profile_id'=>$rosterProfileID])->update(['editable'=> 0]);
                 }
            }
        }

        $managers =  ProfileRosterProcess::select('panel_interview')
                          ->where(['id'=>$rosterProfileID])
                          ->get();
        $managersArray = [];
        foreach($managers as $mn) {
            $pn = json_decode($mn->panel_interview);
            $managersArray = array_unique(array_merge($managersArray,$pn), SORT_REGULAR);
            $managersArray = array_intersect_key($managersArray, array_unique(array_column($managersArray, 'id')));
        }

        $profileProcess = ProfileRosterProcess::with('profile')
                            ->where(['id'=>$rosterProfileID])
                            ->get()
                            ->first();

        $q = RosterProcess::with(['interview_questions' => function ($query) use($rosterProfileID) {
            $query->where('roster_profile_id', '=', $rosterProfileID);
        },])
            ->where(['id' => $profileProcess->roster_process_id])
            ->get();

        if($adminEarliestInterview) $earliestInterview = $adminEarliestInterview;

        return response()->success(__('crud.success.default'), ['questions' => $q,
        'earliestInterview' => $earliestInterview, 'nonEditableQuestionsCount' => $adminQuestionCount, 'canAddQuestion' =>$canAddQuestion, 'managers' => $managersArray, 'profileProcess' => $profileProcess]);
    }

    /**
     * @SWG\POST(
     *   path="/api/job-interview-questions",
     *   tags={"Job Interview Questions"},
     *   summary="store job interview question",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestion@store",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="interviewQuestion",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"question","job_manager_id", "question_type"},
     *              @SWG\Property(property="question", type="string", description="Interview question", example="what's the question ?"),
     *              @SWG\Property(property="job_manager_id", type="string", description="Id of the job manager", example="1"),
     *              @SWG\Property(property="question_type", type="string", description="Type of the question", example="text"),
     *           )
     *       ),
     *    ),
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate(
            $request,
            [
                'question' => 'required|string',
                'job_id' => 'integer',
                'user_id' => 'required|integer',
                'question_type' => 'required|string|in:text,number',
                'roster_process_id' => 'integer',
                'roster_profile_id' => 'integer',
                'editable' => 'sometimes|integer',
            ]
        );
        $check = null;
        $editable = 1;
        if(isset($validatedData['editable'])) {
            $editable = $validatedData['editable'];
        }
        
        if(isset($validatedData['job_id'])) $check = JobManager::select('id')->where(['job_id' => $validatedData['job_id'], 'user_id' => $validatedData['user_id']])->get();
        
        // should check if manager is in the roster process, first discuss this with @adityoashari
        //if(isset($validatedData['roster_process_id'])) $check = JobManager::select('id')->where(['roster_process_id' => $validatedData['roster_process_id'], 'user_id' => $validatedData['user_id']])->get();
        
        if (isset($validatedData['job_id']) && $check->count() == 0) {
            return response()->error(__('interviewquestion.forbidden'), 403);
        } else {
            $question = null;
            if(isset($validatedData['job_id'])) {
                $question = InterviewQuestions::create([
                    'job_id' => $validatedData['job_id'],
                    'user_id' => $validatedData['user_id'],
                    'question' => $validatedData['question'],
                    'editable' => $editable,
                    'question_type' => $validatedData['question_type']
                ]);
            } else if(isset($validatedData['roster_process_id'])) {
                $question = InterviewQuestions::create([
                    'roster_process_id' => $validatedData['roster_process_id'],
                    'roster_profile_id' => $validatedData['roster_profile_id'],
                    'user_id' => $validatedData['user_id'],
                    'question' => $validatedData['question'],
                    'editable' => $editable,
                    'question_type' => $validatedData['question_type']
                ]);
            }
            if($question) return response()->success(__('crud.success.default'), $question);
            return response()->error(__('interviewquestion.forbidden'), 404);
        }
    }

    /**
     * @SWG\POST(
     *   path="/api/job-interview-questions/{id}",
     *   tags={"Job Interview Questions"},
     *   summary="update job interview question",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestion@update",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job interview question id"
     *   ),
     *   @SWG\Parameter(
     *       name="interviewQuestion",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"question","job_manager_id", "question_type"},
     *              @SWG\Property(property="question", type="string", description="Interview question", example="what's the question ?"),
     *              @SWG\Property(property="job_manager_id", type="string", description="Id of the job manager", example="1"),
     *              @SWG\Property(property="question_type", type="string", description="Type of the question", example="text"),
     *          )
     *       )
     *    )
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate(
            $request,
            [
                'question' => 'required|string',
                'job_id' => 'integer',
                'user_id' => 'required|integer',
                'question_type' => 'required|string|in:text,number',
                'roster_process_id' => 'integer'
            ]
        );

        if(isset($validatedData['job_id'])) $check = JobManager::select('id')->where(['job_id' => $validatedData['job_id'], 'user_id' => $validatedData['user_id']])->get();
        
        // should check if manager is in the roster process, first discuss this with @adityoashari
        //if(isset($validatedData['roster_process_id'])) $check = JobManager::select('id')->where(['roster_process_id' => $validatedData['roster_process_id'], 'user_id' => $validatedData['user_id']])->get();
        
        if (isset($validatedData['job_id']) && $check->count() == 0) {
            return response()->error(__('interviewquestion.forbidden'), 403);
        } else {
            $interviewQuestion = InterviewQuestions::find($id);
            $interviewQuestion->question = $validatedData['question'];
            $interviewQuestion->question_type = $validatedData['question_type'];

            $interviewQuestion->save();
            return response()->success(__('crud.success.default'), $interviewQuestion);
        }
    }

    /**
     * @SWG\POST(
     *   path="/api/job-interview-questions/edit/enable",
     *   tags={"Job Interview Questions"},
     *   summary="Enable edition on job questions",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestion@updateEdit",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="interviewQuestion",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"jobId"},
     *          @SWG\Property(
     *              property="jobId", type="string", description="job id", example="1"
     *          ),
     *       ),
     *    ),
     *  )
     * 
     */
    public function enableEdit(Request $request)
    {
        $validatedData = $this->validate(
            $request,
            [
                'jobId' => 'integer',
                'rosterProcessID' => 'integer',
                'rosterProfileID' => 'integer'
            ]
        );

        if(isset($validatedData['jobId'])) InterviewQuestions::select('id')->where('job_id', '=', $validatedData['jobId'])
        ->update(['editable'=> 1]);

        if(isset($validatedData['rosterProcessID'])) InterviewQuestions::select('id')->where('roster_process_id', '=', $validatedData['rosterProcessID'])
        ->where('roster_profile_id', '=', $validatedData['rosterProfileID'])
        ->update(['editable'=> 1]);

        return response()->success(__('crud.success.default'));
    }

    /**
     * @SWG\Post(
     *   path="/api/job-interview-questions/roster-process/change_interview_order",
     *   tags={"Job Interview Questions"},
     *   summary="change interview order",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestionController@update_interview_order, permission:View Applicant List",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job id"),
     *   @SWG\Parameter(
     *      name="interviewQuestion",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"roster_profile_id", "interview_order"},
     *          @SWG\Property(property="roster_profile_id", type="integer", description="roster profile id", example=5),
     *          @SWG\Property(property="interview_order", type="string", description="Interview order", example="1,2"),
     *
     *      )
     *   )

     * )
     *
     **/
    public function update_interview_order(Request $request) {
        $validatedData = $this->validate($request, [
            'roster_profile_id' => 'required|integer',
            'interview_order' => 'required|string',
        ]);

        $profile = ProfileRosterProcess::findOrFail($validatedData['roster_profile_id']);
        if($profile) {
            $profile->interview_order =  $validatedData['interview_order'];
            $profile->save();
        }

        return response()->success();
    }

    /**
     * @SWG\DELETE(
     *   path="/api/job-interview-questions/id",
     *   tags={"Job Interview Questions"},
     *   summary="delete interview question",
     *   description="File: app\Http\Controllers\API\JobInterviewQuestion@destroy",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
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
    public function destroy($id)
    {
        $record = InterviewQuestions::findOrFail($id);

        $scores = InterviewScores::where('interview_question_id', '=', $id)->get();
        $ids = [];
        foreach($scores as $score) {
            if(isset($score->applicant_id)) {
                if(!in_array($score->applicant_id, $ids)) {
                    $jobUser = JobUser::where('id', '=', $score->applicant_id)->get();
                    (new JobInterviewScoreController)->setFinalScore($record->job_id,$jobUser[0]->user_id);
                    array_push($ids, $score->applicant_id);
                }
            } else {
                if(!in_array($record->roster_profile_id, $ids)) {
                    (new JobInterviewScoreController)->setRosterFinalScore($record->roster_process_id,$record->roster_profile_id);
                    array_push($ids, $record->roster_profile_id);
                }
            }
            $score->delete();
        }
        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('Interviewquestion.internaServerError'), 500);
        }

        return response()->success(__('crud.success.default'));
    }
}
