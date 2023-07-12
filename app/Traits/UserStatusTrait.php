<?php

namespace App\Traits;

use App\Models\User;
use App\Models\Profile;
use App\Models\JobStatus;
use App\Models\Roster\RosterStep;
use App\Models\Roster\RosterProcess;

/**
 * This is the file containing function to be used in any controller to check or update a user(s) status (Hidden, Active, Inactive, Not Submitted)
 */
trait UserStatusTrait
{
    /**
     * Get List of active job status
     */
    public function getActiveJobStatus()
    {
        $activeJobStatus = JobStatus::select('id', 'status')->where([
            'default_status' => 0,
            'set_as_rejected' => 0
        ])->get();

        if (empty($activeJobStatus)) {
            $activeJobStatus = [];
        } else {
            $activeJobStatus = $activeJobStatus->pluck('id')->toArray();
        }

        return $activeJobStatus;
    }

    /**
     * Get List of step order for Active SBP Roster
     */
    public function getActiveSbpRosterStepOrder() {
        $sbpRoster = RosterProcess::where('is_default', 0)->first();
        return [
            'sbpRoster' => $sbpRoster,
            'activeSbpRosterStepsOrder' => $sbpRoster->roster_steps()->where('default_step', 0)->where('set_rejected', 0)->get()->pluck('order')->toArray()
        ];
    }

    /**
     * Get list of all roster and it's active step order
     */
    public function getActiveOnRosterRecruitmentWithStepOrder()
    {
        $rosters = RosterProcess::all();
        $rosterAndSteps = [];
        foreach($rosters as $key => $roster) {
            array_push($rosterAndSteps, [
                'rosterData' => $roster,
                'activeStepsOrder' => $roster->roster_steps()->where('default_step', 0)->where('set_rejected', 0)->get()->pluck('order')->toArray(),
            ]);
        }

        return $rosterAndSteps;
    }

    /**
     * Change user status into Active if the job applicant is moved to Shortlisted, Interview or Accepted
     */
    public function changeUserStatusBasedOnNewJobStatus(User $selectedUser, int $newJobStatusId) {
        if (in_array($newJobStatusId, $this->getActiveJobStatus())) {
            if ($selectedUser->p11Completed == 1) {
                $selectedUser->status = 'Active';
                $selectedUser->inactive_user_has_been_reminded = 'false';
                $selectedUser->inactive_user_has_been_reminded_date = NULL;
                $selectedUser->inactive_date = NULL;
                $selectedUser->save();
            }
        }
    }

    /**
     * Change user status into Active if the roster applicant is moved to:
     * - iMMAP Roster
     *  -- Interview and all statuses after it except the rejected status.
     * - SBP Roster
     *  -- 3 Heads questions and all statuses after it except the rejected status.
     */
    public function changeUserStatusBasedOnNewRosterStep(Profile $selectedProfile, RosterProcess $selectedRosterProcess) {
        $activeRosterStepOrder = [];
        $changeToActive = false;

        // GET All Roster with it's active roster steps
        $allRosterOrders = $this->getActiveOnRosterRecruitmentWithStepOrder();

        if(!empty($allRosterOrders)) {
            foreach($allRosterOrders as $rosterData) {
                if($rosterData['rosterData']->id == $selectedRosterProcess->id){
                    $activeRosterStepOrder = $rosterData['activeStepsOrder'];
                }
            }
        }

        $selectedUser = $selectedProfile->user;
        $rosterApplications = $selectedProfile->profile_roster_processes()->where('roster_process_id', $selectedRosterProcess->id)->get();
        if (!empty($rosterApplications)) {
            foreach($rosterApplications as $rosterApplication) {
                if (in_array($rosterApplication->current_step, $activeRosterStepOrder)) {
                    $changeToActive = true;
                }
            }
        }

        if ($changeToActive) {
            if ($selectedUser->p11Completed == 1) {
                $selectedUser->status = 'Active';
                $selectedUser->inactive_user_has_been_reminded = 'false';
                $selectedUser->inactive_user_has_been_reminded_date = NULL;
                $selectedUser->inactive_date = NULL;
                $selectedUser->save();
            }
        }
    }

    /**
     * Generate User Query for checking list of users who are NOT shortlisted
     * if the user match one of this criteria below :
     *  - iMMAP Jobs: every status except active and rejected
     *  - roster: interview and all the statuses after it except the rejected status.
     *  - SBP Roster: 3 heads questions and all the statuses after it except the rejected status.
     */
    public function getQueryForUserWhoAreNotShortlisted(string $userStatus = null) {
        $activeJobStatus = $this->getActiveJobStatus();

        // GET All Roster with it's active roster steps
        $allRosterWithActiveOrder = $this->getActiveOnRosterRecruitmentWithStepOrder();

        $userQuery = User::where(function($query) use ($activeJobStatus, $allRosterWithActiveOrder) {
                        $query = $query->where(function($subQuery) {
                            // check if the user is not applying to a job and roster campaign
                            return $subQuery->doesntHave('job_user')->doesntHave('profile.profile_roster_processes');
                        })->orWhere(function($subQuery) use ($activeJobStatus, $allRosterWithActiveOrder) {
                            // check if the user has applied to a job but only at Active / Rejected
                            $subQuery = $subQuery->whereDoesntHave('job_user', function($subSubQuery) use ($activeJobStatus) {
                                return $subSubQuery->whereIn('job_status_id', $activeJobStatus);
                            });

                            if (!empty($allRosterWithActiveOrder)) {
                                foreach($allRosterWithActiveOrder as $key => $rosterData) {
                                    // check if the user has applied to a roster campaign and it's on the CV Checking/Rejected Step only
                                    $subQuery = $subQuery->whereDoesntHave('profile.profile_roster_processes', function($subSubQuery) use ($rosterData) {
                                        return $subSubQuery->where('roster_process_id', $rosterData['rosterData']->id)->whereIn('current_step', $rosterData['activeStepsOrder']);
                                    });
                                }
                            }

                            return $subQuery;
                        });
                    });

        if (!is_null($userStatus)) {
            $userQuery = $userQuery->where('status', $userStatus);
        }

        return $userQuery;
    }

    /**
     * Check if selected user is match shortlisted criteria.
     * if the user match one of this criteria below :
     *  - iMMAP Jobs: shortlisted and all the statuses after it except the rejected status.
     *  - iMMAP Roster: interview and all the statuses after it except the rejected status.
     *  - SBP Roster: 3 heads questions and all the statuses after it except the rejected status.
     */
    public function checkUserIsMatchingShortlistedCriteria(User $selectedUser)
    {
        $activeJobStatus = $this->getActiveJobStatus();

        // GET All Roster with it's active roster steps
        $allRosterOrders = $this->getActiveOnRosterRecruitmentWithStepOrder();

        $user = User::where('id', $selectedUser->id)
            ->where(function($query) use ($activeJobStatus, $allRosterOrders) {
                $query = $query->whereHas('job_user', function($subQuery) use ($activeJobStatus) {
                    return $subQuery->whereIn('job_status_id', $activeJobStatus);
                });

                if (!empty($allRosterOrders)) {
                    foreach($allRosterOrders as $rosterData) {
                        $query = $query->orWhereHas('profile.profile_roster_processes', function($subQuery) use ($rosterData) {
                            return $subQuery->where('roster_process_id', $rosterData['rosterData']->id)
                                    ->whereIn('current_step', $rosterData['activeStepsOrder']);
                        });
                    }
                }
            })->first();

        return !$user ? false : true;
    }
}
