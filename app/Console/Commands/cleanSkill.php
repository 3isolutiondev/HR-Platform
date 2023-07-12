<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use App\Models\Skill;
use App\Models\P11\P11Skill;
use App\Models\P11\P11EmploymentRecordSkill;
use App\Models\P11\P11PortfolioSkill;
use App\Traits\UserTrait;
use App\Imports\SkillImport;
use Excel;

class CleanSkill extends Command
{
    use UserTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'skill:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleaning skills';

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
        Log::info('Cleaning skills script run at ' . date('Y-m-d H:i:s'));
        $this->info("Cleaning skills started...");

        Excel::import(new SkillImport, storage_path('imports/skills.xlsx'));
        
        $this->info("Cleaning skills ended...");
        Log::info('Cleaning skills script ends at ' . date('Y-m-d H:i:s'));
    }
}
