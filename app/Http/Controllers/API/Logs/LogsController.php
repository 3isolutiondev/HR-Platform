<?php

namespace App\Http\Controllers\API\Logs;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;

class LogsController extends Controller {

    function index(Request $request) {

        // echo $request->input('page');exit();
        $page= !empty($request->input('page')) ? $request->input('page') :0;
        $searchText= $request->input('searchText');

        $client = new Client();
        $url = config('logservice.LogService_Base_Url')."/log?page=".$page."&searchText=".$searchText;

        $response = $client->request('GET', $url, ['headers' => [
                'AccessToken' => config('logservice.SECRET')
            ], [
                'query'=> ['page'=>$page, 'searchText'=>$searchText]
            ]
        ]);

        return json_decode($response->getBody(), true);

    }


}
