<?php

namespace App\Http\Controllers\API\SecurityModule;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BasicDataController extends Controller
{
    /**
     * @SWG\Get(
     *   path="/api/security-module/travel-purposes/all-options",
     *   tags={"Security Module"},
     *   summary="Get All Travel Purpose Data with {value: leave, label: Leave} format",
     *   description="File: app\Http\Controllers\API\BasicDataController@travelPurposeOptions, Permission: Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function travelPurposeOptions()
    {
        return response()->success(__('crud.success.default'), config('securitymodule.travelPurposes'));
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/critical-movements/all-options",
     *   tags={"Security Module"},
     *   summary="Get All Critical Movement Data with {value: routine, label: Routine} format",
     *   description="File: app\Http\Controllers\API\BasicDataController@criticalMovementOptions, Permission: Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function criticalMovementOptions() {
        return response()->success(__('crud.success.default'), config('securitymodule.criticalMovements'));
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/movement-states/all-options",
     *   tags={"Security Module"},
     *   summary="Get All Movement State Data with {value: essential, label: Essential} format",
     *   description="File: app\Http\Controllers\API\BasicDataController@movementStateOptions, Permission: Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function movementStateOptions() {
        return response()->success(__('crud.success.default'), config('securitymodule.movementStates'));
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/security-measures/all-options",
     *   tags={"Security Module"},
     *   summary="Get All Security Measure Data with {value: single-vehicle-movement, label: Single Vehicle Movement} format",
     *   description="File: app\Http\Controllers\API\BasicDataController@securityMeasureOptions, Permission: Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function securityMeasureOptions() {
        return response()->success(__('crud.success.default'), config('securitymodule.securityMeasures'));
    }
}
