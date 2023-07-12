<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\JobStatus;
use App\Traits\iMMAPerTrait;
use App\Traits\UserStatusTrait;
use App\Models\Roster\RosterProcess;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\IdentifyActiveProfileMail;

class IdentifyActiveProfiles extends Command
{
    use iMMAPerTrait, UserStatusTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:track-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Determined profile status by checking profile activity';

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
        $checkingDate = new \DateTime('now');
        date_sub($checkingDate, date_interval_create_from_date_string('1 year'));
        date_add($checkingDate, date_interval_create_from_date_string('1 day'));

        $checkingDate = date_format($checkingDate, 'Y-m-d');

        $this->checkForInactive($checkingDate);
    }

    // Check user(s) status, change Active user(s) to Inactive user(s) is the user(s) match the criteria
    protected function checkForInactive(string $checkingDate) {
        $this->info('=============== Checking and Changing for Inactive User ===============');
        $activeUsersToCheck = $this->notPartOfIMMAPFromUserQuery(
            $this->getQueryForUserWhoAreNotShortlisted('Active')
            ->whereHas('profile', function($query) use ($checkingDate) {
                return $query->whereDate('profiles.updated_at', '<', $checkingDate)
                    ->where(function($subQuery) use ($checkingDate) {
                        return $subQuery->whereDate('profiles.last_apply_job', '<', $checkingDate)
                            ->orWhereNull('profiles.last_apply_job');
                    });
            }));

        $affectedUsers = $activeUsersToCheck->take(150)->get();
        $updatedUsers = $activeUsersToCheck->update(['status' => 'Inactive', 'inactive_date' => date('Y-m-d H:i:s')]);
        $this->info('========== Finished Checking and Changing for Inactive User! ==========');

        $this->line('============ Start sending script report to developer mail ============');
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new IdentifyActiveProfileMail($affectedUsers));
        $this->line('============ Script report has been sent to developer mail ============');
    }
}
