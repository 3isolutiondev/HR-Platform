<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class SettingController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Setting';
    const SINGULAR = 'Setting';

    const FILLABLE = ['name', 'value'];

    const RULES = [
        'name' => 'required|string|max:255',
        'value' => 'required'
    ];

    /**
     * @SWG\GET(
     *   path="/api/settings",
     *   tags={"Setting"},
     *   summary="Get list of all settings",
     *   description="File: app\Http\Controllers\API\SettingController@index, permission:Index Setting",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/settings/{id}",
     *   tags={"Setting"},
     *   summary="Get specific setting data",
     *   description="File: app\Http\Controllers\API\SettingController@show, permission:Show Setting",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Setting id"
     *    )
     * )
     *
     */
    /**
     * @SWG\Post(
     *   path="/api/settings",
     *   tags={"Setting"},
     *   summary="Store setting data",
     *   description="File: app\Http\Controllers\API\SettingController@store, permission:Add Setting",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="setting",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"name", "value"},
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Setting name",
     *                  example="3iSolution HQ Address"
     *              ),
     *              @SWG\Property(
     *                  property="value",
     *                  type="string",
     *                  description="Setting value",
     *                  example="Washington DC"
     *              )
     *       )
     *   )
     *
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/settings/{id}",
     *   tags={"Setting"},
     *   summary="update settings",
     *   description="File: app\Http\Controllers\API\SettingController@update, permission:Edit Setting",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="setting",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"_method","name", "value"},
     *          @SWG\Property(
     *              property="_method",
     *              type="string",
     *              enum={"PUT"},
     *              example="PUT"
     *          ),
     *          @SWG\Property(
     *              property="name",
     *              type="string",
     *              description="Setting name",
     *              example="3iSolution HQ Address"
     *          ),
     *          @SWG\Property(
     *              property="value",
     *              type="string",
     *              description="Setting value",
     *              example="Washington DC"
     *          )
     *       )
     *   ),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Setting id"
     *   )
     * )
     *
     */

    /**
     * @SWG\Delete(
     *   path="/api/settings/{id}",
     *   tags={"Setting"},
     *   summary="Delete settings",
     *   description="File: app\Http\Controllers\API\SettingController@destroy, permission:Delete Setting",
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
     *       description="Setting id"
     *    ),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/settings/options/{slug}",
     *   tags={"Setting"},
     *   summary="list of settings",
     *   description="File: app\Http\Controllers\API\SettingController@options, permission:Show Setting",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="slug",
     *       in="path",
     *       required=true,
     *       type="string",
     *       description="Setting slug, value would be like: immap-hq-address"
     *    )
     * )
     *
     */
    public function options($slug)
    {
        return response()->success(__('crud.success.default'), $this->model::select('value')->where('slug',$slug)->first()->value);
    }
}
