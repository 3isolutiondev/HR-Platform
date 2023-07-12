<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use App\Models\Job;
use App\Models\JobUser;

class SetApplyAlertData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:surge-alert-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix surge alert data from log database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**(
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info("Please run: php artisan check:missing-surge-alert-data to know how many surge alert data is missing");
        $runScript = $this->ask("Have you run the script mentions above (y/n)?");
        if (strtolower($runScript) == "y") {
            return $this->processFile();
        }
        return false;
    }

    /**
     * askFileName is a function to ask filename
     */
    function askFileName() {
        $fileName = $this->ask('Filename of your csv file inside [storage/app/csv-from-log-db] folder (Please upload it in the correct format)?');

        if (empty($fileName)) {
            $this->error("Please fill the filename of your csv");
            return $this->askFileName();
        }

        if (substr($fileName, -4) !== ".csv") {
            $this->info(substr($fileName, -4));
            $this->error("Please fill the filename with .csv extension");
            return $this->askFileName();
        }

        return $fileName;
    }

    /**
     * checkFile is a function to get file path
     */
    function checkFile() {
        $filename = $this->askFileName();
        $filePath = storage_path("app/csv-from-log-db/$filename");

        return $filePath;
    }

    /**
     * processFile is a function to process the file
     */
    function processFile() {
        $filePath = $this->checkFile();

        if (file_exists($filePath)) {
            Log::info("Start processing csv file in this path: $filePath");

            $this->info("Start updating...");
            $csvFile = fopen($filePath, "r");
            $firstline = true;

            $totalSurgeData = 0;
            $updatedSurgeData = 0;
            $failedData = [];
            while (($data = fgetcsv($csvFile, 2000, ",")) !== FALSE) {
                if (!$firstline) {
                    $totalSurgeData = $totalSurgeData + 1;
                    try {
                        $surgeUpdateData = JobUser::whereNull('start_date_availability')
                                        ->whereNull('departing_from')
                                        ->where('user_id', $data[0])
                                        ->where('job_id', $data[1])
                                        ->update([
                                            'start_date_availability' => $data[2],
                                            'departing_from' => $data[3]
                                        ]);
                        if ($surgeUpdateData) {
                            $updatedSurgeData = $updatedSurgeData + 1;
                        } else {
                            array_push($failedData, "user_id: $data[0], job_id: $data[1], start_date_availability: $data[2], departing_from: $data[3]");
                        }
                    } catch (QueryException $e) {
                        array_push($failedData, "user_id: $data[0], job_id: $data[1], start_date_availability: $data[2], departing_from: $data[3]");
                    }
                }
                $firstline = false;
            }

            fclose($csvFile);

            Log::info("Finished!");
            $this->info("Finished!");

            Log::info("Total surge alert data need to be imported: $totalSurgeData");
            $this->info("Total surge alert data need to be imported: $totalSurgeData");

            Log::info("Successfully updated surge alert data: $updatedSurgeData");
            $this->info("Successfully updated surge alert data: $updatedSurgeData");

            if (count($failedData)) {
                $failedDataText = implode(",\n", $failedData);
                Log::error("Surge alert data failed to be imported: \n");
                Log::error($failedDataText);
                $this->error("Some data is not updated please see the log for the details");
            }

            return true;
        } else {
            $this->error("File is not exist on the [storage/app/csv-from-log-db] folder");
            $retry = $this->ask("Retry the script (y/n)?");

            if (strtolower($retry) == "y") {
                return $this->processFile();
            }

            $this->info("Bye!");
            return false;
        }
    }
}
