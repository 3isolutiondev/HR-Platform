<?php

namespace App\Http\Controllers\API\SecurityModule;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Country;
use App\Models\SecurityModule\HighRiskCity;
use Illuminate\Support\Arr;
use App\Traits\iMMAPerTrait;

/**
 * Manage Security Advisors
 * - Get list of country security advisors
 * - Get list of global security advisors
 * - Assign country security advisor to certains country
 * - Country security advisor can approve only countries that has been assign to him
*/
class SecurityAdvisorController extends Controller
{
    protected function processAdvisors($advisors, $permissions)
    {
        if (!empty($advisors)) {
            $advisors = $advisors->filter(function($advisor, $key) use ($permissions) {
                return !$advisor->hasAnyPermission($permissions);
            });
            if (!empty($advisors)) {
                $advisors = $advisors->map(function($advisor) {
                    $advisor->role = $advisor->roles->first()->name;

                    return $advisor;
                })->flatten(1)->values()->all();
            }
        }
        return $advisors;
    }

    /**
     * @SWG\GET(
     *   path="/api/security-module/security-advisors/{securityType}",
     *   tags={"Security Module"},
     *   summary="Get all list of security advisors",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@index, Permission: Manage Security Module",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="securityType",
     *      in="path",
     *      type="string",
     *      enum={"national", "global", "immaper"},
     *      description="national / global security advisor / iMMAPer who can view other travel request"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function index($securityType = 'national')
    {
        $advisorsList = [];
        if ($securityType == 'national') {
            $advisors = User::select('id', 'full_name as name')->with('officer_country:id,name,country_code')->permission('Approve Domestic Travel Request')->orderByDesc('id')->get();
            $advisorsList = $this->processAdvisors($advisors, ['Approve Global Travel Request']);
        }

        if ($securityType == 'global') {
            $advisors = User::select('id', 'full_name as name')->permission('Approve Domestic Travel Request')->permission('Approve Global Travel Request')->orderByDesc('id')->get();
            $advisorsList = $this->processAdvisors($advisors, ['Set as Admin']);
        }

        if ($securityType == 'immaper') {
            $advisors = User::select('id', 'full_name as name')->with('officer_country:id,name,country_code')->permission('View Other Travel Request')->orderByDesc('id')->get();
            $advisorsList = $this->processAdvisors($advisors, ['Set as Admin', 'Approve Domestic Travel Request', 'Approve Global Travel Request']);
        }

        return response()->success(__('crud.success.default'), $advisorsList);
    }

    /**
     * @SWG\Post(
     *   path="/api/security-module/security-advisors/national/assign-countries/user/{id}",
     *   tags={"Security Module"},
     *   summary="Assign country Security Advisor with the country(ies) he/she responsible with",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@assign, Permission: Manage Security Module",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      type="integer",
     *      description="User id"
     *   ),
     *   @SWG\Parameter(
     *      name="assignImmaper",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"selectedCountries"},
     *          @SWG\Property(
     *              property="selectedCountries", type="array", description="Selected Countries for the iMMAPer",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="integer", description="Country id", example=0)
     *              )
     *          )
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function assign(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validatedData = $this->validate($request, [ 'selectedCountries' => 'required|array', 'selectedCountries.*.value' => 'required|integer|exists:countries,id']);

        $updated = $user->officer_country()->sync(Arr::pluck($request->selectedCountries, 'value'));

        if ($updated) {
            return response()->success(__('crud.success.default'));
        }

        return response()->error(__('crud.error.default'));
    }

    /**
     * @SWG\Post(
     *   path="/api/security-module/security-advisors/immaper/assign-countries/user/{id}",
     *   tags={"Security Module"},
     *   summary="Assign country to iMMAPer who can view other travel request",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@assignImmaper, Permission: Manage Security Module",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      type="integer",
     *      description="User id"
     *   ),
     *   @SWG\Parameter(
     *      name="assignImmaper",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"selectedCountries"},
     *          @SWG\Property(
     *              property="selectedCountries", type="array", description="Selected Countries for the iMMAPer",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="integer", description="Country id", example=0)
     *              )
     *          )
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function assignImmaper(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validatedData = $this->validate($request, [ 'selectedCountries' => 'required|array', 'selectedCountries.*.value' => 'required|integer|exists:countries,id']);

        $updated = $user->officer_country()->sync(Arr::pluck($request->selectedCountries, 'value'));

        if ($updated) {
            return response()->success(__('crud.success.default'));
        }

        return response()->error(__('crud.error.default'));
    }

    /**
     * @SWG\GET(
     *   path="/api/security-module/security-advisors/national/user/{id}/countries",
     *   tags={"Security Module"},
     *   summary="Get list of country(ies) where country security advisor is responsible with",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@getCountries, Permission: Manage Security Module",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      type="integer",
     *      description="User id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getCountries($id)
    {
        $user = User::findOrFail($id);
        if ($user::has('officer_country')->get()) {
            $countries = $user->officer_country()->select('id', 'id as value', 'name as label', 'country_code')->get();
            return response()->success(__('crud.success.default'), $countries);
        }

        return response()->success(__('crud.success.default'), []);
    }

    /**
     * @SWG\GET(
     *   path="/api/security-module/security-advisors/immaper/user/{id}/countries",
     *   tags={"Security Module"},
     *   summary="Get list of country(ies) where country security advisor is responsible with",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@getImmaperCountries, Permission: Manage Security Module",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      type="integer",
     *      description="User id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getImmaperCountries($id)
    {
        $user = User::findOrFail($id);
        if ($user::has('officer_country')->get()) {
            $countries = $user->officer_country()->select('id', 'id as value', 'name as label', 'country_code')->get();
            return response()->success(__('crud.success.default'), $countries);
        }

        return response()->success(__('crud.success.default'), []);
    }

    /**
     * @SWG\GET(
     *   path="/api/security-module/countries/{country_id}",
     *   tags={"Security Module"},
     *   summary="Get list of country data for risk location form",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@getCountry, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="country_id",
     *      in="path",
     *      type="integer",
     *      required=true,
     *      description="Country id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getCountry($country_id)
    {
        $country = Country::select('id', 'name', 'is_high_risk')->with([
            'high_risk_cities' => function($query) {
                $query->orderBy('id', 'desc');
            }
            ])->findOrFail($country_id);

        return response()->success(__('crud.success.default'), $country);
    }

    /**
     * @SWG\Post(
     *   path="/api/security-module/countries/set-high-risk",
     *   tags={"Security Module"},
     *   summary="Set the whole country in high risk condition",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@setHighRisk, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="highRiskCity",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"country_id", "is_high_risk"},
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=10),
     *          @SWG\Property(property="is_high_risk", type="integer", enum={0,1}, description="Is the whole country high risk? (1 = yes, 0 = no)", example=1)
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setHighRisk(Request $request)
    {
        $validatedData = $this->validate($request, ['country_id' => 'required|integer|exists:countries,id', 'is_high_risk' => 'required|boolean']);

        $country = Country::findOrFail($validatedData['country_id']);
        $country->fill(['is_high_risk' => $validatedData['is_high_risk']])->save();

        return response()->success(__('crud.success.default'), []);
    }

    /**
     * @SWG\Post(
     *   path="/api/security-module/risk-location/add",
     *   tags={"Security Module"},
     *   summary="Add city to high risk condition",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@saveHighRiskCity, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="highRiskCity",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"city", "is_high_risk", "country_id"},
     *          @SWG\Property(property="city", type="string", description="City name", example="Baghdad"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=10),
     *          @SWG\Property(property="is_high_risk", type="integer", enum={0,1}, description="Is the whole country high risk? (1 = yes, 0 = no)", example=1)
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function saveHighRiskCity(Request $request)
    {
        $validatedData = $this->validate($request, [
            'city' => 'required|string',
            'is_high_risk' => 'required|boolean',
            'country_id' => 'required|integer|exists:countries,id'
        ]);

        $country = HighRiskCity::create($validatedData);

        if ($country) {
            return response()->success(__('crud.success.store', ['singular' => 'High risk city']), $country);
        }

        return response()->error(__('crud.error.store', ['singular' => 'high risk city']), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/security-module/risk-location/edit/{city_id}",
     *   tags={"Security Module"},
     *   summary="Edit city to data related to high risk condition",
     *   description="File: app\Http\Controllers\API\SecurityAdvisorController@editHighRiskCity, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="city_id",
     *      in="path",
     *      type="integer",
     *      required=true,
     *      description="High risk city id"
     *   ),
     *   @SWG\Parameter(
     *      name="highRiskCity",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"city", "is_high_risk", "country_id"},
     *          @SWG\Property(property="city", type="string", description="City name", example="Baghdad"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=10),
     *          @SWG\Property(property="is_high_risk", type="integer", enum={0,1}, description="Is the whole country high risk? (1 = yes, 0 = no)", example=1)
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function editHighRiskCity(Request $request, $city_id)
    {
        $validatedData = $this->validate($request, [
            'city' => 'required|string',
            'is_high_risk' => 'required|boolean',
            'country_id' => 'required|integer|exists:countries,id'
        ]);

        $country = HighRiskCity::findOrFail($city_id);

        $country->fill($validatedData)->save();

        if ($country) {
            return response()->success(__('crud.success.update', ['singular' => 'High risk city']), $country);
        }

        return response()->error(__('crud.error.update', ['singular' => 'high risk city']), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/security-module/risk-location/edit/{city_id}",
     *   tags={"Security Module"},
     *   summary="Delete high risk city",
     *   description="File: app\Http\Controllers\API\CountryController@deleteHighRiskCity, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="High risk city id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function deleteHighRiskCity($city_id)
    {
        $record = HighRiskCity::findOrFail($city_id);
        if (!$record) {
            return response()->error(__('crud.error.not_found'), 404);
        }
        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => 'High risk city']));
    }

    /**
     * @SWG\GET(
     *   path="/api/security-module/security-advisors/get-view-only-immaper",
     *   tags={"Security Module"},
     *   summary="Get iMMAPer who has 'View Other Travel Request' permission",
     *   description="File: app\Http\Controllers\API\UserController@getViewOnlyImmaper, permission:Manage Security Module",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="keyword", in="query", type="string", description="Search Keyword"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function getViewOnlyImmaper(Request $request)
    {
        $validatedData = $this->validate($request, ['keyword' => 'sometimes|nullable|string']);

        $immapers = $this->iMMAPerFromUserQuery(User::select('id', 'email', 'full_name')
            ->where('p11Completed', 1)
            ->permission('View Other Travel Request'))->doesntHave('officer_country');

        return response()->success(__('crud.success.default'), $immapers);
    }
}
