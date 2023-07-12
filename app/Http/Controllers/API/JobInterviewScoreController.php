<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\InterviewScoreComment;
use App\Models\InterviewScores;
use App\Models\Job;
use App\Models\JobManager;
use App\Models\JobUser;
use App\Models\Profile;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\Roster\RosterProcess;
use Illuminate\Support\Facades\DB;
use PDF;

class JobInterviewScoreController extends Controller
{
    /**
     * @SWG\POST(
     *   path="/api/job-interview-scores",
     *   tags={"Job Interview Scores"},
     *   summary="store job interview score",
     *   description="File: app\Http\Controllers\API\JobInterviewScore@store",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="interviewScore",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"score","applicant_id", "interview_question_id"},
     *              @SWG\Property(property="score", type="number", description="Interview Score", example="1"),
     *              @SWG\Property(property="applicant_id", type="number", description="Id of the applicant", example="1"),
     *              @SWG\Property(property="interview_question_id", type="number", description="Id of the question", example="1"),
     *              @SWG\Property(property="comment", type="string", description="Interview question comment", example="Comment"),
     *           )
     *         ),
     *       )
     *    )
     * )
     *
     */
    public function store(Request $request)
    {
        $isAdmin = auth()->user()->hasAnyPermission(['Set as Admin']);
        $validatedData = $this->validate(
            $request,
            [
                'scores' => 'required|array',
                'scores.*.score' => 'integer',
                'scores.*.comment' => 'sometimes|string|nullable',
                'scores.*.applicant_id' => 'sometimes|integer',
                'scores.*.roster_process_id' => 'sometimes|integer',
                'scores.*.interview_question_id' => 'required|integer',
                'scores.*.editable' => 'integer',
                'globalImpression' => 'nullable',
                'globalImpression.comment' => 'sometimes|string',
                'globalImpression.editable' => 'sometimes|integer',
                'globalImpression.applicant_id' => 'sometimes|integer',
                'globalImpression.roster_process_id' => 'sometimes|integer',
                'globalImpression.manager_id' => 'sometimes|integer',
                'globalImpression.roster_profile_id' => 'sometimes|integer',
                'globalImpression.manager_user_id' => 'sometimes|integer',
            ]
        );

        if(!isset($validatedData['scores'][0]['roster_profile_id'])) $check = JobManager::select('id')->where('user_id', auth()->user()->id)->get();
        if (!$isAdmin && (!isset($validatedData['scores'][0]['roster_profile_id']) && $check->count() == 0)) {
            return response()->error(__('interviewquestion.forbidden'), 403);
        } else {
            $question = InterviewScores::insert($validatedData['scores']);
            if(isset($validatedData['globalImpression'])) {
                InterviewScoreComment::create($validatedData['globalImpression']);
            }
            return response()->success(__('crud.success.default'), $question);
        }
    }

