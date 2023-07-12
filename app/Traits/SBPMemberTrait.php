<?php

namespace App\Traits;

use App\Models\User;
use App\Models\Profile;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\Roster\RosterProcess;

/**
 * This is the file containing function to be used in any controller to check a user(s) is accepted sbp roster member or not
 */
trait SBPMemberTrait {

    /**
     * ======================== isAcceptedSbpRosterMemberFromSelectedUser Function ==========================
     * This is a function to check if a selected user is accepted as sbp roster member or not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function isAcceptedSbpRosterMemberFromSelectedUser(User $user)
    {
    
        $acceptedRosterApplicationData =ProfileRosterProcess::select('id')->where('profile_id', $user->profile->id)->where('is_completed', 1)->first();

        if (empty($acceptedRosterApplicationData)) {
            return false;
        }
        
        return true;
    }


    /**
     * ======================== getAcceptedSbpRosterMember Function ==========================
     * This is a function to get accepted sbp roster member
     * ====================================================================================
     */
    public function getAcceptedSbpRosterMember($skillset = NULL)
    {
        if (empty($skillset) || is_null($skillset)) {
            return null;
        }

        $sbpRosterProcess = RosterProcess::where('under_sbp_program', "yes")->where('skillset', $skillset)->first();

        if (!$sbpRosterProcess) {
            return null;
        }

        $member = User::whereHas('profile.profile_roster_processes', function($query) use ($sbpRosterProcess) {
            $query->where('profile_roster_processes.roster_process_id', $sbpRosterProcess->id)->where('is_completed', 1);
        })->get();

        return $member;
    }

    /**
     * ======================== getSbpRosterProcessData Function ==========================
     * This is a function to get roster process data under sbp program
     * ====================================================================================
     */
    public function getSbpRosterProcessData($skillset = NULL)
    {
        if (empty($skillset) || is_null($skillset)) {
            return null;
        }

        $sbpRosterProcess = RosterProcess::where('under_sbp_program', "yes")->where('skillset', $skillset)->first();

        if (!$sbpRosterProcess) {
            return null;
        }

        return $sbpRosterProcess;
    }
}
