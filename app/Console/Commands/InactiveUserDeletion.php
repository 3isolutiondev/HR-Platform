<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Http\Controllers\API\UserController;
use App\Mail\InactiveUserDeletionErrorReportMail;
use App\Mail\InactiveUserDeletionReportMail;

class InactiveUserDeletion extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:inactive-delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete Inactive Profile';

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
        $checkDate = date('Y-m-d', strtotime('- 30 day')).' 00:00:00';
        $users = User::select('id','email', 'full_name')
                    ->where('status', 'Inactive')
                    ->whereNotNull('inactive_date')
                    ->whereNotNull('inactive_user_has_been_reminded_date')
                    ->where('inactive_date', '<', $checkDate)
                    ->where('inactive_user_has_been_reminded_date', '<', $checkDate)
                    ->where('inactive_user_has_been_reminded', 'true')
                    ->take(150)
                    ->get();

        $this->info("\nDeleting inactive users...");
        $progressBar = $this->output->createProgressBar(count($users));
        $progressBar->start();

        $deleteUserFailed = [];
        $deletedUsers = [];

        foreach($users as $user) {
            $request = new Request();
            $request['notifyEmail'] = true;
            $userController = new UserController();
            $response = $userController->destroy($request, $user->id, false);
            $responseBody = $response->getData();

            if ($responseBody->status === 'success') {
                array_push($deletedUsers, $user);
            } else {
                array_push($deleteUserFailed, $user);
            }

            $progressBar->advance();

            sleep(3);
        }

        $progressBar->finish();

        $this->info("\nDone.");

        if (count($deleteUserFailed) > 0) {
            $this->info("\nStart sending error report email to developer...");
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new InactiveUserDeletionErrorReportMail($deleteUserFailed));
            $this->info("\nDone.");

            return false;
        }

        $this->info("\nStart sending report email to developer...");
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new InactiveUserDeletionReportMail($deletedUsers));
        $this->info("\nDone.");

        return true;
    }
}
