<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Traits\UserTrait;

class CleaningFullname extends Command
{
    use UserTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:cleaning-fullname';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleaning full name script';

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
        Log::info('Cleaning fullname script run at ' . date('Y-m-d H:i:s'));
        $this->info("Cleaning fullname started...");
        $users = User::whereColumn('first_name','family_name')->whereColumn('family_name','middle_name')->get();

        foreach($users as $key => $user) {
            $combineName = $user->first_name.' '.$user->middle_name.' '.$user->family_name;
            if ($combineName == $user->full_name) {
                $user->full_name = $user->first_name;
                $user->save();
            }
        }

        $this->info("Done!");
        Log::info('Done! Cleaning fullname script stopped at ' . date('Y-m-d H:i:s'));
    }
}
