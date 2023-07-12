<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use Illuminate\Support\Str;

/**
 * First version of the web
 */
class UNOrganizationController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\UNOrganization';
    const SINGULAR = 'un organization';

    const FILLABLE = [ 'name', 'slug', 'abbreviation' ];

    const RULES = [
        'name' => 'required|string|max:255',
        'slug' => 'required|unique:un_organizations',
        'abbreviation' => 'required|string',
    ];

    const UPDATE_RULES =[
        'name' => 'required|string|max:255',
        'abbreviation' => 'required|string',

    ];

    /**
     * @SWG\GET(
     *   path="/api/un-organizations",
     *   tags={"UN Organizations"},
     *   summary="Get list of all un organizations data",
     *   description="File: app\Http\Controllers\API\UNOrganizationController@index, permission:Index UN Org",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/un-organizations/{id}",
     *   tags={"UN Organizations"},
     *   summary="Get specific un organization data",
     *   description="File: app\Http\Controllers\API\UNOrganizationController@show, permission:Show UN Org",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="UN org id"
     *    )
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/un-organizations",
     *   tags={"UN Organizations"},
     *   summary="Store un organization",
     *   description="File: app\Http\Controllers\API\UNOrganizationController@store, permission:Add UN Org",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="unorganization",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"name", "slug", "abbreviation"},
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="UN Organization name",
     *                  example="World Health Organization"
     *              ),
     *              @SWG\Property(
     *                  property="slug",
     *                  type="string",
     *                  description="UN Organization slug",
     *                  example="world-health-organization"
     *              ),
     *              @SWG\Property(
     *                  property="abbreviation",
     *                  type="string",
     *                  description="UN Organization abbreviation",
     *                  example="WHO"
     *              )
     *       )
     *   )
     *
     * )
     *
     */
    public function store(Request $request)
    {
        $request['slug'] = Str::slug(strtolower($request['name']), '-');
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::create($validatedData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/un-organizations/{id}",
     *   tags={"UN Organizations"},
     *   summary="Update un organization",
     *   description="File: app\Http\Controllers\API\UNOrganizationController@update, permission:Edit UN Org",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="unorganization",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_medthod","name", "slug", "abbreviation"},
     *              @SWG\Property(
     *                  property="_method",
     *                  type="string",
     *                  enum={"PUT"},
     *                  example="PUT"
     *              ),
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="UN Organization name",
     *                  example="World Health Organization"
     *              ),
     *              @SWG\Property(
     *                  property="slug",
     *                  type="string",
     *                  description="UN Organization slug",
     *                  example="world-health-organization"
     *              ),
     *              @SWG\Property(
     *                  property="abbreviation",
     *                  type="string",
     *                  description="UN Organization abbreviation",
     *                  example="WHO"
     *              )
     *       )
     *   ),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="UN org id"
     *    )
     *
     * )
     *
     */
    public function update(Request $request, $id)
    {
        // $request['slug'] = Str::slug(strtolower($request['name']), '-');
        $validatedData = $this->validate($request, self::UPDATE_RULES);

        $record = $this->model::findOrFail($id);
        $record->fill($validatedData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        // if ($record) {
                // return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        // }

        // return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    public function all()
    {
        $un_organizations = $this->model::select('id as value', 'name as label')->orderBy('name','asc')->get();
        // dump($un_organizations);
        return response()->success(__('crud.success.default'), $un_organizations);
    }

    /**
     * @SWG\Delete(
     *   path="/api/un-organizations/{id}",
     *   tags={"UN Organizations"},
     *   summary="Delete un-organizations",
     *   description="File: app\Http\Controllers\API\UNOrganizationController@destroy, permission:Delete UN Org",
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
     *       description="UN org id"
     *    ),
     * )
     *
     */

}
