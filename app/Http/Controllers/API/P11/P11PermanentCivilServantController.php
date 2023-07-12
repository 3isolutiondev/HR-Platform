<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class P11PermanentCivilServantController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11PermanentCivilServant';
    const SINGULAR = 'permanent civil servant';

    const FILLABLE = ['from','to','is_now','institution','profile_id'];

    const RULES = [
        'is_now' => 'required|boolean',
        'from' => 'required|date',
        'to' => 'required_if:is_now,0|date',
        'institution' => 'required|string',
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-permanent-civil-servants",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Get list of p11 permanent civil servants data inside the table",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/p11-permanent-civil-servants/{id}",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Get specific p11 permanent civil servants data",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 permanent civil servants id"
     *   )
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/p11-permanent-civil-servants",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Store p11 permanent civil servants data",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11PermanentCivilServant",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"is_now", "from", "institution"},
     *          @SWG\Property(property="is_now", type="integer", enum={0,1}, description="Still a civil servant in the institution? (yes == 1, no == 0)", example=0),
     *          @SWG\Property(property="from", type="string", format="date", description="Working from [format date: Y-m-d]", example="2016-01-01"),
     *          @SWG\Property(property="to", type="string", format="date", description="Working to [format date: Y-m-d, required if is_now == 0]", example="2018-11-30"),
     *          @SWG\Property(property="institution", type="string", description="Name of the institution", example="Health Ministry")
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $permanentCivilServantData = $request->only($this->fillable);
        $permanentCivilServantData['profile_id'] = $this->authProfileId;

        if ($permanentCivilServantData['is_now'] == 1) {
            $permanentCivilServantData['to'] = date('Y-m-d');
            $this->model::where('is_now',1)->where('profile_id',$this->authProfileId)->update(['is_now' => 0]);
        }

        $record = $this->model::create($permanentCivilServantData);

        if ($record) {
            $profile = $record->profile;

            if($profile->permanent_civil_servant == 0) {
                $profile->fill(['permanent_civil_servant' => 1])->save();
            }

            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update',['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-permanent-civil-servants/{id}",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Update specific p11 permanent civil servants data",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@update, permission:P11 Access",
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
     *       description="P11 permanent civil servants id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11PermanentCivilServant",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "is_now", "from", "institution"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="is_now", type="integer", enum={0,1}, description="Still a civil servant in the institution? (yes == 1, no == 0)", example=0),
     *          @SWG\Property(property="from", type="string", format="date", description="Working from [format date: Y-m-d]", example="2016-01-01"),
     *          @SWG\Property(property="to", type="string", format="date", description="Working to [format date: Y-m-d, required if is_now == 0]", example="2018-11-30"),
     *          @SWG\Property(property="institution", type="string", description="Name of the institution", example="Health Ministry")
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validate = $this->validate($request, $this->rules);

        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        if ($record) {
            $profile = $record->profile;

            if($profile->permanent_civil_servant == 0) {
                $profile->fill(['permanent_civil_servant' => 1])->save();
            }
        }

        if ($validate['is_now'] == 1) {
            $validate['to'] = date('Y-m-d');
            $this->model::where('is_now',1)->where('profile_id',$this->authProfileId)->update(['is_now' => 0]);
        }

        $record->fill($validate);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $record->save();

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-permanent-civil-servants/lists",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Get list of p11 permanent civil servants data related to logged in profile / user",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function lists()
    {
        $records = $this->model::where('profile_id', $this->authProfileId)->orderBy('to','DESC')->orderBy('is_now', 'DESC')->get();

        if ($records) {
            return response()->success(__('crud.success.default'), $records);
        }

        return response()->error(__('crud.error.default'), 200);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-permanent-civil-servants/update-is-now",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Update p11 permanent civil servants is_now data",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@updateIsNow, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11PermanentCivilServant",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="P11 permanent civil servants id", example=1)
     *      )
     *   )
     * )
     */
    public function updateIsNow(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer']);
        $this->model::where('is_now',1)->where('profile_id',$this->authProfileId)->update(['is_now' => 0]);
        $record = $this->model::find($validatedData['id']);
        if ($record->is_now == 1) {
            $record->is_now = 0;
        } else {
            $record->is_now = 1;
            $record->to = date('Y-m-d');
        }
        $saved = $record->save();

        if (!$saved) {
            return response()->error(__('crud.error.default'), 500);
        }

        $records = $this->model::where('profile_id', $this->authProfileId)->orderBy('to','DESC')->orderBy('is_now', 'DESC')->get();

        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-permanent-civil-servants/{id}",
     *   tags={"P11 permanent civil servants / Are you or have you ever been a permanent civil servant in your government's employ?"},
     *   summary="Delete p11 permanent civil servants data",
     *   description="File: app\Http\Controllers\API\P11PermanentCivilServantController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 permanent civil servants id"
     *    ),
     * )
     *
     */
}
