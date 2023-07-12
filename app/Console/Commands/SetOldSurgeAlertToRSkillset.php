<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use App\Models\HR\HRToR;

class SetOldSurgeAlertToRSkillset extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tor:set-default-skillset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set old Surge Alert ToR skillset to IM';

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
        // Get the Surge Alert ToR that the skillset is not define
        Log::info('>>> Start finding the old surge alert tor...');
        $this->info('>>> Start finding the old surge alert tor...');
        $surgeAlertTor = HRToR::select("id")->whereNull('skillset')->whereHas('job_standard', function($query) {
            $query->where('hr_job_standards.under_sbp_program', "yes");
        })->get();

        // check if the ToR is exist or not
        if ($surgeAlertTor->count() > 0) {
            $surgeAlertTor = $surgeAlertTor->pluck('id')->toArray();

            try {
                $surgeAlertTorUpdated = HRToR::whereIn('id', $surgeAlertTor)->update([
                    'skillset' => 'IM'
                ]);
                Log::info("[Success] This is the affected tor ids: " . implode(", ", $surgeAlertTor));
                Log::info(">>> Finished!");
                $this->info('>>> Finished!');
                return true;
            } catch (QueryException $e) {

                Log::error("Script to set old Surge Alert ToR skillset has been failed");
                Log::error("This is the affected tor ids: " . implode(", ", $surgeAlertTor));
                $this->error('>>> Finished! There is an error while updating the old surge alert tor, please see the log to see about the details.');
                return false;
            }
        }

        // ToR is not exist
        Log::info(">>> Finished! There are no old surge alert tor found.");
        $this->info('>>> Finished! No old surge alert tor found.');
        return false;
    }
}
