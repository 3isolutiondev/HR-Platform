<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JobUser;

class CheckMissingSurgeAlertAvailability extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:missing-surge-alert-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check missing surge alert recruitment date';

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
        $missingData = JobUser::whereNull('start_date_availability')->whereNull('departing_from')
                        ->whereHas('job.tor.job_standard', function($query) {
                            $query->where('under_sbp_program', 'yes');
                        })->get();
        $this->info("Missing Data: ". $missingData->count());
    }
}
