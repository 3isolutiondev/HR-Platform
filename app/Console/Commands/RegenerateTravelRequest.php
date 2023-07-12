<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SecurityModule\TARRequest;
use App\Models\SecurityModule\MRFRequest;
use App\Http\Controllers\API\SecurityModule\TARRequestController;
use App\Http\Controllers\API\SecurityModule\MRFRequestController;

class RegenerateTravelRequest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'travel:generatepdf';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate Travel Request Report';

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
        $travelType = $this->askTravelType();
        $travelId = $this->askTravelId($travelType);

        if ($travelType == 'int') {
            if (TARRequest::where('id', $travelId)->doesntExist()) {
                echo 'International Travel (TAR) is not found, please re run the script ', PHP_EOL;
                return false;
            }

            $tar = (new TARRequestController)->createPDF($travelId, true);
            if ($tar) {
                echo 'Generate PDF success', PHP_EOL;
                return true;
            }
        }

        if ($travelType == 'dom') {
            if (MRFRequest::where('id', $travelId)->doesntExist()) {
                echo 'Domestic Travel (MRF) is not found, please re run the script ', PHP_EOL;
                return false;
            }

            $mrf = (new MRFRequestController)->createPDF($travelId, true);
            if ($mrf) {
                echo 'Generate PDF success', PHP_EOL;
                return true;
            }
        }

        echo 'Not Found';
        return false;
    }

    public function askTravelType()
    {
        $travelType = $this->ask('Travel Type [int / dom] ?');
        if ($travelType !== 'int' && $travelType !== 'dom') {
            echo 'Invalid value, please put int / dom', PHP_EOL;
            return $this->askTravelType();
        }

        return $travelType;
    }

    public function askTravelId()
    {
        $travelId = $this->ask('Travel ID (integer) ?');
        if (!is_numeric($travelId)) {
            echo 'Invalid value, please put integer value ', PHP_EOL;
            return $this->askTravelId();
        }

        return $travelId;
    }
}
