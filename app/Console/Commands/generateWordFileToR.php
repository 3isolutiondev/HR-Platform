<?php

namespace App\Console\Commands;

use App\Http\Controllers\API\HR\HRToRController;
use App\Models\HR\HRToR;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class generateWordFileToR extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:old-word-file-ToR';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This script will generate a Word file for all old ToR.';

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
        Log::info('Generating Word file ToR Script run at ' . date('Y-m-d H:i:s'));
        $this->info("Generating Word file ToR");
        
        $tors = HRToR::all();
        $generator = new HRToRController();

        foreach ($tors as $tor) {

            $pdfs = $tor->getMedia('tor_pdf');
            $words = $tor->getMedia('tor_word');
    
            if (!empty($pdfs)) {
                if (count($pdfs)) {
                    foreach($pdfs as $pdf){
                        $pdf->delete();
                    }
                }
            }
    
            if (!empty($words)) {
                if (count($words)) {
                    foreach($words as $word){
                        $word->delete();
                    }
                }
            }

            $generator->torPdf($tor->id);
            $generator->torWord($tor->id);
        }

        Log::info('Finished ' . date('Y-m-d H:i:s'));
        $this->info("Done");

        return true;
    }
}