    /**
     * @SWG\PUT(
     *   path="/api/job-interview-scores/",
     *   tags={"Job Interview Scores"},
     *   summary="update job interview score",
     *   description="File: app\Http\Controllers\API\JobInterviewScore@update",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Schema(
     *              required={"score","applicant_id", "interview_question_id"},
     *              @SWG\Property(property="score", type="number", description="Interview Score", example="1"),
     *              @SWG\Property(property="applicant_id", type="number", description="Id of the applicant", example="1"),
     *              @SWG\Property(property="interview_question_id", type="number", description="Id of the question", example="1"),
     *              @SWG\Property(property="comment", type="string", description="Interview question comment", example="Comment"),
     *           )
     *         ),
     *       )
     *    )
     * )
     *
     */
    public function update(Request $request)
    {
        $isAdmin = auth()->user()->hasAnyPermission(['Set as Admin']);
        $validatedData = $this->validate(
            $request,
            [
                'scores' => 'required|array',
                'scores.*.score' => 'integer|nullable',
                'scores.*.comment' => 'sometimes|string|nullable',
                'scores.*.applicant_id'=>'sometimes|integer',
                'scores.*.interview_question_id'=>'required|integer',
                'globalImpression' => 'nullable',
                'globalImpression.comment' => 'sometimes|string',
                'globalImpression.editable' => 'sometimes|integer',
                'globalImpression.applicant_id' => 'sometimes|integer',
                'globalImpression.manager_id' => 'sometimes|integer',
                'globalImpression.roster_process_id' => 'sometimes|integer',
                'globalImpression.roster_profile_id' => 'sometimes|integer',
                'globalImpression.manager_user_id' => 'sometimes|integer',
            ]
        );

        if(!isset($validatedData['scores'][0]['roster_profile_id'])) $check = JobManager::select('id')->where('user_id', auth()->user()->id)->get();
        if ($isAdmin || (isset($validatedData['scores'][0]['roster_profile_id']) || $check->count() > 0)) {
            $result = [];
            foreach($validatedData['scores'] as $score) {
                if(isset($score['applicant_id'])) {
                    $existingScore = InterviewScores::where(["applicant_id" => $score['applicant_id'], "interview_question_id" => $score['interview_question_id']])->first();
                    if($existingScore) {
                        $existingScore->score = $score['score'];
                        $existingScore->comment = $score['comment'];
                        $existingScore->editable = 0;
                        $existingScore->save();
                        array_push($result, $existingScore);
                    } else {
                        $createdScore = InterviewScores::create([
                            "score" => $score['score'],
                            "comment" => $score['comment'],
                            "applicant_id" => $score['applicant_id'],
                            "interview_question_id" => $score["interview_question_id"],
                            "editable" => 0
                        ]);
                        array_push($result, $createdScore);
                    }
                } else {
                    $existingScore = InterviewScores::where(["roster_profile_id" => $score['roster_profile_id'], "interview_question_id" => $score['interview_question_id']])->first();
                    if($existingScore) {
                        $existingScore->score = $score['score'];
                        $existingScore->comment = $score['comment'];
                        $existingScore->editable = 0;
                        $existingScore->save();
                        array_push($result, $existingScore);
                    } else {
                        $createdScore = InterviewScores::create([
                            "score" => $score['score'],
                            "comment" => $score['comment'],
                            "roster_profile_id" => $score['roster_profile_id'],
                            "interview_question_id" => $score["interview_question_id"],
                            "editable" => 0
                        ]);
                        array_push($result, $createdScore);
                    }
                }
            }
            if(isset($validatedData['globalImpression'])) {
                if(!isset($validatedData['globalImpression']['roster_process_id'])) {
                    $existingComment = InterviewScoreComment::where(["applicant_id" => $validatedData['globalImpression']['applicant_id'], "manager_id" => $validatedData['globalImpression']['manager_id']])->first();
                    if($existingComment) {
                        $existingComment->comment = $validatedData['globalImpression']['comment'];
                        $existingComment->editable = 0;
                        $existingComment->save();
                    } else {
                        InterviewScoreComment::create($validatedData['globalImpression']);
                    }
                } else {
                    $existingComment = InterviewScoreComment::where(["manager_user_id" => $validatedData['globalImpression']['manager_user_id'], "roster_profile_id" => $validatedData['globalImpression']['roster_profile_id']])->first();
                    if($existingComment) {
                        $existingComment->comment = $validatedData['globalImpression']['comment'];
                        $existingComment->editable = 0;
                        $existingComment->save();
                    } else {
                        InterviewScoreComment::create($validatedData['globalImpression']);
                    }
                }
            }
            return response()->success(__('crud.success.default'), $result);
        } else {
            return response()->error(__('interviewquestion.forbidden'), 403);
        }
    }

