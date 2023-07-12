<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\UserTrait;
use Illuminate\Support\Facades\Auth;

class P11RelativesEmployedByPublicIntOrgController extends Controller
{
    use CRUDTrait, UserTrait;

    const MODEL = 'App\Models\P11\P11RelativesEmployedByPublicIntOrg';
    const SINGULAR = 'relatives employed by public international organization';

    const FILLABLE = [
        'first_name', 'middle_name', 'family_name', 'full_name', 'relationship',
        'job_title', 'profile_id', 'country_id'
    ];

    const RULES = [
        'first_name' => 'required|string|max:255',
        'middle_name' => 'sometimes|nullable|string',
        'family_name' => 'required|string|max:255',
        'relationship' => 'required|string',
        'job_title' => 'required|string',
        'country_id' => 'required|integer',
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-relatives-employed",
     *   tags={"P11 Relatives Employed by iMMAP"},
     *   summary="Get list of all p11 relatives employed by iMMAP inside the table",
     *   description="File: app\Http\Controllers\API\P11RelativesEmployedByPublicIntOrgController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/p11-relatives-employed/{id}",
     *   tags={"P11 Relatives Employed by iMMAP"},
     *   summary="Get specific p11 relatives employed by iMMAP data",
     *   description="File: app\Http\Controllers\API\P11RelativesEmployedByPublicIntOrgController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 relative employed id"
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
     *   path="/api/p11-relatives-employed",
     *   tags={"P11 Relatives Employed by iMMAP"},
     *   summary="Store p11 relatives employed by iMMAP data",
     *   description="File: app\Http\Controllers\API\P11RelativesEmployedByPublicIntOrgController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11RelativeEmployed",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"first_name", "family_name", "relationship", "job_title", "country_id"},
     *          @SWG\Property(property="first_name", type="string", description="First name of the relatives", example="John"),
     *          @SWG\Property(property="middle_name", type="string", description="Middle name of the relatives [not required]", example=""),
     *          @SWG\Property(property="family_name", type="string", description="Family name of the relatives", example="Doe"),
     *          @SWG\Property(property="relationship", type="string", description="Relationship between the user and the relatives", example="uncle"),
     *          @SWG\Property(property="job_title", type="string", description="Relative job title in iMMAP", example="IT Manager"),
     *          @SWG\Property(property="country_id", type="integer", description="Country where the relatives worked with iMMAP", example=22)
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

        $referenceData = $this->getFullName($referenceData);
        $record = $this->model::create($referenceData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-relatives-employed/{id}",
     *   tags={"P11 Relatives Employed by iMMAP"},
     *   summary="Update p11 relatives employed by iMMAP data",
     *   description="File: app\Http\Controllers\API\P11RelativesEmployedByPublicIntOrgController@update, permission:P11 Access",
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
     *       description="P11 relative employed id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11RelativeEmployed",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "first_name", "family_name", "relationship", "job_title", "country_id"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="first_name", type="string", description="First name of the relatives", example="John"),
     *          @SWG\Property(property="middle_name", type="string", description="Middle name of the relatives [not required]", example=""),
     *          @SWG\Property(property="family_name", type="string", description="Family name of the relatives", example="Doe"),
     *          @SWG\Property(property="relationship", type="string", description="Relationship between the user and the relatives", example="uncle"),
     *          @SWG\Property(property="job_title", type="string", description="Relative job title in iMMAP", example="IT Manager"),
     *          @SWG\Property(property="country_id", type="integer", description="Country where the relatives worked with iMMAP", example=22)
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, int $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $relative = $this->model::findOrFail($id);
        $referenceData = $request->only($this->fillable);

        $referenceData = $this->getFullName($referenceData);
        $record = $relative->fill($referenceData)->save();

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-relatives-employed/lists",
     *   tags={"P11 Relatives Employed by iMMAP"},
     *   summary="Get list of all p11 relatives employed by iMMAP related to the logged in user / profile",
     *   description="File: app\Http\Controllers\API\P11RelativesEmployedByPublicIntOrgController@lists, permission:P11 Access",
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
     *   path="/api/p11-relatives-employed/{id}",
     *   tags={"P11 Relatives Employed by iMMAP"},
     *   summary="Delete p11 relatives employed by iMMAP data",
     *   description="File: app\Http\Controllers\API\P11RelativesEmployedByPublicIntOrgController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 relative employed id"
     *    ),
     * )
     *
     */
}
