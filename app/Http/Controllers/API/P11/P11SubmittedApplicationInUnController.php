<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;

/**
 * At first it used to save profile who already worked with UN, and it's changed to save profile who worked with iMMAP
 */
class P11SubmittedApplicationInUnController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11SubmittedApplicationInUn';
    const SINGULAR = 'previously worked with iMMAP';

    const FILLABLE = ['starting_date', 'ending_date', 'country_id', 'project', 'profile_id', 'immap_office_id', 'line_manager', 'duty_station' ,'position'];

    const RULES = [
        'starting_date' => 'required|date',
        'ending_date' => 'required|date',
        'country_id' => 'required|integer',
        'project' => 'sometimes|nullable|string',
        'immap_office_id' => 'required|integer|exists:immap_offices,id',
        'line_manager' => 'required|string',
        'duty_station' => 'required|string',
        'position' => 'required|string',
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-submitted-application-in-un",
     *   tags={"P11 Submitted Application In UN / Previously worked with iMMAP"},
     *   summary="Get list of all p11 submitted application in un data inside the table",
     *   description="File: app\Http\Controllers\API\P11SubmittedApplicationInUnController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/p11-submitted-application-in-un/{id}",
     *   tags={"P11 Submitted Application In UN / Previously worked with iMMAP"},
     *   summary="Get list of specific p11 submitted application in un data",
     *   description="File: app\Http\Controllers\API\P11SubmittedApplicationInUnController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 submitted application in un id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        return response()->success(__('crud.success.default'), $this->model::with(['country','immap_office','immap_office.country'])->findOrFail($id));
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-submitted-application-in-un",
     *   tags={"P11 Submitted Application In UN / Previously worked with iMMAP"},
     *   summary="Store p11 submitted application in un data",
     *   description="File: app\Http\Controllers\API\P11SubmittedApplicationInUnController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11SubmittedApplicationInUn",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"starting_date", "ending_date", "country_id", "immap_office_id","line_manager", "duty_station", "position"},
     *          @SWG\Property(property="starting_date", type="string", format="date", description="Starting date working with iMMAP [date format: Y-m-d]", example="2017-01-20"),
     *          @SWG\Property(property="ending_date", type="string", format="date", description="Ending date working with iMMAP [date format: Y-m-d]", example="2018-01-20"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=1),
     *          @SWG\Property(property="project", type="string", description="Project name", example="G&A Communication"),
     *          @SWG\Property(property="immap_office_id", type="integer", description="iMMAP office id", example=1),
     *          @SWG\Property(property="line_manager", type="string", description="Line manager", example="Mr. John Doe"),
     *          @SWG\Property(property="duty_station", type="string", description="Duty station", example="Amman"),
     *          @SWG\Property(property="position", type="string", description="Job position", example="IMO")
     *      )
     *   )
     * )
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $validatedData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($validatedData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->success(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

     /**
     * @SWG\Post(
     *   path="/api/p11-submitted-application-in-un/{id}",
     *   tags={"P11 Submitted Application In UN / Previously worked with iMMAP"},
     *   summary="Update p11 submitted application in un data",
     *   description="File: app\Http\Controllers\API\P11SubmittedApplicationInUnController@update, permission:P11 Access",
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
     *       description="P11 submitted application in un id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11SubmittedApplicationInUn",
     *      in="body",
     *      @SWG\Schema(
     *          required={"_method", "starting_date", "ending_date", "country_id", "immap_office_id",
     *              "line_manager", "duty_station", "position"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="starting_date", type="string", format="date", description="Starting date working with iMMAP [date format: Y-m-d]", example="2017-01-20"),
     *          @SWG\Property(property="ending_date", type="string", format="date", description="Ending date working with iMMAP [date format: Y-m-d]", example="2018-01-20"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=1),
     *          @SWG\Property(property="project", type="string", description="Project name", example="G&A Communication"),
     *          @SWG\Property(property="immap_office_id", type="integer", description="iMMAP office id", example=1),
     *          @SWG\Property(property="line_manager", type="string", description="Line manager", example="Mr. John Doe"),
     *          @SWG\Property(property="duty_station", type="string", description="Duty station", example="Amman"),
     *          @SWG\Property(property="position", type="string", description="Job position", example="IMO")
     *      )
     *   )
     *
     * )
     *
     **/

     /**
     * @SWG\GET(
     *   path="/api/p11-submitted-application-in-un/lists",
     *   tags={"P11 Submitted Application In UN / Previously worked with iMMAP"},
     *   summary="Get list of all p11 submitted application in un data related to the logged in user / profile",
     *   description="File: app\Http\Controllers\API\P11SubmittedApplicationInUnController@index, permission:P11 Access",
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
     * @SWG\Delete(
     *   path="/api/p11-submitted-application-in-un/{id}",
     *   tags={"P11 Submitted Application In UN / Previously worked with iMMAP"},
     *   summary="Delete p11 submitted application in un data",
     *   description="File: app\Http\Controllers\API\P11SubmittedApplicationInUnController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 submitted application in un id"
     *    ),
     * )
     *
     */
}
