<?php

namespace App\Console\Commands;

use App\Models\Roster\RosterProcess;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;


class SetAllRosterRecruitmentCampaignsClosed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roster:close-campaign';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set all roster recruitment campaigns to close state';

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
        Log::info('Set all roster recruitment campaigns into close state Script run at ' . date('Y-m-d H:i:s'));

        RosterProcess::where('campaign_is_open', 'yes')->update(['campaign_is_open' => 'no']);

        Log::info('Finished ' . date('Y-m-d H:i:s'));
        
    }
}
