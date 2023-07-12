<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Role;

class ImmapOfficeController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\ImmapOffice';
    const SINGULAR = 'immap office';

    const FILLABLE = [ 'city', 'country_id', 'is_active', 'is_hq' ];

    const RULES = [
        'city' => 'required|string|max:255',
        'country' => 'required',
        'country.value' => 'required|integer',
        'is_active' => 'required|boolean',
        'is_hq' => 'required|boolean'
    ];

    protected $user_country_office;

    public function __construct()
    {
        $immap_offices = [];
        if (!empty(auth()->user())) {
            $roles = auth()->user()->roles;
            foreach($roles as $role) {
                $immap_office_ids = $role->immap_offices->pluck('id')->toArray();
                if (count($immap_office_ids)) {
                    array_push($immap_offices, ...$immap_office_ids);
                }
            }
            $immap_offices = array_unique($immap_offices);
        }

        $this->user_country_office = $immap_offices;
    }

    /**
     * @SWG\Get(
     *   path="/api/immap-offices/p11-all-options",
     *   tags={"Immap Office"},
     *   summary="Get active Immap Office data in {value: 1, label: United State - (Washington DC)} format",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@p11AllOptions, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11AllOptions()
    {
        $records = $this->model::where('is_active',1)->with([
            'country'
        ])->get();

        $records = $records->map(function($record, $key) {
            return collect([
                'value' => $record->id,
                'label' => $record->country->name.' - ('.$record->city.')'
            ]);
        });
        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\Get(
     *   path="/api/immap-offices/all-options",
     *   tags={"Immap Office"},
     *   summary="Get All Immap Office data in {value: 1, label: United State - (Washington DC)} format",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@allOptions, Permission: Add Immap Office|P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function allOptions()
    {
        $records = $this->model::whereIn('id', $this->user_country_office)->with([
            'country'
        ])->get();

        $records = $records->map(function($record, $key) {
            return collect([
                'value' => $record->id,
                'label' => $record->country->name.' - ('.$record->city.')'
            ]);
        });

        $records = $records->sortBy('label')->values()->all();

        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\Get(
     *   path="/api/immap-offices",
     *   tags={"Immap Office"},
     *   summary="Get All Immap Office data",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@index, Permission: Index Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function index()
    {
        $records = $this->model::with([
            'country' => function($query) {
                $query->select('id','name');
            }
        ])->orderBy('id','desc')->get();

        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\Get(
     *   path="/api/immap-offices/{id}",
     *   tags={"Immap Office"},
     *   summary="Get Specific Immap Office data",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@show, Permission: Show Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="iMMAP office id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with([
            'country' => function($query) {
                $query->select('id', 'id as value', 'name as label');
            }
        ])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/immap-offices",
     *   tags={"Immap Office"},
     *   summary="Store Immap Office Data",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@store, Permission: Add Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="iMMAPOffice",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"city", "country", "is_active", "is_hq"},
     *              @SWG\Property(property="city", type="string", description="iMMAP Office city", example="Washington DC"),
     *              @SWG\Property(property="country", type="object", description="Selected Country",
     *                  example={"value": 1},
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="value should be id exists in countries table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="is_active", type="integer", enum={0,1}, description="set immap office as active / inactive (0: inactive, 1: active)", example=1),
     *              @SWG\Property(property="is_hq", type="integer", enum={0,1}, description="set immap office as headquerter / not (0: non hq, 1: hq)", example=0)
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
        $officeData = [
            'city' => $validatedData['city'],
            'country_id' => $validatedData['country']['value'],
            'is_active' => $validatedData['is_active'],
            'is_hq' => $validatedData['is_hq']
        ];

        $record = $this->model::create($officeData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/immap-offices/{id}",
     *   tags={"Immap Office"},
     *   summary="Update Immap Office Data",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@update, Permission: Edit Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="iMMAP office id"),
     *   @SWG\Parameter(
     *          name="iMMAPOffice",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "city", "country", "is_active", "is_hq"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="city", type="string", description="iMMAP Office city", example="Washington DC"),
     *              @SWG\Property(property="country", type="object", description="Selected Country",
     *                  example={"value": 1},
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="value should be id exists in countries table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="is_active", type="integer", enum={0,1}, description="set immap office as active / inactive (0: inactive, 1: active)", example=1),
     *              @SWG\Property(property="is_hq", type="integer", enum={0,1}, description="set immap office as headquerter / not (0: non hq, 1: hq)", example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::findOrFail($id);

        $officeData = [
            'city' => $validatedData['city'],
            'country_id' => $validatedData['country']['value'],
            'is_active' => $validatedData['is_active'],
            'is_hq' => $validatedData['is_hq']
        ];

        $record->fill($officeData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/immap-offices/{id}",
     *   tags={"Immap Office"},
     *   summary="Delete Specific Immap Office data",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@destroy, Permission: Delete Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="iMMAP office id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $record->roles()->detach();
        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\Post(
     *   path="/api/immap-offices/set-is-active",
     *   tags={"Immap Office"},
     *   summary="Set immap office as active or inactive",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@setIsActive, Permission: Approve Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"id"},
     *              @SWG\Property(property="id", type="integer", description="iMMAP Office id", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setIsActive(Request $request)
    {
        $validatedData = $this->validate($request, [ 'id' => 'required|integer' ]);
        $record = $this->model::findOrFail($request->id);

        if ($record->is_active == 1) {
            $record->fill([ 'is_active' => 0 ]);
        } else {
            $record->fill([ 'is_active' => 1 ]);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.default'), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.default'), $record);
        }

        return response()->error(__('crud.error.default'), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/immap-offices/set-is-hq",
     *   tags={"Immap Office"},
     *   summary="Set immap office as hq or non hq",
     *   description="File: app\Http\Controllers\API\ImmapOfficeController@setIsHQ, Permission: Approve Immap Office",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"id"},
     *              @SWG\Property(property="id", type="integer", description="iMMAP Office id", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setIsHQ(Request $request)
    {
        $validatedData = $this->validate($request, [ 'id' => 'required|integer' ]);
        $record = $this->model::findOrFail($request->id);

        if ($record->is_hq == 1) {
            $record->fill([ 'is_hq' => 0 ]);
        } else {
            $record->fill([ 'is_hq' => 1 ]);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.default'), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.default'), $record);
        }

        return response()->error(__('crud.error.default'), 500);
    }

    public function getHQ()
    {
        $records = $this->model::where('is_hq',1)->with([
            'country'
        ])->get();

        $records = $records->map(function($record, $key) {
            return collect([
                'value' => $record->id,
                'label' => $record->country->name
            ]);
        });
        return response()->success(__('crud.success.default'), $records);
    }
}
