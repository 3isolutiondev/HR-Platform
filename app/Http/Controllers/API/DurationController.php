<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class DurationController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Duration';
    const SINGULAR = 'duration';

    const FILLABLE = [ 'name' ];

    const RULES = [
        'name' => 'required|string|max:255'
    ];

    /**
     * @SWG\GET(
     *   path="/api/durations",
     *   tags={"Durations"},
     *   summary="list of durations",
     *   description="File: app\Http\Controllers\API\DurationController@index, permission:Index Duration",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/durations/all-options",
     *   tags={"Durations"},
     *   summary="Get list of durations data in {value: 1, label: Full Time} format",
     *   description="File: app\Http\Controllers\API\DurationController@allOptions, permission:Add ToR|Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    public function allOptions()
    {
        return response()->success(trans('crud.success.default'), $this->model::select('id as value', 'name as label')->orderBy('id', 'desc')->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/durations/{id}",
     *   tags={"Durations"},
     *   summary="Get specific of durations data",
     *   description="File: app\Http\Controllers\API\DurationController@show, permission:Show Duration",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Duration id"
     *    )
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/durations",
     *   tags={"Durations"},
     *   summary="Store durations data",
     *   description="File: app\Http\Controllers\API\DurationController@store, permission:Add Duration",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="Duration",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"name"},
     *              @SWG\Property(property="name", type="string", description="Duration name", example="Part Time")
     *       )
     *   )
     *
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/durations/{id}",
     *   tags={"Durations"},
     *   summary="Update duration data",
     *   description="File: app\Http\Controllers\API\DurationController@update, permission:Edit Duration",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Duration id"
     *   ),
     *   @SWG\Parameter(
     *       name="Duration",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"name", "_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="name", type="string", description="Duration name", example="Part Time")
     *       )
     *   )
     * )
     *
     */

    /**
     * @SWG\Delete(
     *   path="/api/durations/{id}",
     *   tags={"Durations"},
     *   summary="Delete duration data",
     *   description="File: app\Http\Controllers\API\DurationController@destroy, permission:Delete Duration",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Duration id"
     *    ),
     * )
     *
     */
}
