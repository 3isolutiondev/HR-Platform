<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Profile;

class copyIMMAPEmailInUsersTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:immap-email-users-table';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Copy all immap email from profiles table to users table';

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
        $immapEmails = User::join('profiles', 'users.id', '=', 'profiles.user_id')->select('profiles.id AS prof_id', 'profiles.immap_email AS prof_immap_email', 'users.immap_email AS user_immap_email', 'user_id')->where('profiles.immap_email', '<>', '')->whereNotNull('profiles.immap_email')->whereNull('users.immap_email')->where('p11Completed', 1)->get();
        foreach($immapEmails as $immapEmail) {
            if (User::where('immap_email', $immapEmail->prof_immap_email)->doesntExist()) {
                User::where('id', $immapEmail->user_id)->update(['immap_email' => $immapEmail->prof_immap_email]);
            }
        }
    }
}
