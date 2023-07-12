<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

/**
 * This class is early version of profile creation page, when we gathered List Professional Societies and Activities in Civic, Public or International Affairs of the user
 * Still can be useful if it's needed again
 */
class P11ProfessionalSocietyController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11ProfessionalSociety';
    const SINGULAR = 'Professional Society';

    const FILLABLE = [
        'name', 'description', 'country_id', 'attended_from', 'attended_to', 'profile_id'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        'description' => 'sometimes|nullable',
        'country_id' => 'required|integer',
        'attended_from' => 'required|date',
        'attended_to' => 'required|date',
        'sectors' => 'sometimes|nullable|array'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-professional-societies",
     *   tags={"P11 Professional Societies / List Professional Societies and Activities in Civic, Public or International Affairs"},
     *   summary="Get list of all p11 professional societies data inside the table",
     *   description="File: app\Http\Controllers\API\P11ProfessionalSocietyController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/p11-professional-societies",
     *   tags={"P11 Professional Societies / List Professional Societies and Activities in Civic, Public or International Affairs"},
     *   summary="Store p11 professional societies data",
     *   description="File: app\Http\Controllers\API\P11ProfessionalSocietyController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11ProfessionalSociety",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "country_id", "attended_from", "attended_to"},
     *          @SWG\Property(property="name", type="string", description="Name of the professional societies and activities in civic, public or international affairs", example="The name of the activities"),
     *          @SWG\Property(property="description", type="string", description="Name of the professional societies and activities in civic, public or international affairs", example="Description of the activities"),
     *          @SWG\Property(property="country_id", type="integer", description="country id which the activity happened", example=1),
     *          @SWG\Property(property="attended_from", type="string", format="date", description="Attended from [format date: Y-m-d]", example="2015-10-25"),
     *          @SWG\Property(property="attended_to", type="string", format="date", description="Attended to [format date: Y-m-d]", example="2015-11-25"),
     *          @SWG\Property(
     *              property="sectors",
     *              type="array",
     *              description="It can be empty or null, [array of sector id]",
     *              @SWG\Items(
     *                  type="integer",
     *                  description="sector id",
     *                  example=2
     *              )
     *          )
     *      )
     *   )
     * )
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $professionalSocietyData = $request->only($this->fillable);
        $professionalSocietyData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($professionalSocietyData);

        if(!empty($validatedData['sectors'])) {
            $record->sectors()->sync($validatedData['sectors']);
        }

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-professional-societies/{id}",
     *   tags={"P11 Professional Societies / List Professional Societies and Activities in Civic, Public or International Affairs"},
     *   summary="Get specific p11 professional societies data",
     *   description="File: app\Http\Controllers\API\P11ProfessionalSocietyController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 professional society id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        return response()->success(__('crud.success.default'), $this->model::with(['country','sectors' => function($query) {
            $query->select('sectors.id as value','name as label');
        }])->findOrFail($id));
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-professional-societies/lists",
     *   tags={"P11 Professional Societies / List Professional Societies and Activities in Civic, Public or International Affairs"},
     *   summary="Get list of all p11 professional societies data related to the logged in profile / user",
     *   description="File: app\Http\Controllers\API\P11ProfessionalSocietyController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::with('country')->where('profile_id', $this->authProfileId)->get());
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-professional-societies/{id}",
     *   tags={"P11 Professional Societies / List Professional Societies and Activities in Civic, Public or International Affairs"},
     *   summary="Update p11 professional societies data",
     *   description="File: app\Http\Controllers\API\P11ProfessionalSocietyController@update, permission:P11 Access",
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
     *       description="P11 professional society id"
     *   ),
     *   @SWG\Parameter(
     *      name="p11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "country_id", "attended_from", "attended_to"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="name", type="string", description="Name of the professional societies and activities in civic, public or international affairs", example="The name of the activities"),
     *          @SWG\Property(property="description", type="string", description="Name of the professional societies and activities in civic, public or international affairs", example="Description of the activities"),
     *          @SWG\Property(property="country_id", type="integer", description="country id which the activity happened", example=1),
     *          @SWG\Property(property="attended_from", type="string", format="date", description="Attended from [format date: Y-m-d]", example="2015-10-25"),
     *          @SWG\Property(property="attended_to", type="string", format="date", description="Attended to [format date: Y-m-d]", example="2015-11-25"),
     *          @SWG\Property(
     *              property="sectors",
     *              type="array",
     *              description="It can be empty or null, [array of sector id if exists]",
     *              @SWG\Items(
     *                  type="integer",
     *                  description="sector id",
     *                  example=2
     *              )
     *          )
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $professionalSocietyData = $request->only($this->fillable);

        $record = $this->model::findOrFail($id);
        $record->fill($professionalSocietyData);

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update',['singular' => $this->singular]), 500);
        }

        if(!empty($validatedData['sectors'])) {
            $record->sectors()->sync($validatedData['sectors']);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-professional-societies/{id}",
     *   tags={"P11 Professional Societies / List Professional Societies and Activities in Civic, Public or International Affairs"},
     *   summary="Delete p11 professional societies data",
     *   description="File: app\Http\Controllers\API\P11ProfessionalSocietyController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 professional society id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $record->sectors()->detach();
        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }
}