    /**
     * @SWG\POST(
     *   path="/api/job-interview-scores/enable-validation",
     *   tags={"Job Interview Scores"},
     *   summary="Enable edition on job questions score",
     *   description="File: app\Http\Controllers\API\JobInterviewScore@updateEdit",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Interviewquestion.internaServerError"),
     *   @SWG\Parameter(
     *       name="interviewScore",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"jobId"},
     *          @SWG\Property(
     *              property="applicant_id", type="string", description="applicant id", example="1",
     *              property="job_manager_id", type="string", description="job manager id", example="1",
     *              property="job_id", type="number", description="job id", example="1",
     *          ),
     *       ),
     *    ),
     * )
     *
     */
    public function enableEdit(Request $request)
    {
        $validatedData = $this->validate(
            $request,
            [
                'applicant_id' => 'integer',
                'job_manager_id' => 'integer',
                'job_id' => 'integer',
                'interview_question_id' => 'integer',
                'manager_id' => 'required|integer',
                'roster_process_id' => 'integer',
                'roster_profile_id' => 'integer'
            ]
        );
        if(!isset($validatedData['roster_process_id'])) {
            InterviewScores::select('id')->where(['applicant_id' => $validatedData['applicant_id']])
                ->join('interview_questions', function ($join) use($validatedData) {
                    $join->where('job_id', '=', $validatedData['job_id'])
                        ->where('user_id', '=', $validatedData['job_manager_id']);
                })->update(['interview_scores.editable'=> 1]);
        } else {
            InterviewScores::select('id')->where(['roster_process_id' => $validatedData['roster_process_id']])
                ->join('interview_questions', function ($join) use($validatedData) {
                    $join->where('roster_process_id', '=', $validatedData['roster_process_id']);
                })->update(['interview_scores.editable'=> 1]);
        }
        if(!isset($validatedData['roster_profile_id'])) {
            InterviewScoreComment::select('id')->where(['applicant_id' => $validatedData['applicant_id'], 'manager_id' => $validatedData['manager_id']])
                ->update(['editable'=> 1]);
        } else {
            InterviewScoreComment::select('id')->where(['roster_profile_id' => $validatedData['roster_profile_id'], 'roster_process_id' => $validatedData['roster_process_id']])
            ->update(['editable'=> 1]);
        }

        return response()->success(__('crud.success.default'));
    }

    /**
     * @SWG\DELETE(
     *   path="/api/job-interview-scores/id",
     *   tags={"Job Interview Scores"},
     *   summary="delete interview score",
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
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = InterviewScores::findOrFail($id);
        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('Interviewquestion.internaServerError'), 500);
        }

        return response()->success(__('crud.success.default'));
    }

    /**
     * @SWG\Post(
     *   path="'job-interview-scores/jobs/{jobId}/profile/{profileId}/final-score",
     *   tags={"Job Interview Score"},
     *   summary="Set final score",
     *   description="File: app\Http\Controllers\API\JobInterviewScoreController@setFinalScore, User: Profile, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="jobId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function setFinalScore($jobId, $applicantId = null)
    {
        $userid = $applicantId;
        $jobs = Job::with([
                'job_user' => function ($q) use ($userid) {
                    return $q->select('job_user.id', 'job_user.created_at', 'job_user.job_status_id', 'job_user.user_id', 'job_user.job_id', 'job_user.interview_date')
                    ->where('user_id', $userid)->orderBy('created_at', 'desc');
                },
                'job_user.user',
                'job_user.user.profile:profiles.id,is_immaper,verified_immaper,user_id',
                'job_user.job_interview_scores',
                'job_user.job_interview_scores.interviewQuestion',
                'job_manager',
                'interview_questions',
                'interviewScore' => function ($q) use ($userid) {
                    return $q->select('id','job_id','file_name','user_interview_name','user_interview_email','media_id')
                                ->where('user_id', $userid);
                },
                'job_user.job_interview_global_impression',
                'tor:id,job_standard_id',
                'tor.job_standard:id,under_sbp_program'
            ])
            ->select('jobs.id', 'jobs.title', 'jobs.country_id', 'jobs.status', 'jobs.tor_id')
            ->where('id', $jobId)
            ->get();
        $applicantScores = $jobs[0]['job_user'][0]['job_interview_scores'];
        $applicantGlobalImpression = $jobs[0]['job_user'][0]['job_interview_global_impression'];
        $managers = $jobs[0]['job_manager'];

        $finalReportData = $this->calculateScore($applicantScores, $managers, $applicantGlobalImpression);
        $jobUser = JobUser::where(["user_id" => $applicantId, "job_id" => $jobId])->latest()->first();
        $jobUser->final_interview_score = $finalReportData['finalScore'];
        $jobUser->save();

        $isPdfCreated = DB::table('media')->select('id')
        ->where('model_id', $jobs[0]['job_user'][0]->id)->where('collection_name', 'recruitment-interview-report')->get();

        if ($isPdfCreated->count() > 0) {
            $jobUser->clearMediaCollection('recruitment-interview-report');
        }
        
        return response()->success(__('crud.success.default'), $jobUser);
    }

    /**
     * Calculate final score of an applicant.
     *
     * @param  array $applicantScores
     * @param  array $managers
     * @param  array $applicantGlobalImpression
     */
    function calculateScore ($applicantScores, $managers, $applicantGlobalImpression) {
        $questionData = [];
        // Group scores by manager
        foreach($applicantScores as $sc) {
                if(isset($questionData[$sc['interviewQuestion']->user_id])) {
                    array_push($questionData[$sc['interviewQuestion']->user_id], $sc);
                } else {
                    $data = array();
                    array_push($data, $sc);
                    $questionData[$sc['interviewQuestion']->user_id] = $data;
                }
        }
        // Assign manager object to scores
        $managerData = [];
        foreach($managers as $mn) {
            if(isset($questionData[$mn->user_id])) {
                array_push($managerData, ["score" => $questionData[$mn->user_id], "manager" => $mn]);
            } else {
                array_push($managerData, ["score" => [], "manager" => $mn]);
            }
        }
        $finalReportData = [];
        // calculate average score by manager
        foreach($managerData as $mnd) {
            $totalScore = 0;
            $scoreCount = 0;
            if(isset($mnd['score'])) {
                foreach($mnd['score'] as $mnsc) {
                    
                    if($mnsc['interviewQuestion']->question_type === "number") {
                        $scoreCount += 1;
                        $totalScore += $mnsc->score;
                    }
                }
            }
            $gComment = "";
            foreach($applicantGlobalImpression as $agi) {
                if($agi->manager_id === $mnd['manager']->id) $gComment = $agi->comment;
            }
            if($scoreCount > 0) {
                array_push($finalReportData, ["manager" => $mnd, "averageScore" => $totalScore / $scoreCount, "globalComment" => $gComment]);
            } else {
                array_push($finalReportData, ["manager" => $mnd, "averageScore" => "No Score", "globalComment" => $gComment]); 
            }
            $gComment = "";
        }
    
        // Calculate final score
        $finalScore = 0;
        $managerCount = 0;
    
        foreach($finalReportData as $m) {
            if($m["averageScore"] !== "No Score") {
                $managerCount += 1;
                $finalScore += $m["averageScore"];
            }
        }
    
        if($managerCount > 0) {
            $finalScore = $finalScore / $managerCount;
        }
    
        return ["finalReportData" => $finalReportData, "finalScore" => $finalScore];
    }

