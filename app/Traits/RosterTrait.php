<?php

namespace App\Traits;

use Illuminate\Support\Arr;
use App\Models\Roster\ProfileRosterProcess;

trait RosterTrait {

    // PLEASE ADD DOCUMENTATION LATER
    public function rosterSkillsetValidationRule(): string
    {
        $rules = "required|string|in:" . implode(',', Arr::pluck(config('roster.SBP_ROSTER_SKILLSET'), 'value'));
        return $rules;
    }

    // PLEASE ADD DOCUMENTATION LATER
    public function isEligibleToApplyRoster(int $profileID, string $skillset): bool
    {
        $activeRosterProcess = ProfileRosterProcess::where('profile_id', $profileID)
                ->where('is_rejected', 0)
                ->whereHas('roster_process', function($query) use ($skillset) {
                    $query->where('under_sbp_program', 'yes')->where('skillset', $skillset);
                })->get();

        if ($activeRosterProcess->count() == 0) {
            return true;
        }

        return false;
    }
}
