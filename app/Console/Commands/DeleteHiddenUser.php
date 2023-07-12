<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\DeleteHiddenUserReportMail;
use App\Mail\DeleteHiddenUserErrorReportMail;
use App\Models\User;
use App\Http\Controllers\API\UserController;


class DeleteHiddenUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:hidden-delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete hidden profile after retention period';

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
        $this->info("Start Deleting Hidden User(s)...");
        $hiddenUsers = User::where('status', 'Hidden')
                        ->whereMonth('schedule_deletion_date', date('m'))
                        ->whereYear('schedule_deletion_date', date('Y'))
                        ->get();

        $progressBar = $this->output->createProgressBar($hiddenUsers->count());
        $progressBar->start();

        $deleteUserFailed = [];
        $deletedUsers = [];

        foreach($hiddenUsers as $user) {
            $request = new Request();
            $request['notifyEmail'] = false;
            $userController = new UserController();
            $response = $userController->destroy($request, $user->id, false);
            $responseBody = $response->getData();

            if ($responseBody->status === 'success') {
                array_push($deletedUsers, $user);
            } else {
                array_push($deleteUserFailed, $user);
            }

            $progressBar->advance();
        }

        $progressBar->finish();

        $this->info("\nDone. \n");

        if (count($deleteUserFailed) > 0) {
            $this->info("Sending error report email to developer...");
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new DeleteHiddenUserErrorReportMail($deleteUserFailed));
            $this->info("Done.");

            return false;
        }

        $this->info("Sending script report email to developer...");
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new DeleteHiddenUserReportMail($deletedUsers));
        $this->info("Done.");
    }
}
