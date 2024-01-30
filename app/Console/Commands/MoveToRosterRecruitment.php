<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\RosterMoverDuplicateReport;
use App\Models\Job;
use App\Models\JobUser;
use App\Models\JobStatus;
use App\Models\Profile;
use App\Models\Roster\RosterProcess;
use App\Models\Roster\RosterStep;
use App\Models\Roster\ProfileRosterProcess;
use App\Console\Commands\MoveToRosterRecruitment\DuplicateReport;

class MoveToRosterRecruitment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'job:move-applicant-to-roster';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move Job Applicant to Roster Recruitment Campaign';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Handle Job Vacancy
        $jobId = $this->askJobId();
        $job = Job::where("id", $jobId)->first();

        if (is_null($job)) {
            echo "Job not found." . PHP_EOL;
            return false;
        }

        // Handle Roster Process
        $rosterSkillset = $this->askRosterSkillset();
        $roster = $this->checkRosterExist($rosterSkillset);

        if (is_null($roster)) {
            echo "There is no or multiple roster with the skillset, please contact 3iSolution Careers Admin/Developer" . PHP_EOL;
            return false;
        }

        $roster = $roster->first();

        // handle Roster step
        $cvCheckingStep = $roster->roster_steps()->where('default_step', 1)->first();
        $threeHeadsQuestionsStep = $roster->roster_steps()->where('has_skype_call', 1)->first();
        $interviewStep = $roster->roster_steps()->where('has_interview', 1)->first();
        $referenceStep = $roster->roster_steps()->where('has_reference_check', 1)->first();
        $rejectedStep = $roster->roster_steps()->where('set_rejected', 1)->first();

        // check duplication
        // get profile ids from job applicants
        $jobApplicants = Profile::whereHas('user.job_user', function($query) use ($job) {
            $query->where('job_id', $job->id);
        })->get();
        $jobApplicantProfileIDs = ($jobApplicants->count() > 0) ? $jobApplicants->sortBy('id')->values()->pluck('id')->unique()->all() : [];

        if ($jobApplicants->count() < 1) {
            echo "No Applicants in the Job Vacancy". PHP_EOL;
            return false;
        }

        // get profile ids from roster recruitment process
        $rosterApplicants = ProfileRosterProcess::where('roster_process_id', $roster->id)->orderBy('profile_id')->distinct('profile_id')->get();
        $rosterApplicantProfileIDs = ($rosterApplicants->count() > 0) ? $rosterApplicants->sortBy('profile_id')->values()->pluck('profile_id')->unique()->all() : [];
        $duplicateIDs = array_intersect($jobApplicantProfileIDs, $rosterApplicantProfileIDs);

        // preparing data
        $newRosterApplicants = [];
        $duplicateData = [];
        $rejectedOnBoth = [];
        foreach($jobApplicants as $applicantProfile) {
            // check duplication
            if(in_array($applicantProfile->id, $rosterApplicantProfileIDs)) {
                // check higher order
                $applicantData = $rosterApplicants->where('profile_id', $applicantProfile->id)->first();
                $rosterStep = RosterStep::where('order',$applicantData->current_step)->where('roster_process_id', $roster->id)->first();
                $jobStatus = $applicantProfile->user->job_user()->where('job_id', $job->id)->orderBy('updated_at', 'desc')->first()->job_status;

                if ($rosterStep->set_rejected == 1 && $jobStatus->set_as_rejected == 1) {
                    array_push($rejectedOnBoth, new DuplicateReport(
                        $applicantProfile->id,
                        $applicantProfile->user->full_name,
                        $jobStatus->status,
                        $rosterStep->step
                    ));
                } else {
                    array_push($duplicateData, new DuplicateReport(
                        $applicantProfile->id,
                        $applicantProfile->user->full_name,
                        $jobStatus->status,
                        $rosterStep->step
                    ));

                }

            } else {
                // check if the user has applicant data on rejected step
                $inRejected = JobUser::where('job_id', $job->id)->where('user_id', $applicantProfile->user_id)->whereHas('job_status', function($query) {
                    $query->where('set_as_rejected', 1);
                })->orderBy('updated_at', 'desc')->first();
                // check if the user has applicant data on any step besides rejected
                $inActive = JobUser::where('job_id', $job->id)->where('user_id', $applicantProfile->user_id)->whereHas('job_status', function($query) {
                    $query->where('set_as_rejected', 0);
                })->orderBy('updated_at', 'desc')->first();

                // set up basic data
                $newRosterApplicantData = [
                    'roster_process_id' => $roster->id,
                    'profile_id' => $applicantProfile->id,
                    'set_as_current_process' => 1,
                    'is_completed' => 0,
                    'is_rejected' => 0,
                    'coming_from_job_id' => $job->id
                ];

                // setup for rejected
                if (!is_null($inRejected) && is_null($inActive)) {
                    $newRosterApplicantData['set_as_current_process'] = 0;
                    $newRosterApplicantData['created_at'] = $inRejected->created_at;
                    $newRosterApplicantData['updated_at'] = $inRejected->updated_at;
                    $newRosterApplicantData['is_rejected'] = 1;
                    $newRosterApplicantData['current_step'] = $rejectedStep->order;
                }

                // set for active
                if (!is_null($inActive)) {
                    $newRosterApplicantData['created_at'] = $inActive->created_at;
                    $newRosterApplicantData['updated_at'] = $inActive->updated_at;

                    // set for reference check
                    if ($inActive->job_status->last_step == 1) {
                        $newRosterApplicantData['set_as_current_process'] = 0;
                        $newRosterApplicantData['is_completed'] = 1;
                        $newRosterApplicantData['current_step'] = $referenceStep->order;
                    }

                    // set for cvChecking
                    if ($inActive->job_status->default_status == 1) {
                        $newRosterApplicantData['current_step'] = $cvCheckingStep->order;
                    }

                    // set for 3 heads questions
                    if ($inActive->job_status->set_as_shortlist == 1) {
                        $newRosterApplicantData['current_step'] = $threeHeadsQuestionsStep->order;
                    }

                    // set for interview
                    if ($inActive->job_status->is_interview == 1) {
                        $newRosterApplicantData['current_step'] = $interviewStep->order;
                    }
                }

                array_push($newRosterApplicants, $newRosterApplicantData);
            }

        }

        // move applicant to recruitment campaign
        if (count($newRosterApplicants) > 0) {
            try {
                ProfileRosterProcess::insert($newRosterApplicants);
                Log::info("[Job Applicants to Roster Recruitment Campaign] The Applicant Data: ", $newRosterApplicants);
                Log::info("[Job Applicants to Roster Recruitment Campaign] The Applicant Data Total: " . count($newRosterApplicants));
            } catch (\Illuminate\Database\QueryException $e) {
                $errText = "There is an error while moving job recruitment to roster recruitment";
                echo $errText ." please see the log to see the details". PHP_EOL;
                Log::error($errText);
                Log::error("The Job: ". $job->title . " [ID: ". $job->id ."]");
                Log::error("The Roster Skillset: ". $rosterSkillset);
                Log::error("The Roster: ". $roster->name . " [ID: ". $roster->id ."]");
                Log::error("The Applicant Data:", $newRosterApplicants);

                return false;
            }

            try {
                Profile::whereIn('id', $jobApplicantProfileIDs)->update(['become_roster' => 1]);
                Log::info("[Job Applicants to Roster Recruitment Campaign] The Applicant Profile Update Data: ", $jobApplicantProfileIDs);
                Log::info("[Job Applicants to Roster Recruitment Campaign] The Applicant Profile Update Data Total: ". count($jobApplicantProfileIDs));
            } catch (\Illuminate\Database\QueryException $e) {
                $errText = "There is an error while updating become_roster data for the applicant";
                echo $errText ." please see the log to see the details". PHP_EOL;
                Log::error($errText);
                Log::error("The Job: ". $job->title . " [ID: ". $job->id ."]");
                Log::error("The Roster Skillset: ". $rosterSkillset);
                Log::error("The Roster: ". $roster->name . " [ID: ". $roster->id ."]");
                Log::error("The Applicant Profile Update Data:", $jobApplicantProfileIDs);

                return false;
            }
        }


        // send duplicate report email
        if (count($duplicateIDs) > 0 || count($rejectedOnBoth) > 0) {
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new RosterMoverDuplicateReport($job, $roster, $duplicateData, $rejectedOnBoth));
        }

        echo "Finished!" . PHP_EOL;
        return true;
    }

    /**
     * askJobId is a function to ask job id to the user
     */
    function askJobId()
    {
        $jobId = $this->ask('Job ID?');
        if (!is_int((int) $jobId)) {
            echo 'Invalid value, please put integer value', PHP_EOL;
            return $this->askJobId();
        }

        return $jobId;
    }

    /**
     * askRosterSkillset is a function to ask roster skillset to the user
     */
    function askRosterSkillset()
    {
        $rosterSkillset = strtoupper($this->ask('Surge Roster Skillset (Choose: [IM/M&E/GIS])?'));

        if ($rosterSkillset == "IM" || $rosterSkillset == "M&E" || $rosterSkillset == "GIS") {
            return $rosterSkillset;
        }

        echo "Invalid value, please pick one of this skillset: IM|M&E|GIS", PHP_EOL;
        return $this->askRosterSkillset();
    }

    /**
     * checkRosterExist is a function to check if the skillset provided by the user is exist or not
     */
    function checkRosterExist(string $rosterSkillset = '')
    {
        if ($rosterSkillset !== '') {
            $roster = RosterProcess::where('skillset', $rosterSkillset)->where('under_sbp_program', "yes")->get();

            if ($roster->count() !== 1) {
                return NULL;
            }

            return $roster;
        }

        return NULL;
    }
}
