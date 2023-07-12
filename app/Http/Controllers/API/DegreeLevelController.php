<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class DegreeLevelController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\DegreeLevel';
    const SINGULAR = 'Degree Level';

    const FILLABLE = [
        'name', 'slug', 'order'
    ];

    const RULES = [
        'name' => 'required|string|max:255'
    ];

    /**
     * @SWG\Get(
     *   path="/api/degree-levels/all-options",
     *   tags={"Degree Level"},
     *   summary="Get All Degree Level data with {value: 1, label:Bachelor} format",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@all, Permission: Index Degree Level|P11 Access|Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function all() {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')->orderBy('order','asc')->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/degree-levels/",
     *   tags={"Degree Level"},
     *   summary="Get All Degree Level data",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@all, Permission: Index Degree Level|P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function index() {
        return response()->success(__('crud.success.default'), $this->model::orderBy('order','asc')->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/degree-levels/{id}",
     *   tags={"Degree Level"},
     *   summary="Get Specific Degree Level Data",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@show, Permission: Show Degree Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="degree level id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/degree-levels",
     *   tags={"Degree Level"},
     *   summary="Store Degree Level Data",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@store, Permission: Add Degree Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="role",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"name"},
     *              @SWG\Property(property="name", type="string", description="Degree level name", example="Bachelor"),
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
        $degreeLevel = $request->only($this->fillable);
        $degreeLevelCount = $this->model::get()->count();
        $degreeLevel['order'] = ($degreeLevelCount > 0) ? $degreeLevelCount : 0;
        $record = $this->model::create($degreeLevel);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

     /**
     * @SWG\Post(
     *   path="/api/degree-levels/{id}",
     *   tags={"Degree Level"},
     *   summary="Update Degree Level Data",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@update, Permission: Edit Degree Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="degree level id"),
     *   @SWG\Parameter(
     *          name="role",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "name"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="name", type="string", description="Degree level name", example="Bachelor"),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

     /**
     * @SWG\Delete(
     *   path="/api/degree-levels/{id}",
     *   tags={"Degree Level"},
     *   summary="Delete Degree Level Data",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@destroy, Permission: Delete Degree Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="degree level id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/degree-levels/change-order",
     *   tags={"Degree Level"},
     *   summary="Update Order of Degree Level Data",
     *   description="File: app\Http\Controllers\API\DegreeLevelController@changeOrder, Permission: Edit Degree Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="role",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "degreeLevels"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="degreeLevels", type="array",
     *                  description="List of Degree Level in sorted order",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="degree level id", example=1),
     *                      @SWG\Property(property="label", type="string", description="degree level name", example="Diploma")
     *                  ),
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function changeOrder(Request $request)
    {
        $validatedData = $this->validate($request, ['degreeLevels' => 'required|array', 'degreeLevels.*.value' => 'required|integer']);
        foreach($validatedData['degreeLevels'] as $key => $degreeLevel) {
            $record = $this->model::findOrFail($degreeLevel['value']);
            $record->order = $key;
            $record->save();
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]));
    }
}
