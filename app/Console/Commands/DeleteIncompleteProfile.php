<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Http\Controllers\API\UserController;
use App\Mail\DeleteIncompleteProfileReport;
use App\Mail\ErrorDeleteIncompleteProfileReport;

class DeleteIncompleteProfile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remove-profile:incomplete-delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove incomplete profile after 60 days';

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
            $deletionDate = date('Y-m-d', strtotime('- 61 day'));
            $users = User::select('id','email', 'full_name')->where('p11Completed', 0)->where('access_platform', 1)->whereDate('created_at', $deletionDate)->get();

            $deleteUserFailed = [];
            $deletedUsers = [];
            foreach($users as $user) {
                $request = new Request();
                $request['notifyEmail'] = true;
                $userController = new UserController();
                $response = $userController->destroy($request, $user->id, false);
                $responseBody = $response->getData();

                if ($responseBody->status !== 'success') {
                    array_push($deleteUserFailed, $user);
                } else {
                    array_push($deletedUsers, $user);
                }
                sleep(3);
            }

            if (count($deleteUserFailed) > 0) {
                Mail::to(env('SCRIPT_MAIL_TO'))->send(new ErrorDeleteIncompleteProfileReport($deleteUserFailed));

                return false;
            }

            Mail::to(env('SCRIPT_MAIL_TO'))->send(new DeleteIncompleteProfileReport($deletedUsers));

            return true;
        }

        return false;
    }
}
