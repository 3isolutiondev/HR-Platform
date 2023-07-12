<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ChangeP11Data extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'p11:update-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command is about to change ths P11 data for all the users from 11 steps to 8 steps';

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
        Log::info('Check in reminder trips Script run at ' . date('Y-m-d H:i:s'));

        $users = User::select('id','p11Status','p11Completed')->whereNotNull('p11Status')->get();

        foreach ($users as $key => &$user) {
            $convertData = json_decode($user->p11Status, true);
            if (count($convertData) == 11) {
                if ($user->p11Completed == true) {
                    $user->p11Status = '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1}';
                } else {
                    $user->p11Status = '{"form1": 0, "form2": 0, "form3": 0, "form4": 0, "form5": 0, "form6": 0, "form7": 0, "form8": 0}';
                }

                $user->save();
            }
        }
        
        Log::info('Finished ' . date('Y-m-d H:i:s'));
    }
}
