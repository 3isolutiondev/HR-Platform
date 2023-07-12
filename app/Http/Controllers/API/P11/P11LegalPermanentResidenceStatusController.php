<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Profile;
use DB;

class P11LegalPermanentResidenceStatusController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11LegalPermanentResidenceStatus';
    const SINGULAR = 'p11 legal permanent residence status';

    const FILLABLE = ['country_id','profile_id'];

    const RULES = [
        'country.value' => 'required|integer'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-legal-permanent-residence-status",
     *   tags={"P11 Legal Permanent Residence Status / Do you have legal permanent residency in any country other than that of your nationality?"},
     *   summary="Get list of p11 legal permanent residence status data (All data inside the table)",
     *   description="File: app\Http\Controllers\API\P11LegalPermanentResidenceStatusController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/p11-legal-permanent-residence-status/{id}",
     *   tags={"P11 Legal Permanent Residence Status / Do you have legal permanent residency in any country other than that of your nationality?"},
     *   summary="Get specific of p11 legal permanent residence status data",
     *   description="File: app\Http\Controllers\API\P11LegalPermanentResidenceStatusController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 legal permanent residence status id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with('country')->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

     /**
     * @SWG\Post(
     *   path="/api/p11-legal-permanent-residence-status",
     *   tags={"P11 Legal Permanent Residence Status / Do you have legal permanent residency in any country other than that of your nationality?"},
     *   summary="Store p11 legal permanent residence status data, the data that stored are related to the profile that logged in",
     *   description="File: app\Http\Controllers\API\P11LegalPermanentResidenceStatusController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11LegalPermanentResidenceStatus",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"country"},
     *          @SWG\Property(
     *              property="country",
     *              type="object",
     *              @SWG\Property(
     *                  property="value",
     *                  type="integer",
     *                  description="country id",
     *                  example=1
     *              ),
     *          ),
     *      )
     *   )
     *
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $formData = $request->only($this->fillable);
        $formData['country_id'] = $validatedData['country']['value'];
        $formData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($formData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-legal-permanent-residence-status/{id}",
     *   tags={"P11 Legal Permanent Residence Status / Do you have legal permanent residency in any country other than that of your nationality?"},
     *   summary="Update p11 legal permanent residence status data, the data that updated are related to the profile that logged in",
     *   description="File: app\Http\Controllers\API\P11LegalPermanentResidenceStatusController@update, permission:P11 Access",
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
     *       description="P11 legal permanent residence status id"
     *   ),
     *   @SWG\Parameter(
     *      name="p11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "country"},
     *          @SWG\Property(
     *             property="_method", type="string", enum={"PUT"}, example="PUT"
     *          ),
     *          @SWG\Property(
     *              property="country",
     *              type="object",
     *              @SWG\Property(
     *                  property="value",
     *                  type="integer",
     *                  description="Country id",
     *                  example=1
     *              ),
     *          ),
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

        $formData = $request->only($this->fillable);
        $formData['country_id'] = $validatedData['country']['value'];
        $record->fill($formData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if ($updated) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-legal-permanent-residence-status/lists",
     *   tags={"P11 Legal Permanent Residence Status / Do you have legal permanent residency in any country other than that of your nationality?"},
     *   summary="Get list of p11 legal permanent residence status data related to the profile that are logged in",
     *   description="File: app\Http\Controllers\API\P11LegalPermanentResidenceStatusController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists() {
        $lists = $this->model::with('country')->where('profile_id', $this->authProfileId)->get();

        if ($lists) {
            return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]), $lists);
        }

        return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-legal-permanent-residence-status/{id}",
     *   tags={"P11 Legal Permanent Residence Status / Do you have legal permanent residency in any country other than that of your nationality?"},
     *   summary="Delete p11 legal permanent residence status data",
     *   description="File: app\Http\Controllers\API\P11LegalPermanentResidenceStatusController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 legal permanent residence status id"
     *    ),
     * )
     *
     */
}
