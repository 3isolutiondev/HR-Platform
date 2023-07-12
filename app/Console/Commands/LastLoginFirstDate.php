<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class LastLoginFirstDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'last-login:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deskripsi';

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
        $users = User::all();
        foreach($users as $user) {
            if (empty($user->last_login_at)) {
                $last_update = !empty($user->profile->updated_at) ? $user->profile->updated_at : '';

                if(!empty($last_update)) {
                    $user->timestamps = false;
                    $user->fill(['last_login_at' => $last_update])->save();
                    $user->timestamps = true;
                } else {
                    $user->timestamps = false;
                    $user->fill(['last_login_at' => $user->updated_at])->save();
                    $user->timestamps = true;
                }
            }
        }
    }
}
