<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Http\Response as ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\CRUDTrait;

class RoleController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Role';
    const SINGULAR = 'role';

    const FILLABLE = ['name'];

    const RULES = [
        'name' => 'required|string|max:255',
        'permissions' => 'required|array',
        'permissions.*' => 'required_with:permissions|integer|exists:permissions,id',
        'immap_offices' => 'sometimes|nullable|array',
        'immap_offices.*' => 'required_with:immap_offices|integer|exists:immap_offices,id'
    ];

    /**
     * @SWG\Get(
     *   path="/api/roles",
     *   tags={"Role"},
     *   summary="Get All Role Data",
     *   description="File: app\Http\Controllers\API\RoleController@index, Permission: Index Role",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/roles/{id}",
     *   tags={"Role"},
     *   summary="Get Specific Role Data",
     *   description="File: app\Http\Controllers\API\RoleController@show, Permission: Show Role",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token, Permission: Show Role"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="role id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function show($id)
    {
        $role = $this->model::select('id','name')->with([
            'immap_offices' => function($query) {
                $query->select('immap_offices.id','immap_offices.city','immap_offices.country_id');
            },
            'immap_offices.country' => function($query) {
                $query->select('countries.id','countries.name');
            },
            'permissions' => function($query) {
                $query->select('id','name');
            }
            ])->findOrFail($id);
        // $permissions = \App\Models\Permission::all();
        // $result = [];
        // foreach ($permissions as $permission) {
        //     if ($role->hasPermissionTo($permission)) {
        //         array_push($result, $permission->name);
        //     }
        // }
        if (empty($role)) {
            // return response()->success(__('crud.success.default'), ['role' => $role, 'rolePermissions' => $result]);
            return response()->error(__('role.error.show'), ResponseCode::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->success(__('crud.success.default'), ['role' => $role ]);
    }

    /**
     * @SWG\Post(
     *   path="/api/roles",
     *   tags={"Role"},
     *   summary="Store Role Data",
     *   description="File: app\Http\Controllers\API\RoleController@store, Permission: Add Role",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="role",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"name", "permissions"},
     *              @SWG\Property(property="name", type="string", description="Name of the role", example="Test Role"),
     *              @SWG\Property(property="permissions", type="array", description="Permissions List for the role", example={"Add Role","Edit Role"},
     *                  @SWG\Items(
     *                      type="string",
     *                      description="List of permissions should be exists in name field in permissions table",
     *                  )
     *              ),
     *              @SWG\Property(property="immap_offices", type="array", description="iMMAP Offices List for the role", example={1,2,3},
     *                  @SWG\Items(
     *                      type="integer",
     *                      description="List of immap_offices should be exists in id field in immap_offices table",
     *                  )
     *              ),
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

        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::create(['name' => $validatedData['name']]);
        $record->givePermissionTo($validatedData['permissions']);

        if (count($validatedData['immap_offices'])) {
            $record->immap_offices()->attach($validatedData['immap_offices']);
            $record->immap_offices;
        }

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record, ResponseCode::HTTP_CREATED);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), ResponseCode::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @SWG\Post(
     *   path="/api/roles/{id}",
     *   tags={"Role"},
     *   summary="Update Role Data",
     *   description="File: app\Http\Controllers\API\RoleController@update, Permission: Edit Role",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="role id",
     *      ),
     *   @SWG\Parameter(
     *          name="role",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "name", "permissions"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="name", type="string", description="Name of the role", example="Test Role"),
     *              @SWG\Property(property="permissions", type="array", description="Permissions List for the role", example={"Add Role","Edit Role"},
     *                  @SWG\Items(
     *                      type="string",
     *                      description="List of permissions should be exists in name field in permissions table"
     *                  )
     *              ),
     *              @SWG\Property(property="immap_offices", type="array", description="iMMAP Offices List for the role", example={1,2,3},
     *                  @SWG\Items(
     *                      type="integer",
     *                      description="List of immap_offices should be exists in id field in immap_offices table",
     *                  )
     *              ),
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
        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::findOrFail($id);
        $record->fill(['name' => $validatedData['name']]);

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), ResponseCode::HTTP_INTERNAL_SERVER_ERROR);
        }

        $record->syncPermissions($validatedData['permissions']);
        $permissions = $record->permissions->whereIn('name', ['Approve Domestic Travel Request','View Other Travel Request'])->pluck('name')->toArray();

        if (empty($permissions)) {
            $users = User::role($record->name)->get();

            foreach ($users as $user) {
                $user->officer_country()->detach();
            }
        }

        $record->immap_offices()->detach();
        if(count($validatedData['immap_offices'])) {
            $record->immap_offices()->attach($validatedData['immap_offices']);
            $record->immap_offices;
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record, ResponseCode::HTTP_OK);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), ResponseCode::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @SWG\Delete(
     *   path="/api/roles/{id}",
     *   tags={"Role"},
     *   summary="Delete Role Data",
     *   description="File: app\Http\Controllers\API\RoleController@destroy, Permission: Delete Role",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="role id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $record->immap_offices()->detach();
        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\Get(
     *   path="/api/roles/all-options",
     *   tags={"Role"},
     *   summary="Get Role Data in {value: 1, label: 'Test Role'} format",
     *   description="File: app\Http\Controllers\API\RoleController@allOptions, Permission: Add Role|Edit Role",
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
}
