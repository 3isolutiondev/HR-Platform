<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\FieldOfWork;
use App\Models\P11\P11FieldOfWork;
use App\Traits\CRUDTrait;
use Illuminate\Support\Facades\DB;
use Spatie\Searchable\Search;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class FieldOfWorkController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\FieldOfWork';
    const SINGULAR = 'field_of_work';

    const FILLABLE = ['field', 'slug', 'is_approved', 'addedBy'];

    const RULES = [
        'field' => 'required|string|max:255',
        'slug' => 'required|unique:field_of_works',
        'is_approved' => 'sometimes|nullable|boolean',
        'addedBy' => 'sometimes|nullable|in:immap,others'
    ];

    const SUGGESTION_RULES  = [
        'field' => 'required|string|max:255'
    ];

    /**
     * @SWG\Get(
     *   path="/api/field-of-works/all-options",
     *   tags={"Area of Expertise"},
     *   summary="Get All Area of Expertise data with {value: 1, label: Finance} format",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@allOptions, Permission: Index Area of Expertise|P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function allOptions()
    {

        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'field as label')->orderBy('label')->where('is_approved', 1)->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/field-of-works",
     *   tags={"Area of Expertise"},
     *   summary="Get All Area of Expertise data",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@index, Permission: Index Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function index(Request $request) {
        if($request->has('isApproved')) {
            return response()->success(__('crud.success.default'), $this->model::where('is_approved', $request->input('isApproved'))->orderBy('field')->get());
        } else {
            return response()->success(__('crud.success.default'), $this->model::where('is_approved', 1)->orderBy('field'));
        }
    }

    /**
     * @SWG\Get(
     *   path="/api/field-of-works/{id}",
     *   tags={"Area of Expertise"},
     *   summary="Show specific Area of Expertise data",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@show, Permission: Show Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Area of expertise id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/field-of-works",
     *   tags={"Area of Expertise"},
     *   summary="Store Area of Expertise Data",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@store, Permission: Add Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"field"},
     *              @SWG\Property(property="field", type="string", description="Area of expertise", example="Information Technology"),
     *              @SWG\Property(property="is_approved", type="integer", enum={0,1}, description="If is_approved == 1 it will show in select field options", example=1),
     *              @SWG\Property(property="addedBy", type="string", enum={"immap","others"}, description="addedBy iMMAP or Others", example="immap"),
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
        $request['slug'] = Str::slug(strtolower($request['field']), '-');

        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::create($validatedData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/field-of-works/{id}",
     *   tags={"Area of Expertise"},
     *   summary="Update Area of Expertise Data",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@update, Permission: Edit Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Area of expertise id"),
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "field"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="field", type="string", description="Area of expertise", example="Information Technology"),
     *              @SWG\Property(property="is_approved", type="integer", enum={0,1}, description="If is_approved == 1 it will show in select field options", example=1)
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
        $request['slug'] = Str::slug(strtolower($request['field']), '-');

        $validatedData = $this->validate($request, [
            'field' => 'required|string|max:255',
            'slug' => 'required|string|unique:field_of_works,slug,' . $id,
            'is_approved' => 'sometimes|nullable|boolean'
        ]);

        $record = $this->model::findOrFail($id);

        $record->fill($request->only($this->fillable));

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/field-of-works/suggestions",
     *   tags={"Area of Expertise"},
     *   summary="Get area of expertise suggestions",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@suggestions, permission:Index Area of Expertise|P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"field"},
     *              @SWG\Property(property="field", type="string", description="Substring of Area of expertise", example="Inf")
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function suggestions(Request $request)
    {
        $validatedData = $this->validate($request, self::SUGGESTION_RULES);
        $suggestions = (new Search())
            ->registerModel($this->model, 'field')
            ->search($validatedData['field']);

        if ($suggestions) {
            return response()->success(__('crud.success.default'), $suggestions->pluck('searchable'));
        }

        return response()->error(__('crud.error.default', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/field-of-works/set-is-approved",
     *   tags={"Area of Expertise"},
     *   summary="Set area of expertise to be approved or seen in Area of expertise select field",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@setIsApproved, Permission: Approve Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"id"},
     *              @SWG\Property(property="id", type="integer", description="area of expertise id", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setIsApproved(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer']);
        $record = $this->model::findOrFail($request->id);

        if ($record->is_approved == 1) {
            $record->fill(['is_approved' => 0]);
        } else {
            $record->fill(['is_approved' => 1]);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.default'), 500);
        }

        if ($record) {
            return response()->success(__('crud.store.default'), $record);
        }

        return response()->error(__('crud.error.default'), 500);
    }

        /**
     * @SWG\Post(
     *   path="/api/field-of-works/merge",
     *   tags={"Area of Expertise"},
     *   summary="Merge Area of Expertise Data",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@update, Permission: Edit Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Area of expertise id"),
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "field"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="origin", type="integer", description="origin Area of expertise id", example="1"),
     *              @SWG\Property(property="destination", type="integer", description="destination Area of expertise id", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function merge(Request $request)
    {
        $validatedData = $this->validate($request, [
            'origin' => 'required|integer',
            'destination' => 'required|integer',
        ]);

        $recordDestination = $this->model::findOrFail($validatedData['destination']);
        $recordOrigin = $this->model::findOrFail($validatedData['origin']);
        if (!$recordDestination) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
        if (!$recordOrigin) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
        try{
            $record = P11FieldOfWork::where('field_of_work_id', $validatedData['origin'])->update(['field_of_work_id' => $validatedData['destination']]);
            FieldOfWork::where('id', $validatedData['origin'])->delete();
        } catch(\Exception $e){
            
        }
        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Delete(
     *   path="/api/field-of-works/{id}",
     *   tags={"Area of Expertise"},
     *   summary="Delete specific Area of Expertise data",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@destroy, Permission: Delete Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Area of expertise id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
}
