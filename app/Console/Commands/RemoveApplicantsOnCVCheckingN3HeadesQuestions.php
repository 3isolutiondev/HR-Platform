<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Roster\RosterProcess;
use App\Models\Roster\ProfileRosterProcess;

class RemoveApplicantsOnCVCheckingN3HeadesQuestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'surge-roster:empty-the-first-2-steps';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command is developed to removed surge/sbp roster applicants in CV Checking and 3 Heads Questions (the first two steps)';

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
        Log::info("Remove Applicants On CV Checking and 3 Heads Questions Script Started...");
        $this->info("Remove Applicants On CV Checking and 3 Heads Questions Script Started...\n");

        $confirmation = $this->askConfirmation();

        if ($confirmation == 'n') {
            Log::info("Script Stopped! Reason: User Cancelled\n");
            $this->info("Good bye!");
            return false;
        }

        $sbpRoster = RosterProcess::where('under_sbp_program', 'yes')->first();
        $first2steps = $sbpRoster->roster_steps()->limit(2)->get();

        if ($first2steps->count() !== 2) {
            Log::info("Script Stopped! Reason: Invalid Count of the first 2 steps\n");
            $this->info("Script Stopped! The system cannot detect the first 2 steps");
            return false;
        }

        $first2steps = $first2steps->pluck('order')->all();

        $result = ProfileRosterProcess::where('roster_process_id', $sbpRoster->id)->whereIn('current_step', $first2steps)->delete();

        if (!is_int($result)) {
            Log::info("Script Stopped! Reason: Delete Query not returning integer value\n");
            $this->info("Script Stopped! There is an error while deleting the applicant data, Please contact the developer");
            return false;
        }

        if ($result < 0) {
            Log::info("Script Stopped! Reason: Delete Query not returning positive integer value\n");
            $this->info("Script Stopped! There is an error while deleting the applicant data, Please contact the developer");
            return false;
        }

        Log::info("Script Run Successfully. Total applicant data removed: $result \n");
        $this->info("Script run successfully. Total applicant data removed: $result");
        return true;
    }

    function askConfirmation() {
        $confirmation = $this->ask('Are you sure you want to remove all applicants data on CV Checking and 3 Heads Questions Step from Surge Roster Member Recruitment [y / n] ?');
        if ($confirmation !== 'y' && $confirmation !== 'Y' && $confirmation !== 'n' && $confirmation !== 'N') {
            $this->info("Invalid confirmation value, please put y/n \n");
            return $this->askConfirmation();
        }

        return strtolower($confirmation);
    }
}
