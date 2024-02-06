<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
// use Validator;

class P11PhoneController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Phone';
    const SINGULAR = 'phone';

    const FILLABLE = ['phone', 'is_primary', 'profile_id'];

    const RULES = [
        'phone' => 'required|string',
        'is_primary' => 'required|boolean',
    ];

    protected $authUser, $authProfile, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    protected function setPrimary($id, $store_or_update = false)
    {
        if ($store_or_update) {
            return $this->model::where('id', '<>', $id)->where('profile_id', $this->authProfileId)->update(['is_primary' => 0]);
        } else {
            $p11_phones = $this->model::where('profile_id', $this->authProfileId)->get();
            if (!empty($p11_phones)) {
                if (count($p11_phones) > 1) {
                    return $this->model::where('id', '<>', $id)->where('profile_id', $this->authProfileId)->update(['is_primary' => 0]);
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

    }

    protected function getLists()
    {
        return $this->model::where('profile_id', $this->authProfileId)->orderBy('created_at', 'desc')->get();
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-phones",
     *   tags={"P11 Phones / Phone of the Profile"},
     *   summary="Get list of p11 phones data related to the logged in profile / user",
     *   description="File: app\Http\Controllers\API\P11PhoneController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function index(Request $request)
    {
        $dbquery = $this->model::where('profile_id', $this->authProfileId)->orderBy('is_primary', 'desc');
        $records = new \StdClass;
        $records->phones = $dbquery->get();
        $records->phone_counts = $dbquery->count();

        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-phones/{id}",
     *   tags={"P11 Phones / Phone of the Profile"},
     *   summary="Get specific of p11 phone data",
     *   description="File: app\Http\Controllers\API\P11PhoneController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 phone id"
     *   )
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/p11-phones",
     *   tags={"P11 Phones / Phone of the Profile"},
     *   summary="Store p11 phone data",
     *   description="File: app\Http\Controllers\API\P11PhoneController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Phone",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"phone", "is_primary"},
     *          @SWG\Property(property="phone", type="string", description="Phone number [format: +1-80989798]", example="+62-89999999"),
     *          @SWG\Property(property="is_primary", type="interger", enum={0,1}, description="Set the phone as primary number", example=1)
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $this->validate($request, $this->rules);

        $recordData = $request->only($this->fillable);
        $recordData['profile_id'] = $this->authProfileId;
        $record = $this->model::create($recordData);

        if ($record) {
            if ($recordData['is_primary'] === 1 || $recordData['is_primary'] === '1') {
                $this->setPrimary($record->id, true);
            }
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-phones/{id}",
     *   tags={"P11 Phones / Phone of the Profile"},
     *   summary="Update p11 phone data",
     *   description="File: app\Http\Controllers\API\P11PhoneController@update, permission:P11 Access",
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
     *       description="P11 phone id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11Phone",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "phone", "is_primary"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="phone", type="string", description="Phone number [format: +1-80989798]", example="+62-89999999"),
     *          @SWG\Property(property="is_primary", type="interger", enum={0,1}, description="Set the phone as primary number", example=1)
     *      )
     *   )
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::findOrFail($id);

        $record->fill($request->only($this->fillable));

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            if ($validatedData['is_primary'] === 1 || $validatedData['is_primary'] === '1') {
                $this->setPrimary($record->id, true);
            }

            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-phones/update-primary-phone",
     *   tags={"P11 Phones / Phone of the Profile"},
     *   summary="Update p11 phone data",
     *   description="File: app\Http\Controllers\API\P11PhoneController@update_primary_phone, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Phone",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="P11 phone id", example=1),
     *      )
     *   )
     * )
     *
     **/
    public function update_primary_phone(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer'], ['id']);
        $record = $this->model::findOrFail($validatedData['id']);

        $record->is_primary = 1;
        $saved = $record->save();

        if (!$saved) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        $updatePrimaryPhone = $this->setPrimary($record->id);

        if (!$updatePrimaryPhone) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $this->getLists());
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-phones/{id}",
     *   tags={"P11 Phones / Phone of the Profile"},
     *   summary="Delete p11 phone data",
     *   description="File: app\Http\Controllers\API\P11PhoneController@destroy, permission:P11 Access",
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
     *       description="P11 phone id"
     *    ),
     * )
     *
     */
}
