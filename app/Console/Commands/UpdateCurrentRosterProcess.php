<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Roster\ProfileRosterProcess;

class UpdateCurrentRosterProcess extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'current-roster-process:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Current Process to 1';

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
        $profile_roster_process = ProfileRosterProcess::where('is_completed', 0)->where('is_rejected', 0)->update(['set_as_current_process' => 1]);
    }
}
