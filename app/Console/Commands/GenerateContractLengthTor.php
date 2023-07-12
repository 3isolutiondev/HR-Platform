<?php

namespace App\Console\Commands;

use App\Models\HR\HRToR;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateContractLengthTor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tor:contract-generate-length';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command is for generating conctract length for existing ToRs';

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
        Log::info('Generating contract length ToR Script run at ' . date('Y-m-d H:i:s'));
        $this->info("Generating contract length ToR");

        $tors = HRToR::where('contract_length', 0)->get();

        foreach($tors as $tor) {
            $contractStart = Carbon::createMidnightDate($tor->contract_start);
            $contractEnd = Carbon::createMidnightDate($tor->contract_end);
            
            $months = $contractStart->diffInMonths($contractEnd);

            $tor->contract_length = $months;
            $tor->save();
        }

        Log::info('Finished ' . date('Y-m-d H:i:s'));
        $this->info("Done");

        return true;
    }
}
