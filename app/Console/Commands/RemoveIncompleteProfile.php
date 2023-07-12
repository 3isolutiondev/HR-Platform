<?php

namespace App\Console\Commands;

use Illuminate\Http\Request;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use App\Models\User;
use App\Http\Controllers\API\UserController;

class RemoveIncompleteProfile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remove-profile:incomplete-ondemand';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove incomplete profile based on list of emails';

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
        /**
         * Script Guideline
         */
        $this->comment('Before starting this script, make sure to put your email file inside storage/remove-profile-data folder.');
        $this->comment('The script only accept .csv and .json formats.');
        $this->comment('Please see our guide when creating the email file in Confluence.');
        /**
         * Asking about file upload confirmation
         */
        $fileUploadConfirmation = $this->ask('Have you uploaded your email file inside storage/remove-profile-data folder (Y/n)?');
        if ($fileUploadConfirmation == 'Y' || $fileUploadConfirmation == 'y') {
            /**
             * Asking file name uploaded inside storage/remove-profile-data folder
             */
            $filename = $this->ask('Please fill your email file name ?');

            $tempExtension = explode('.', $filename);
            $extension = end($tempExtension);

            $fullPath = base_path('/storage/remove-profile-data/'.$filename);

            $emailLists = [];

            /**
             * Return file type error if the file is not csv or json
             */
            if ($extension !== 'csv' && $extension !== 'json') {
                $this->error('Invalid file type, please put your file name with csv or json file extension');
                return false;
            }

            /**
             * Check if file exists or not
             */
            if (!file_exists($fullPath)) {
                $this->error('File not exists!');
                return false;
            }
            /**
             * Get list of emails on csv file
             */
            if ($extension == 'csv') {
                $emailLists = Arr::flatten(array_map('str_getcsv', file($fullPath)));
            }

            /**
             * Get list of emails on json file
             */
            if ($extension == 'json') {
                $emailLists = json_decode(file_get_contents($fullPath));
            }

            $emailListTotal = count($emailLists);

            /**
             * Start deletion process if email list is exists inside csv or json file
             */
            if ($emailListTotal > 0) {
                $userList = User::select('id', 'email')->whereIn('email', $emailLists)->where('p11Completed', 0)->get();
                $totalUserInDb = count($userList);

                /**
                 * Check if user exists in Database before starting deletion process
                 */
                if ($totalUserInDb > 0) {
                    $this->info('Found '. $totalUserInDb . ' incomplete user(s) in database from '. $emailListTotal . ' email(s) detected from the file');
                    $bar = $this->output->createProgressBar($totalUserInDb);
                    $bar->start();

                    $deleteFails = [];
                    foreach($userList as $user) {
                        $request = new Request();
                        $request['notifyEmail'] = false;
                        $userController = new UserController();
                        $response = $userController->destroy($request, $user->id, false);
                        $responseBody = $response->getData();

                        if ($responseBody->status !== 'success') {
                            array_push($deleteFails, $user->email);
                        }

                        $bar->advance();
                    }

                    if (count($deleteFails) > 0) {
                        $bar->finish();
                        echo PHP_EOL . PHP_EOL;

                        $this->error('This is the list of failed deletion Ids:');
                        dump($deleteFails);

                        return false;
                    }

                    $bar->finish();
                    echo PHP_EOL . PHP_EOL;

                    $this->comment('Delete profile success!');
                    return true;
                }

                $this->error('User not found!!');

                return false;
            }

            /**
             * Warning for no email inside the file
             */
            $this->error('No email detected inside the file, Please see our guide in Confluence');
            return false;
        }

        $this->comment("Please upload your email file first, see our guide in Confluence");

        return false;
    }
}
