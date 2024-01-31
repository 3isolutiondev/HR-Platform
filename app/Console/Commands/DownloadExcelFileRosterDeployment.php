<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Microsoft\Graph\Graph;
use App\TokenStore\TokenCache;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;

class DownloadExcelFileRosterDeployment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roster:download-roster-deployment-excel-file';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This script is to download Roster deployement excel file from 3iSolution Microsoft oneDrive daily';

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
        Log::info('Download deployment excel file Script run at ' . date('Y-m-d H:i:s'));

        $guzzle = new Client();
        $url = config('microsoft_graph.URL_ACCESS_TOKEN');
        /** GET ACCESS TOKEN USING USER CREDENTIALS */
        // $user_token = json_decode($guzzle->post($url, [
        //     'form_params' => [
        //         'grant_type' => 'password',
        //         'username' => env('IMMAP_USERNAME'),
        //         'password' => env('IMMAP_PASSWORD'),
        //         'client_id' => config('microsoft_graph.CLIENT_ID'),
        //         'client_secret' => config('microsoft_graph.CLIENT_SECRET'),
        //         'scope' => 'https://graph.microsoft.com/.default'
        //     ],
        // ])->getBody()->getContents());

        /** GET ACCESS TOKEN USING CLIENT CREDENTIALS (IMMAP CAREERS APPLICATION ON AZURE) */
        $user_token = json_decode($guzzle->post($url, [
            'form_params' => [
                'grant_type' => 'client_credentials',
                'client_id' => config('microsoft_graph.CLIENT_ID'),
                'client_secret' => config('microsoft_graph.CLIENT_SECRET'),
                'scope' => 'https://graph.microsoft.com/.default'
            ],
        ])->getBody()->getContents());
        $user_accessToken = $user_token->access_token;


        $graph = new Graph();
        $graph->setAccessToken($user_accessToken);

        $this->info("\nDownloading Roster deployment excel file...");

        /** SETUP SHARPOINT FILE URL */
        $sharepointURL = "/sites/". env("SURGE_FILE_SITE_ID"). "/drives/". env("SURGE_FILE_DRIVE_ID"). "/items/". env("SURGE_FILE_ITEM_ID"). "/content";

        /** Download to server via onedrive */
        // $root = $graph->createRequest("GET", "/me/drive/root:/Deployment_data/surge_matrix.xlsx:/content")
        //         ->download(storage_path("app/public/roster-files/surge_matrix.xlsx"));

        /** Download to server directly from surge excel file */
        $root = $graph->createRequest("GET", $sharepointURL)
                ->download(storage_path("app/public/roster-files/surge_matrix.xlsx"));

        Log::info('Finished ' . date('Y-m-d H:i:s'));
        $this->info("\nDone.");

        return true;
     }
}
