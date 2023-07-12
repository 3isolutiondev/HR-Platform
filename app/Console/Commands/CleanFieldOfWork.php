<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use App\Models\FieldOfWork;
use App\Models\P11\P11FieldOfWork;
use App\Traits\UserTrait;
use App\Imports\FieldOfWorkImport;
use Excel;

class CleanFieldOfWork extends Command
{
    use UserTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fieldOfWork:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleaning fieldOfWorks';

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
        Log::info('Cleaning fieldOfWorks script run at ' . date('Y-m-d H:i:s'));
        $this->info("Cleaning fieldOfWorks started...");

        Excel::import(new FieldOfWorkImport, storage_path('imports/area_of_expertise.xlsx'));
        
        $this->info("Cleaning fieldOfWorks ended...");
        Log::info('Cleaning fieldOfWorks script ends at ' . date('Y-m-d H:i:s'));
    }
}