<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Profile;

class P11ReferenceController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Reference';
    const SINGULAR = 'Reference';

    const FILLABLE = [
        'full_name', 'organization', 'country_id', 'phone', 'email', 'job_position', 'profile_id'
    ];

    const RULES = [
        'full_name' => 'required|string|max:255',
        'country_id' => 'required|integer',
        'email' => 'required|email|string',
        'job_position' => 'required|string|max:255',
        'organization' => 'required|string|max:255'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-references",
     *   tags={"P11 References / Profile References List"},
     *   summary="Get list of p11 reference data inside the table",
     *   description="File: app\Http\Controllers\API\P11ReferenceController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/p11-references/{id}",
     *   tags={"P11 References / Profile References List"},
     *   summary="Get specific p11 reference data",
     *   description="File: app\Http\Controllers\API\P11ReferenceController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 reference id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        return response()->success(__('crud.success.default'), $this->model::with('country')->where('profile_id', $this->authProfileId)->findOrFail($id));
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-references",
     *   tags={"P11 References / Profile References List"},
     *   summary="Store p11 reference data",
     *   description="File: app\Http\Controllers\API\P11ReferenceController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Reference",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"full_name", "country_id", "email", "job_position", "organization"},
     *          @SWG\Property(property="full_name", type="string", description="Reference name", example="Mr. John Doe"),
     *          @SWG\Property(property="country_id", type="integer", description="Country where the reference lived [country id] ", example=20),
     *          @SWG\Property(property="email", type="string", description="Reference email", example="johndoe@mail.com"),
     *          @SWG\Property(property="job_position", type="string", description="Reference job position", example="IT Manager"),
     *          @SWG\Property(property="organization", type="string", description="Reference organization", example="iMMAP")
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $referenceData = $request->only($this->fillable);
        $referenceData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($referenceData);

        if ($record) {
            Profile::where('id', $this->authProfileId)->update(['reference_notice_read' => 1]);
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-references/lists",
     *   tags={"P11 References / Profile References List"},
     *   summary="Get list of all p11 reference data related to logged in user / profile",
     *   description="File: app\Http\Controllers\API\P11ReferenceController@lists, permission:P11 Access",
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
     *   path="/api/p11-references/{id}",
     *   tags={"P11 References / Profile References List"},
     *   summary="Update p11 reference data",
     *   description="File: app\Http\Controllers\API\P11ReferenceController@update, permission:P11 Access",
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
     *       description="P11 reference id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11Reference",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "full_name", "country_id", "email", "job_position", "organization"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="full_name", type="string", description="Reference name", example="Mr. John Doe"),
     *          @SWG\Property(property="country_id", type="integer", description="Country where the reference lived [country id] ", example=20),
     *          @SWG\Property(property="email", type="string", description="Reference email", example="johndoe@mail.com"),
     *          @SWG\Property(property="job_position", type="string", description="Reference job position", example="IT Manager"),
     *          @SWG\Property(property="organization", type="string", description="Reference organization", example="iMMAP")
     *      )
     *   )
     *
     * )
     *
     **/

    /**
     * @SWG\Delete(
     *   path="/api/p11-references/{id}",
     *   tags={"P11 References / Profile References List"},
     *   summary="Delete p11 reference data",
     *   description="File: app\Http\Controllers\API\P11ReferenceController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 reference id"
     *    ),
     * )
     *
     */
}
