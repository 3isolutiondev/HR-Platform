<?php

namespace App\Http\Controllers\API\HR;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;

class HRRequirementController extends Controller {

    /**
     * @SWG\GET(
     *   path="/api/hr-requirements/all-options",
     *   tags={"Job Category Requirement"},
     *   summary="List of Requirements Component and Data used in Job Category Form [{value: 1, label: Skill} format]",
     *   description="File: app\Http\Controllers\API\HRRequirementController@allOptions, Permission: Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function allOptions()
    {
        $options = [];
        foreach(config('hr.requirements') as $key => &$option) {
            array_push($options, ['value' => $key, 'label' => ucwords(str_replace("_"," ",$key))]);
        }

        return response()->success(trans('crud.success.default'), $options);
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-requirements/get-component/{value}",
     *   tags={"Job Category Requirement"},
     *   summary="get specific requirement component and data",
     *   description="File: app\Http\Controllers\API\HRRequirementController@getComponent, Permission: Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="value", in="path", required=true, type="string", enum={"skill", "sector", "language", "degree_level"})
     * )
     *
     */
    public function getComponent($value)
    {
        return response()->success(trans('crud.success.default'), config('hr.requirements.'.$value.'.component'));
    }
}
