<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\Roster\RosterProcess;
use App\Models\Roster\RosterStep;
use DB;

class fixRosterHistoricalData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roster:fixHistory';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix duplicate active data on roster application (people applied twice and the first rejected being moved by manager to active again)';

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
        // Get All Roster Process
        $rosterProcesses = RosterProcess::all();
        foreach($rosterProcesses as $rosterProcess) {
            // Get rejected step for each process
            $rosterRejectedStep = RosterStep::where('roster_process_id', $rosterProcess->id)->where('set_rejected', 1)->first();

            // Set condition for searching duplicate active application
            $whereRaw = "profile_id IN (SELECT `profile_id` FROM `profile_roster_processes`  WHERE `roster_process_id` = ". $rosterProcess->id ." AND `set_as_current_process` = 1 GROUP BY `profile_id` HAVING COUNT(*) > 1)";

            // Run query to get profile that has duplicate active application
            $searchDuplicates = ProfileRosterProcess::select('profile_id')
                                ->where('roster_process_id', $rosterProcess->id)
                                ->whereRaw($whereRaw)->distinct('profile_id')->get();

            // Check if duplicate application is exist
            if ($searchDuplicates->count()) {
                foreach($searchDuplicates as $record) {
                    // Check if the profile already accepted as roster member in this roster process
                    $alreadyAccepted = ProfileRosterProcess::where('roster_process_id', $rosterProcess->id)
                                        ->where('profile_id', $record->profile_id)
                                        ->where('is_completed', 1)->get();

                    // Setup query to update the old roster application to rejected
                    $query = ProfileRosterProcess::where('roster_process_id', $rosterProcess->id)
                                ->where('profile_id', $record->profile_id)
                                ->where('set_as_current_process', 1);

                    // Check if the profile is not accepted yet
                    if ($alreadyAccepted->isEmpty()) {
                        // Get the latest roster application (exclude the latest application, hold the latest application as active application
                        $latestApplication = ProfileRosterProcess::where('profile_id', $record->profile_id)
                                                ->where('roster_process_id', $rosterProcess->id)
                                                ->where('set_as_current_process', 1)->max('id');

                        // Check if latest roster application is not empty
                        if (!empty($latestApplication)) {
                            // Update the query based on latest application result
                            $query = $query->where('id', '<>', $latestApplication);
                        }
                    }

                    // Run the query to update old application to rejected step / state
                    $updated = $query->update([
                                    'set_as_current_process' => 0,
                                    'current_step' => $rosterRejectedStep->order,
                                    'is_completed' => 0,
                                    'is_rejected' => 1
                                ]);
                }
            }
        }
    }
}