    /**
     * @SWG\Post(
     *   path="job-interview-scores/roster-process/{rosterProcessId}/profile/{profileRosterId}/final-score",
     *   tags={"Job Interview Score"},
     *   summary="Set final score",
     *   description="File: app\Http\Controllers\API\JobInterviewScoreController@setRosterFinalScore, User: Profile, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileRosterId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="rosterProcessId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function setRosterFinalScore($rosterProcessId, $profileRosterId)
    {
        $profiles = ProfileRosterProcess::with([
            'job_interview_scores',
            'job_interview_global_impression',
            'job_interview_scores.interviewQuestion',
        ])
        ->where('id', $profileRosterId)
        ->get();

        $applicantScores = $profiles[0]['job_interview_scores'];
        $applicantGlobalImpression = $profiles[0]['job_interview_global_impression'];
        $managers = json_decode($profiles[0]->panel_interview); //set managers;

        $rosterProcess = RosterProcess::find($rosterProcessId);

        $finalReportData = $this->calculateRosterScore($applicantScores, $managers, $applicantGlobalImpression);
        $jobUser = ProfileRosterProcess::where('id', $profileRosterId)->first();
        $jobUser->final_interview_score = $finalReportData['finalScore'];
        $jobUser->save();

        $isPdfCreated = DB::table('media')->select('id')
        ->where('model_id', $jobUser->id)->where('collection_name', 'recruitment-roster-interview-report')->get();

        if ($isPdfCreated->count() > 0) {
            $jobUser->clearMediaCollection('recruitment-roster-interview-report');
        }
        
        return response()->success(__('crud.success.default'), $jobUser);
    }

    /**
     * Calculate final score of an applicant.
     *
     * @param  array $applicantScores
     * @param  array $managers
     * @param  array $applicantGlobalImpression
     */
    function calculateRosterScore ($applicantScores, $managers, $applicantGlobalImpression) {
        $questionData = [];
        // Group scores by manager
        foreach($applicantScores as $sc) {
                if(isset($sc['interviewQuestion']) && is_object($sc['interviewQuestion']) && isset($questionData[$sc['interviewQuestion']->user_id])) {
                    array_push($questionData[$sc['interviewQuestion']->user_id], $sc);
                } else if(isset($sc['interviewQuestion']) && is_object($sc['interviewQuestion'])) {
                    $data = array();
                    array_push($data, $sc);
                    $questionData[$sc['interviewQuestion']->user_id] = $data;
                }
        }
        // Assign manager object to scores
        $managerData = [];
        foreach($managers as $mn) {
            if(isset($questionData[$mn->id])) {
                array_push($managerData, ["score" => $questionData[$mn->id], "manager" => $mn]);
            } else {
                array_push($managerData, ["score" => [], "manager" => $mn]);
            }
        }
        $finalReportData = [];
        // calculate average score by manager
        foreach($managerData as $mnd) {
            $totalScore = 0;
            $scoreCount = 0;
            if(isset($mnd['score'])) {
                foreach($mnd['score'] as $mnsc) {
                    
                    if($mnsc['interviewQuestion']->question_type === "number") {
                        $scoreCount += 1;
                        $totalScore += $mnsc->score;
                    }
                }
            }
            $gComment = "";
            foreach($applicantGlobalImpression as $agi) {
                if($agi->manager_user_id === $mnd['manager']->id) $gComment = $agi->comment;
            }
            if($scoreCount > 0) {
                array_push($finalReportData, ["manager" => $mnd, "averageScore" => $totalScore / $scoreCount, "globalComment" => $gComment]);
            } else {
                array_push($finalReportData, ["manager" => $mnd, "averageScore" => "No Score", "globalComment" => $gComment]); 
            }
            $gComment = "";
        }
    
        // Calculate final score
        $finalScore = 0;
        $managerCount = 0;
    
        foreach($finalReportData as $m) {
            if($m["averageScore"] !== "No Score") {
                $managerCount += 1;
                $finalScore += $m["averageScore"];
            }
        }
    
        if($managerCount > 0) {
            $finalScore = $finalScore / $managerCount;
        }
    
        return ["finalReportData" => $finalReportData, "finalScore" => $finalScore];
    }

