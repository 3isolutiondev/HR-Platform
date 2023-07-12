<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Permission;

class GroupController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Group';
    const SINGULAR = 'group';

    const FILLABLE = [ 'name', 'description' ];

    const RULES = [
        'name' => 'required|string|max:255',
        'description' => 'sometimes|nullable|string',
        'permissions' => 'sometimes|nullable|array',
        'permissions.*' => 'sometimes|nullable|integer|exists:permissions,id'
    ];

    /**
     * @SWG\Get(
     *   path="/api/groups",
     *   tags={"Group Permission"},
     *   summary="Get All Group Data",
     *   description="File: app\Http\Controllers\API\GroupController@index, Permission: Index Permission|Index Role|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/groups/{id}",
     *   tags={"Group Permission"},
     *   summary="Get Specific Group Data",
     *   description="File: app\Http\Controllers\API\GroupController@show, Permission: Show Permission|Show Role|Set as Admin",
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
        $record = $this->model::with(['permissions' => function($query) { $query->select('id', 'name', 'description', 'group_id'); }])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/groups",
     *   tags={"Group Permission"},
     *   summary="Store Group Data",
     *   description="File: app\Http\Controllers\API\GroupController@store, Permission: Add Permission|Add Role|Set as Admin",
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
    public function store(Request $request)
    {
        $validate = $this->validate($request, self::RULES);
        $record = $this->model::create($request->only(self::FILLABLE));

        if ($record) {
            if (!empty($validate['permissions'])) {
                Permission::whereIn('id', $validate['permissions'])->update(['group_id' => $record->id]);
            }
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/groups/{id}",
     *   tags={"Group Permission"},
     *   summary="Update Group Data",
     *   description="File: app\Http\Controllers\API\GroupController@update, Permission: Edit Permission|Edit Role|Set as Admin",
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
    public function update(Request $request, $id)
    {
        $validate = $this->validate($request, self::RULES);
        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        $record->fill($request->only(self::FILLABLE));

        $record->save();

        if ($record) {
            Permission::where('group_id', $record->id)->update(['group_id' => null]);
            if (!empty($validate['permissions'])) {
                Permission::whereIn('id', $validate['permissions'])->update(['group_id' => $record->id]);
            }
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/groups/{id}",
     *   tags={"Group Permission"},
     *   summary="Delete Group Data",
     *   description="File: app\Http\Controllers\API\GroupController@destroy, Permission: Delete Permission|Delete Role|Set as Admin",
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
     *   path="/api/groups/all-options",
     *   tags={"Group Permission"},
     *   summary="Get Group Data in {value: 1, label: 'Test Role'} format",
     *   description="File: app\Http\Controllers\API\GroupController@allOptions, Permission: Add Permission|Edit Permission|Add Role|Edit Role|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function allOptions()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id as value','name as label')->get());
    }

     /**
     * @SWG\Get(
     *   path="/api/groups/with-permissions",
     *   tags={"Group Permission"},
     *   summary="Get All Group data with it's permissions",
     *   description="File: app\Http\Controllers\API\GroupController@getWithPermissions, Permission: Add Permission|Edit Permission|Add Role|Edit Role|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getWithPermissions()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id', 'name', 'description')->orderBy('groups.name', 'asc')->with(['permissions' => function ($query) {
            $query->select('id','name','description','group_id');
        }])->get());
    }
}
