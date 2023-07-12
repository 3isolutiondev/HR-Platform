<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;

class fixRosterBugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roster-bugs:fix';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixing roster bugs for Musa Abubakar, James William Whitaker, Filip Hilgert, Hermann Pascal Andriamanambina, Mustapha Muhammad Ebenehi, Joshua Oluwakorede Atuge';

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
        $user_ids = [
            // 378,
            484,
            552,
            823,
            919,
            1022
            // 1022,
        ];
        foreach($user_ids as $user_id) {
            $profile = Profile::where('user_id', $user_id)->first();
            $profile->fill(['become_roster' => 1])->save();
            $profile->roster_processes()->attach([5]);
        }
    }
}
