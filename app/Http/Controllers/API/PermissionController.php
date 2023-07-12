<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use DB;

class PermissionController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Permission';
    const SINGULAR = 'permission';

    const FILLABLE = [ 'name', 'description', 'group_id' ];

    const RULES = [
        'name' => 'required|string|max:255',
        'description' => 'sometimes|nullable|string',
        'group_id' => 'sometimes|nullable|integer|exists:groups,id'
    ];

    /**
     * @SWG\Get(
     *   path="/api/permissions",
     *   tags={"Permission"},
     *   summary="Get All Permission Data",
     *   description="File: app\Http\Controllers\API\PermissionController@index, Permission: Index Permission",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/permissions/{id}",
     *   tags={"Permission"},
     *   summary="Get Specific Permission Data",
     *   description="File: app\Http\Controllers\API\PermissionController@show",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token, Permission: Show Permission"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="permission id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function show($id)
    {
        $permission = $this->model::select('id','name','description','group_id')->find($id);
        $group = is_null($permission->group_id) ? '' : [ 'value' => $permission->group->id, 'label' => $permission->group->name ];
        unset($permission->group);
        $permission->group = $group;

        return response()->success(__('crud.success.default'), $permission);
    }

    /**
     * @SWG\Post(
     *   path="/api/permissions",
     *   tags={"Permission"},
     *   summary="Store Permission Data",
     *   description="File: app\Http\Controllers\API\PermissionController@store, Permission: Add Permission",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="permission",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"name"},
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Name of the permission",
     *                  example="Test Permission"
     *              ),
     *              @SWG\Property(
     *                  property="group_id",
     *                  type="number",
     *                  description="Group id",
     *                  example={1}
     *              ),
     *              @SWG\Property(
     *                  property="description",
     *                  type="string",
     *                  description="Description of the permission / location where we put the permission on the frontend"
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/permissions/{id}",
     *   tags={"Permission"},
     *   summary="Update Permission Data",
     *   description="File: app\Http\Controllers\API\PermissionController@update, Permission: Edit Permission",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="permission",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "name"},
     *              @SWG\Property(
     *                  property="_method",
     *                  type="string",
     *                  enum={"PUT"}
     *              ),
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Name of the permission",
     *                  example="Test Permission"
     *              ),
     *              @SWG\Property(
     *                  property="group_id",
     *                  type="number",
     *                  description="Group id",
     *                  example={1}
     *              ),
     *              @SWG\Property(
     *                  property="description",
     *                  type="string",
     *                  description="Description of the permission / location where we put the permission on the frontend"
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Delete(
     *   path="/api/permissions/{id}",
     *   tags={"Permission"},
     *   summary="Delete Permission Data",
     *   description="File: app\Http\Controllers\API\PermissionController@destroy, Permission: Delete Permission",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/permissions/ungroup",
     *   tags={"Permission"},
     *   summary="Get All Ungroup Permission Data",
     *   description="File: app\Http\Controllers\API\PermissionController@getUngroup, Permission: Add Permission|Edit Permission|Add Role|Edit Role|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getUngroup()
    {
        $ungroupPermissions = $this->model::where('group_id', null)->orderBy('id', 'desc')->get();
        return response()->success(__('crud.success.default'), $ungroupPermissions->isEmpty() ? [] : $ungroupPermissions);
    }

}
