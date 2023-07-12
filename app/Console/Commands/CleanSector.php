<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use App\Models\Sector;
use App\Models\P11\P11Sector;
use App\Traits\UserTrait;
use App\Imports\SectorImport;
use Excel;

class CleanSector extends Command
{
    use UserTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sector:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleaning sectors';

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
        Log::info('Cleaning sectors script run at ' . date('Y-m-d H:i:s'));
        $this->info("Cleaning sectors started...");

        Excel::import(new SectorImport, storage_path('imports/sectors.xlsx'));
        
        $this->info("Cleaning sectors ended...");
        Log::info('Cleaning sectors script ends at ' . date('Y-m-d H:i:s'));
    }
}