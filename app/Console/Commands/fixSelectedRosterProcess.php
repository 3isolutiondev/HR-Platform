<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Profile;

class fixSelectedRosterProcess extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix-selected-roster-process:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix Default Selected Roster Process';

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
        $users = User::doesntHave('profile')->get();
        foreach ($users as $user) {
            $profileData = [
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'family_name' => $user->family_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'user_id' => $user->id,
                'selected_roster_process' => json_encode([])
            ];
            // dump($user->full_name);
            $profile = Profile::create($profileData);
        }

        // dd(count($users));
    }
}
