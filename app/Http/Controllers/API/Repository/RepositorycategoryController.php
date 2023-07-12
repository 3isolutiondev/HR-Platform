<?php

namespace App\Http\Controllers\API\Repository;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use Illuminate\Support\Facades\View;
use App\Models\Repository\Repository_category;
use DB;

class RepositorycategoryController extends Controller {

    use CRUDTrait;

    const MODEL = 'App\Models\Repository\Repository_category';

    const SINGULAR = 'Repository';

    const FILLABLE = ['name', 'type', 'status'];

    const RULES = [
        'name' => 'required|string',
        'type' => 'required|string',
        'status' => 'required|boolean',
    ];

    const UPDATEx_RULES = [
        'name' => 'required|string',
        'type' => 'required|string',
        'status' => 'required|boolean',
    ];

    const TRANSLATION = [
        'success' => [
            'default' => 'crud.success.default',
            'store' => 'crud.success.store',
            'update' => 'crud.success.update',
            'delete' => 'crud.success.delete'
        ],
        'error' => [
            'default' => 'crud.error.default',
            'store' => 'crud.error.store',
            'update_not_clean' => 'crud.error.update_not_clean',
            'update' => 'crud.error.update',
            'delete' => 'crud.error.delete'
        ],

    ];

    /**
     * @SWG\Get(
     *   path="/api/repository-category",
     *   tags={"Policy", "Policy Category"},
     *   summary="Get all policy category data",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@index, permission:Index Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/repository-category/{type}",
     *   tags={"Policy", "Policy Category"},
     *   summary="Get list of policy category data based on it's type, [type: 1 == national policies, 2 == global policies]",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@show, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *          name="type",
     *          in="path",
     *          required=true,
     *          type="string",
     *          description="[type: 1 == national policies, 2 == global policies]"
     *      ),
     * )
     *
     */
    function show($type) {

        $category=Repository_category::select('*')->where('type', $type)->get()->toTree();

        return response()->success(__('crud.success.default'), $category);
    }

    /**
     * @SWG\Post(
     *   path="/api/repository-category/",
     *   tags={"Policy", "Policy Category"},
     *   summary="Store policy category data",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@store, permission:Add Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="PolicyCategory",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"category", "type", "status"},
     *              @SWG\Property(property="category", type="string", description="Policy category name", example="HR"),
     *              @SWG\Property(property="type", type="integer", enum={1,2}, description="Policy category type, [type: 1 == national policies, 2 == global policies]", example=2),
     *              @SWG\Property(property="status", type="integer", enum={0,1}, description="Policy category status [0 == draft, 1 == publish]", example=1),
     *           )
     *         ),
     *
     *       )
     *    )
     * )
     *
     */
    function store(Request $request) {

        $validatedData = $this->validate($request,
            [
                'category' => 'required|string',
                'type' => 'required|integer',
                'status' => 'required|boolean',
                'parent_id' => 'sometimes|nullable|integer'
            ]
        );

        Repository_category::fixTree();

        $repositoryCategory = Repository_category::create([
            'name' => $validatedData['category'],
            'type' => $validatedData['type'],
            'status' => $validatedData['status'],
        ]);

        if (!empty($validatedData['parent_id'])) {
            $repositoryCategory->parent_id = $validatedData['parent_id'];
            $repositoryCategory->save();
        }

        return response()->success(__('crud.success.default'), $repositoryCategory);

    }

    /**
     * @SWG\Post(
     *   path="/api/repository-category/{id}",
     *   tags={"Policy", "Policy Category"},
     *   summary="Update policy category data",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@update, permission:Edit Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *     @SWG\Parameter(
     *        name="id",
     *        in="path",
     *        required=true,
     *        type="integer",
     *        description="Policy category id"
     *    ),
     *     @SWG\Parameter(
     *       name="PolicyCategory",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method", "category", "type", "status"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="category", type="string", description="Policy category name", example="HR"),
     *              @SWG\Property(property="type", type="integer", enum={1,2}, description="Policy category type, [type: 1 == national policies, 2 == global policies]", example=2),
     *              @SWG\Property(property="status", type="integer", enum={0,1}, description="Policy category status [0 == draft, 1 == publish]", example=1),
     *           )
     *         ),
     *
     *       )
     *    )
     * )
     *
     */
    function update(Request $request, $id) {

        $validatedData = $this->validate($request,
            [
                'category' => 'required|string',
                'type' => 'required|integer',
                'status' => 'required|boolean'
            ]
        );

        Repository_category::fixTree();

        $record = Repository_category::findOrFail($id);

        $record->fill([
            'name' => $validatedData['category'],
            'type' => $validatedData['type'],
            'status' => $validatedData['status']
        ])->save();

        return response()->success(__('crud.success.default'));

    }

    /**
     * @SWG\Delete(
     *   path="/api/repository-category/{id}",
     *   tags={"Policy", "Policy Category"},
     *   summary="Delete policy category data",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@destroy, permission:Delete Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="Policy category id"
     *      ),
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/repository-category/category-by-type/{type}",
     *   tags={"Policy", "Policy Category"},
     *   summary="Get list of policy category data based on it's type, the data will be provided in flat tree array for select field, [type: 1 == national policies, 2 == global policies, 3 == security]",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@getCategoryByType, permission:Index Repository|Add Repository|Edit Repository|Delete Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *          name="type",
     *          in="path",
     *          required=true,
     *          type="string",
     *          description="[type: 1 == national policies, 2 == global policies, 3 == security]"
     *      ),
     * )
     */
    public function getCategoryByType($type)
    {
        $categories = $this->model::select('id', 'id as key', 'id as value', 'type', 'status', '_lft', '_rgt', 'parent_id',
            DB::raw("if(status = 0, CONCAT(name, ' - Draft'), name) as label")
        )->where('type', $type)->withDepth()->get()->toFlatTree();

        foreach($categories as &$category) {
            if (!is_null($category->parent_id)) {
                if ($category->depth > 0) {
                    for($i = 1; $i <= $category->depth; $i++) {
                        $category->label = '&emsp;' . $category->label;
                    }
                }
            }
        }

        return response()->success(__('crud.success.default'), $categories);
    }

    /**
     * @SWG\Get(
     *   path="/repository-category/tree-category-by-type/{type}",
     *   tags={"Policy", "Policy Category"},
     *   summary="Get list of policy category data based on it's type, the data will be provided in tree array for policy-repository page, [type: 1 == national policies, 2 == global policies, 3 == security]",
     *   description="File: app\Http\Controllers\API\Repository\RepositorycategoryController@getTreeCategoryByType, permission:Index Repository|Add Repository|Edit Repository|Delete Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *          name="type",
     *          in="path",
     *          required=true,
     *          type="string",
     *          description="[type: 1 == national policies, 2 == global policies, 3 == security]"
     *      ),
     * )
     */
    public function getTreeCategoryByType($type)
    {
        $user = auth()->user();
        $categories = $this->model::select('id', 'name', 'type', 'status', '_lft', '_rgt', 'parent_id')->where('type', $type);

        if (!$user->hasPermissionTo('Add Repository') && !$user->hasPermissionTo('Edit Repository') && !$user->hasPermissionTo('Set as Admin')) {
            $categories = $categories->where('status', 1);
        }
        $categories = $categories->withDepth()->get()->toTree();


        return response()->success(__('crud.success.default'), $categories);
    }
}
