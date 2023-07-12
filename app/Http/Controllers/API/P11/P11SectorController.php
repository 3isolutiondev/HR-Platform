<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use Illuminate\Support\Arr;

/**
 * this class is the early version of profile creation page, when we gathered and sector data foreach profile for analytics purpose
 * Still can be useful if it's needed again
 */
class P11SectorController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Sector';
    const SINGULAR = 'sector';

    const FILLABLE = ['profile_id','sector_id','years','has_portfolio'];

    const RULES = [
        'years' => 'required|integer',
        'sector_id' => 'required|integer',
        'employment_records' => 'required|array',
        'employment_records.*.value' => 'required|integer',
        'portfolios' => 'sometimes|nullable|array',
        'portfolios.*.value' => 'sometimes|nullable|integer',

        // 'has_porfolio' => 'required|boolean'
    ];

    protected $authUser, $authProfileId;

    public function __construct() {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-sectors",
     *   tags={"P11 Sectors"},
     *   summary="Get list of p11 sector data inside the table",
     *   description="File: app\Http\Controllers\API\P11SectorController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function index()
    {
        $records = $this->model::where('profile_id',$this->authProfileId)->with('sector:id,name,slug')->get();

        if (!$records) {
            return response()->not_found();
        }

        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-sectors/{id}",
     *   tags={"P11 Sectors"},
     *   summary="Get specific p11 sector data",
     *   description="File: app\Http\Controllers\API\P11SectorController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 sector id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::findOrFail($id);

        $record->employment_records = $record->sector->p11_employment_records()->select('p11_employment_id as id','job_title')->get();
        unset($record->sector->p11_employment_records);

        if ($record->sector->has('p11_portfolios')) {
            $record->portfolios = $record->sector->p11_portfolios()->select('p11_portfolio_id as id', 'title')->get();
            unset($record->sector->p11_portfolios);
        }


        return response()->success(__("crud.success.default"), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-sectors",
     *   tags={"P11 Sectors"},
     *   summary="Store p11 sector data",
     *   description="File: app\Http\Controllers\API\P11SectorController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Sector",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"years", "sector_id", "employment_records"},
     *          @SWG\Property(property="years", type="integer", description="Working experience for each sector", example=3),
     *          @SWG\Property(property="sector_id", type="integer", description="Sector id", example=234),
     *          @SWG\Property(
     *              property="employment_records",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="value",
     *                      type="integer",
     *                      description="P11 employment record id"
     *                  ),
     *              )
     *          ),
     *          @SWG\Property(
     *              property="portfolios",
     *              type="array",
     *              description="not required",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="value",
     *                      type="integer",
     *                      description="P11 portfolio id"
     *                  ),
     *              )
     *          )
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request) {
        $validatedData = $this->validate($request, $this->rules);

        $recordData = $request->only($this->fillable);
        $recordData['profile_id'] = $this->authProfileId;
        $recordData['has_portfolio'] = (count($validatedData['portfolios']) ? 1 : 0);

        $record = $this->model::create($recordData);

        if (!$record) {
            return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        $employment_record_updated = $record->sector->p11_employment_records()->sync(Arr::pluck($validatedData['employment_records'], 'value'));

        if (!$employment_record_updated) {
            return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        if (count($validatedData['portfolios'])) {
            $portfolio_updated = $record->sector->p11_portfolios()->sync(Arr::pluck($validatedData['portfolios'], 'value'));

            if (!$portfolio_updated) {
                return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
            }
        }

        return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-sectors/{id}",
     *   tags={"P11 Sectors"},
     *   summary="Update p11 sector data",
     *   description="File: app\Http\Controllers\API\P11SectorController@update, permission:P11 Access",
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
     *       description="P11 sector id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11Sector",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "years", "sector_id", "employment_records"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="years", type="integer", description="Working experience for each sector", example=3),
     *          @SWG\Property(property="sector_id", type="integer", description="Sector id", example=234),
     *          @SWG\Property(
     *              property="employment_records",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="value",
     *                      type="integer",
     *                      description="P11 employment record id"
     *                  ),
     *              )
     *          ),
     *          @SWG\Property(
     *              property="portfolios",
     *              type="array",
     *              description="not required",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="value",
     *                      type="integer",
     *                      description="P11 portfolio id"
     *                  ),
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

        $record = $this->model::findOrFail($id);

        if (!$record) {
            return response()->not_found();
        }

        $recordData = $request->only($this->fillable);
        $recordData['profile_id'] = $this->authProfileId;
        $recordData['has_portfolio'] = (count($validatedData['portfolios']) ? 1 : 0);

        $record->fill($recordData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        $employment_record_updated = $record->sector->p11_employment_records()->sync(Arr::pluck($validatedData['employment_records'], 'value'));

        if (!$employment_record_updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if (count($validatedData['portfolios'])) {
            $portfolio_updated = $record->sector->p11_portfolios()->sync(Arr::pluck($validatedData['portfolios'], 'value'));

            if (!$portfolio_updated) {
                return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
            }
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-sectors/{id}",
     *   tags={"P11 Sectors"},
     *   summary="Delete p11 sector data",
     *   description="File: app\Http\Controllers\API\P11SectorController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 sector id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);

        $record->sector->p11_employment_records()->detach();
        $record->sector->p11_portfolios()->detach();

        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }
}
