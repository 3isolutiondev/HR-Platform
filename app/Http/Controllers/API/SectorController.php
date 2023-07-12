<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\P11\P11EmploymentRecordSector;
use App\Models\P11\P11Sector;
use App\Models\P11\P11Portfolio;
use App\Models\Sector;
use App\Traits\CRUDTrait;
use Spatie\Searchable\Search;
use Illuminate\Support\Facades\DB;

class SectorController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Sector';
    const SINGULAR = 'sector';

    const FILLABLE = [
        'name', 'slug', 'is_approved', 'addedBy'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        'is_approved' => 'required|boolean',
        'addedBy' => 'sometimes|nullable|in:immap,others'
    ];

    const SUGGESTION_RULES  = [
        'sector' => 'required|string|max:255'
    ];

    /**
     * @SWG\GET(
     *   path="/api/sectors/all-options",
     *   tags={"Sector"},
     *   summary="Get approved sectors in { value: 1, label: WASH } format",
     *   description="File: app\Http\Controllers\API\SectorController@allOptions, permission:Index Sector|P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')->where('is_approved',1)->orderBy('name','asc')->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/sectors",
     *   tags={"Sector"},
     *   summary="Get list of all sector data",
     *   description="File: app\Http\Controllers\API\SectorController@index, permission:Index Sector",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    public function index(Request $request) {
        if($request->has('isApproved')) {
            return response()->success(__('crud.success.default'), $this->model::where('is_approved', $request->input('isApproved'))->orderBy('name','asc')->get());
        } else {
            return response()->success(__('crud.success.default'), $this->model::where('is_approved', 1)->orderBy('name','asc')->get());
        }
    }

    /**
     * @SWG\GET(
     *   path="/api/sectors/{id}",
     *   tags={"Sector"},
     *   summary="Get specific sector data",
     *   description="File: app\Http\Controllers\API\SectorController@show, permission:Show Sector",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Sector id"
     *    ),
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/sectors",
     *   tags={"Sector"},
     *   summary="Store sector data",
     *   description="File: app\Http\Controllers\API\SectorController@store, permission:Add Sector",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="sector",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"name", "is_approved"},
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Sector name",
     *                  example="WASH"
     *              ),
     *              @SWG\Property(
     *                  property="is_approved",
     *                  type="integer",
     *                  enum={0,1},
     *                  description="Is approved or not (0 = not approved, 1 = approved) [Approved means it will be shown on profile creation page options]",
     *                  example=0
     *              ),
     *              @SWG\Property(
     *                  property="addedBy",
     *                  type="string",
     *                  enum={"immap", "others"},
     *                  description="Is the sector addedBy admin / or by a basic user (others = basic user, immap = admin or people who has the access to add sector from dashboard)",
     *                  example="immap"
     *              )
     *       )
     *   )
     *
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/sectors/{id}",
     *   tags={"Sector"},
     *   summary="Update sector data",
     *   description="File: app\Http\Controllers\API\SectorController@update, permission:Edit Sector",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="sectors",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method", "name", "is_approved"},
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Sector name",
     *                  example="WASH"
     *              ),
     *              @SWG\Property(
     *                  property="is_approved",
     *                  type="integer",
     *                  enum={0,1},
     *                  description="Is approved or not (0 = not approved, 1 = approved) [Approved means it will be shown on profile creation page options]",
     *                  example=0
     *              ),
     *              @SWG\Property(
     *                  property="addedBy",
     *                  type="string",
     *                  enum={"immap", "others"},
     *                  description="Is the sector addedBy admin / or by a basic user (others = basic user, immap = admin or people who has the access to add sector from dashboard)",
     *                  example="immap"
     *              )
     *       )
     *   ),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Sector id"
     *   )
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/sectors/suggestions",
     *   tags={"Sector"},
     *   summary="Get suggestions of sector",
     *   description="File: app\Http\Controllers\API\SectorController@suggestions",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="sector",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           @SWG\Property(property="sector", type="string", description="Keyword for searching sector name", example="WAS")
     *       )
     *   )
     * )
     *
     */
    public function suggestions(Request $request)
    {
        $validatedData = $this->validate($request, self::SUGGESTION_RULES);
        $suggestions = (new Search())
        ->registerModel($this->model, 'name')
        ->search($validatedData['sector']);

        return response()->success(__('crud.success.default'), $suggestions->pluck('searchable'));
    }

     /**
     * @SWG\Post(
     *   path="/api/sectors/merge",
     *   tags={"Sectors"},
     *   summary="Merge Sector",
     *   description="File: app\Http\Controllers\API\SectorController@merge, Permission: Merge sector",
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
        P11Sector::where('sector_id', $validatedData['origin'])->update(['sector_id' => $validatedData['destination']]);
        P11EmploymentRecordSector::where('sector_id', $validatedData['origin'])->update(['sector_id' => $validatedData['destination']]);
        DB::table('p11_portfolios_sectors')->where('sector_id', $validatedData['origin'])->update(['sector_id' => $validatedData['destination']]);
        try {
            DB::table('p11_professional_societies_sectors')->where('sector_id', $validatedData['origin'])->update(['sector_id' => $validatedData['destination']]);
        } catch(\Exception $e) {

        }
        try{
            Sector::where('id', $validatedData['origin'])->delete();
        }catch(\Exception $e){
            debug($e);
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\Post(
     *   path="/api/sectors/set-is-approved",
     *   tags={"Sector"},
     *   summary="setIsApproved",
     *   description="File: app\Http\Controllers\API\SectorController@setIsApproved, permission:Approve Sector",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="sector",
     *       in="body",
     *       @SWG\Schema(
     *           required={"id"},
     *           @SWG\Property(
     *                property="id",
     *                type="integer",
     *                description="Sector id"
     *           )
     *       )
     *   )
     *
     * )
     *
     */
    public function setIsApproved(Request $request)
    {
        $validatedData = $this->validate($request, [ 'id' => 'required|integer' ]);
        $record = $this->model::findOrFail($request->id);

        if ($record->is_approved == 1) {
            $record->fill([ 'is_approved' => 0 ]);
        } else {
            $record->fill([ 'is_approved' => 1 ]);
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
     * @SWG\GET(
     *   path="/api/sectors/approved-sectors",
     *   tags={"Sector"},
     *   summary="Get approved sectors",
     *   description="File: app\Http\Controllers\API\SectorController@approvedSectors, permission:Index Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function approvedSectors()
    {
        return response()->success(__('crud.success.default'), $this->model::where('is_approved',1)->orderBy('name','asc')->get());
    }


    /**
     * @SWG\Delete(
     *   path="/api/sectors/{id}",
     *   tags={"Sector"},
     *   summary="Delete Sector",
     *   description="File: app\Http\Controllers\API\SectorController@destroy, permission:Delete Sector",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Sector id"
     *    ),
     * )
     *
     */
}
