<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class repairRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'repair:role';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $users = User::doesntHave('roles')->get();
        foreach($users as $user) {
            $user->assignRole('User');
        }
        // dd($users);
    }
}
