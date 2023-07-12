<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\IncompleteProfileReminder as IncompleteProfileReminderMail;
use App\Mail\IncompleteProfileReminderReport;

class IncompleteProfileReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remove-profile:incomplete-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remind incomplete profile to submit his/her profile in the 31st day after their registration';

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
        if (env('ENABLED_INCOMPLETE_PROFILE_SCRIPT') == true || env('ENABLED_INCOMPLETE_PROFILE_SCRIPT') == 'true') {
            $reminderDate = date('Y-m-d', strtotime('- 31 day'));
            $incompleteUsers = User::select('id', 'email', 'full_name')->whereDate('created_at', $reminderDate)->where('p11Completed', 0)->get();

            $successfullyRemindedUser = [];
            foreach($incompleteUsers as $key => $incompleteUser) {
                Mail::to($incompleteUser->email)->send(new IncompleteProfileReminderMail($incompleteUser->full_name));
                array_push($successfullyRemindedUser, $incompleteUser);
                sleep(3);
            }

            if (!empty($successfullyRemindedUser)) {
                Mail::to(env('SCRIPT_MAIL_TO'))->send(new IncompleteProfileReminderReport($successfullyRemindedUser));
            }

            return true;
        }

        return false;
    }
}
