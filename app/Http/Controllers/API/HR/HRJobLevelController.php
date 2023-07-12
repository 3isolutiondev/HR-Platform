<?php

namespace App\Http\Controllers\API\HR;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class HRJobLevelController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\HR\HRJobLevel';
    const SINGULAR = 'job level';

    const FILLABLE = [ 'name', 'slug' ];

    const RULES = [
        'name' => 'required|string|max:255',
    ];

    /**
     * @SWG\GET(
     *   path="/api/hr-job-levels",
     *   tags={"Job Level"},
     *   summary="List of job level",
     *   description="File: app\Http\Controllers\API\HRJobLevelController@index, Permission: Index HR Job Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/hr-job-levels/{id}",
     *   tags={"Job Level"},
     *   summary="Get specific job level",
     *   description="File: app\Http\Controllers\API\HRJobLevelController@show, Permission: Show HR Job Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/hr-job-levels",
     *   tags={"Job Level"},
     *   summary="Store hr job level",
     *   description="File: app\Http\Controllers\API\HRJobLevelController@store, Permission: Add HR Job Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="JobLevel",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name"},
     *          @SWG\Property(property="name", type="string", description="Job level name", example="Job level name"),
     *      )
     *   )
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/hr-job-levels/{id}",
     *   tags={"Job Level"},
     *   summary="Update Job Level",
     *   description="File: app\Http\Controllers\API\HRJobLevelController@update, Permission: Edit HR Job Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer"),
     *   @SWG\Parameter(
     *      name="JobLevel",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name"},
     *          @SWG\Property(property="name", type="string", description="Job level name", example="Job level name"),
     *      )
     *   )
     * )
     *
     */

     /**
     * @SWG\Delete(
     *   path="/api/hr-job-levels/{id}",
     *   tags={"Job Level"},
     *   summary="Delete Job Level",
     *   description="File: app\Http\Controllers\API\HRJobLevelController@destroy, Permission: Delete HR Job Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer")
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/hr-job-levels/all-options",
     *   tags={"Job Level"},
     *   summary="List of Job Level in {value: 1, label: Officer} format",
     *   description="File: app\Http\Controllers\API\HRJobLevelController@allOptions, Permission: Index HR Job Level|Index ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions() {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')->orderBy('created_at','desc')->get());
    }
}
