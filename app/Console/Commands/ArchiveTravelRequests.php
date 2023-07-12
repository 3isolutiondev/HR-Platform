<?php

namespace App\Console\Commands;

use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\TARRequest;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ArchiveTravelRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trip:archive';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive all the travel requests which are older than 3 months';

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
        $this->info('Archive all the travel requests which are older than 3 months');
        Log::info('Check in reminder trips Script run at ' . date('Y-m-d H:i:s'));

        $date = Carbon::now()->subMonths(3)->format('Y-m-d');

        $this->info("\n Archiving travel request...");

        $tar = TARRequest::where('submitted_date', '<', $date)->update(['is_archived' => true]);
        $mrf = MRFRequest::where('submitted_date', '<', $date)->update(['is_archived' => true]);

        $this->info("\nDone.");
        Log::info('Finished ' . date('Y-m-d H:i:s'));

        return true;
    }
}