    /**
     * @SWG\Get(
     *   path="'job-interview-scores/jobs/{jobId}/profile/{profileId}/",
     *   tags={"Job Interview Score"},
     *   summary="getInterviewReportPdf",
     *   description="File: app\Http\Controllers\API\JobInterviewScoreController@setFinalScore, User: Profile, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="jobId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function getInterviewReportPdf($jobId, $applicantId = null)
    {
        $userid = $applicantId;
        $jobs = Job::with([
                'job_user' => function ($q) use ($userid) {
                    return $q->select('job_user.id', 'job_user.created_at', 'job_user.job_status_id', 'job_user.user_id', 'job_user.job_id', 'job_user.interview_date')
                    ->where('user_id', $userid)->orderBy('created_at', 'desc');
                },
                'job_user.user',
                'job_user.user.profile:profiles.id,is_immaper,verified_immaper,user_id',
                'job_user.job_interview_scores' => function ($q) {
                    return $q->orderBy('id', 'desc');
                },
                'job_user.job_interview_scores.interviewQuestion',
                'job_manager',
                'interview_questions',
                'interviewScore',
                'job_user.job_interview_global_impression',
                'tor:id,job_standard_id,mailing_address',
                'tor.job_standard:id,under_sbp_program'
            ])
            ->select('jobs.id', 'jobs.title', 'jobs.country_id', 'jobs.status', 'jobs.tor_id')
            ->where('id', $jobId)
            ->get();
        $applicant = $jobs[0]['job_user'][0]['user'];
        $applicantScores = $jobs[0]['job_user'][0]['job_interview_scores']->unique('interview_question_id');
        $applicantGlobalImpression = $jobs[0]['job_user'][0]['job_interview_global_impression'];
        $managers = $jobs[0]['job_manager'];

        $isPdfCreated = DB::table('media')->select('id')
            ->where('model_id', $jobs[0]['job_user'][0]->id)->where('collection_name', 'recruitment-interview-report')->get();

        if($isPdfCreated->count()==0) {
            $finalReportData = $this->calculateScore($applicantScores, $managers, $applicantGlobalImpression);
        
            $header=view('header')->render();
            $footer=view('footer-custom-mailing-address', [
                'mailing_address' => str_replace(',', '<br/>',$jobs[0]['tor']->mailing_address)
            ])->render();

            $view = view('recruitment-report.interview', [
                'applicant' => $applicant,
                'reportData' => $finalReportData["finalReportData"],
                'interviewUser' => $jobs[0]['job_user'][0],
                "finalScore" => $finalReportData["finalScore"],
                'jobTitle' => $jobs[0]->title
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

            // the folder should exist in HR-Roster/storage/public/recruitment-interview-report
            $path = storage_path("app/public/recruitment-interview-report/".$jobs[0]['job_user'][0]->id.'-interview'.".pdf");
            $pdf->save($path);
            $jobs[0]['job_user'][0]->addMedia($path)->toMediaCollection('recruitment-interview-report', 's3');
            $jobs = $jobs = Job::with([
                'job_user' => function ($q) use ($userid) {
                    return $q->select('job_user.id', 'job_user.created_at', 'job_user.job_status_id', 'job_user.user_id', 'job_user.job_id', 'job_user.interview_date')
                    ->where('user_id', $userid)->orderBy('created_at', 'desc');
                },
            ])
            ->select('jobs.id', 'jobs.title', 'jobs.country_id', 'jobs.status', 'jobs.tor_id')
            ->where('id', $jobId)
            ->get();
        }

        $pdf = $jobs[0]['job_user'][0]->getMedia('recruitment-interview-report')[0]->getFullUrlFromS3();
        
        return response()->success(__('crud.success.default'), $pdf);
    }



    /**
     * @SWG\Get(
     *   path="'job-interview-scores/roster-process/{rosterProcessId}/profile/{profileId}/",
     *   tags={"Job Interview Score"},
     *   summary="get Interview score Report in Pdf",
     *   description="File: app\Http\Controllers\API\JobInterviewScoreController@setFinalScore, User: Profile, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="jobId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function getRosterInterviewReportPdf($rosterProcessId, $profileRosterId)
    {
        $profiles = ProfileRosterProcess::with([
            'job_interview_scores' => function ($q) {
                return $q->orderBy('id', 'desc');
            },
            'job_interview_global_impression',
            'job_interview_scores.interviewQuestion' => function($q) use ($profileRosterId){
                return $q->where('roster_profile_id', $profileRosterId);
            },
            'profile.user',
            'profile'
        ])
        ->where('id', $profileRosterId)
        ->get();

        $applicant = $profiles[0]['profile']['user'];

        $applicantScores = $profiles[0]['job_interview_scores']->unique('interview_question_id');

        $applicantGlobalImpression = $profiles[0]['job_interview_global_impression'];
        $managers = json_decode($profiles[0]->panel_interview);

        $rosterProcess = RosterProcess::where('id', $rosterProcessId)->get()->first();

        $isPdfCreated = DB::table('media')->select('id')
            ->where('model_id', $profiles[0]->id)->where('collection_name', 'recruitment-roster-interview-report')->get();

        if($isPdfCreated->count()==0) {
            $finalReportData = $this->calculateRosterScore($applicantScores, $managers, $applicantGlobalImpression);
        
            $header=view('header')->render();
            $footer=view('footer-custom-mailing-address', [
                'mailing_address' => 'mailing address' //str_replace(',', '<br/>',$jobs[0]['tor']->mailing_address)
            ])->render();

            $view = view('recruitment-report.interview-roster', [
                'applicant' => $applicant,
                'reportData' => $finalReportData["finalReportData"],
                'interviewUser' => $profiles[0],
                "finalScore" => $finalReportData["finalScore"],
                'jobTitle' => $rosterProcess->name,
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

            // the folder should exist in HR-Roster/storage/public/recruitment-roster-interview-report
            $path = storage_path("app/public/recruitment-roster-interview-report/".$profiles[0]->id.'-interview-roster'.".pdf");
            $pdf->save($path);
            $profiles[0]->addMedia($path)->toMediaCollection('recruitment-roster-interview-report', 's3');
            $profiles = ProfileRosterProcess::with([
                'job_interview_scores',
                'job_interview_global_impression',
                'job_interview_scores.interviewQuestion',
            ])->where('id', $profileRosterId)->get();
        }
        $pdf = $profiles[0]->getMedia('recruitment-roster-interview-report')[0]->getFullUrlFromS3();
        
        return response()->success(__('crud.success.default'), $pdf);
    }
}