<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\InactiveUserReminderMail;
use App\Mail\InactiveUserReminderReportMail;

class InactiveUserReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:inactive-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remind Inactive profile to update the profile';

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
        $inactiveUsers = User::select('id','email','full_name','inactive_date')
                            ->where('status', 'Inactive')
                            ->where('inactive_user_has_been_reminded', 'false')
                            ->whereNotNull('inactive_date')
                            ->orderBy('inactive_date', 'asc')
                            ->take(150)
                            ->get();

        $this->info("\nSending email(s) reminder for inactive users...");
        $progressBar = $this->output->createProgressBar(count($inactiveUsers));
        $progressBar->start();

        $successfullyRemindedUser = [];


        foreach($inactiveUsers as $inactiveUser) {
            Mail::to($inactiveUser->email)->send(new InactiveUserReminderMail($inactiveUser->full_name));
            array_push($successfullyRemindedUser, $inactiveUser);
            $inactiveUser->inactive_user_has_been_reminded = 'true';
            $inactiveUser->inactive_user_has_been_reminded_date = date('Y-m-d H:i:s');
            $inactiveUser->save();

            $progressBar->advance();

            sleep(3);
        }

        $progressBar->finish();

        $this->info("\nDone.");

        $this->info("\nStart sending report email to developer...");
        if (!empty($successfullyRemindedUser)) {
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new InactiveUserReminderReportMail($successfullyRemindedUser));
        }
        $this->info("\nDone.");
    }
}
