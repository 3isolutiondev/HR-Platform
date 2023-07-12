<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TimezoneController extends Controller
{
    /**
     * @SWG\Get(
    *   path="/api/timezones/all-options",
     *   tags={"Timezone"},
     *   summary="Get list of all timezone",
     *   description="File: app\Http\Controllers\API\TimezoneController@getTimezoneOptions",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function getTimezoneOptions() {
        $config_timezones = config('timezone');
        $timezones = [];
        foreach($config_timezones as & $timezone) {
            array_push($timezones, ["value" => $timezone, "label" => $timezone]);
        }

        return response()->success(__('crud.success.default'), $timezones);
    }
}
