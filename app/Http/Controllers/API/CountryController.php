<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class CountryController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Country';
    const SINGULAR = 'country';

    const FILLABLE = [
        'name', 'country_code', 'nationality', 'phone_code', 'flag', 'seen_in_p11',
        'seen_in_security_module', 'vehicle_filled_by_immaper'
    ]; // seen_in_security_module and vehicle_filled_by_immaper is part of security module

    const RULES = [
        'name' => 'required|string|max:255',
        'country_code' => 'required|string|max:3',
        'nationality' => 'required|string',
        'phone_code' => 'required|string|min:1|max:7',
        'flag' => 'sometimes|nullable|url',
        'seen_in_p11' => 'required|boolean',
        'seen_in_security_module' => 'required|boolean',
        'vehicle_filled_by_immaper' => 'sometimes|nullable|string|in:yes,no'
    ];

    /**
     * @SWG\Get(
     *   path="/api/countries",
     *   tags={"Country"},
     *   summary="Get All Country Data",
     *   description="File: app\Http\Controllers\API\CountryController@index, Permission: Index Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/countries/{id}",
     *   tags={"Country"},
     *   summary="Get Specific Country Data",
     *   description="File: app\Http\Controllers\API\CountryController@show, Permission: Show Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="country id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

     /**
     * @SWG\Get(
     *   path="/api/countries/p11",
     *   tags={"Country"},
     *   summary="Get All Country Data only for Profile Creation features (seen_in_p11 == 1)",
     *   description="File: app\Http\Controllers\API\CountryController@index, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function forP11()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label', 'country_code')->where('seen_in_p11',1)->orderBy('name','asc')->get());
    }

    /**
     * @SWG\Post(
     *   path="/api/countries",
     *   tags={"Country"},
     *   summary="Store Country Data",
     *   description="File: app\Http\Controllers\API\CountryController@store, Permission: Add Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="role",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"name", "country_code", "nationality", "phone_code", "seen_in_p11", "seen_in_security_module"},
     *              @SWG\Property(property="name", type="string", description="Name of the country", example="Indonesia"),
     *              @SWG\Property(property="country_code", type="string", maxLength=3, description="country code", example="id"),
     *              @SWG\Property(property="nationality", type="string", description="nationality", example="Indonesian"),
     *              @SWG\Property(property="phone_code", type="string", minLength=1, maxLength=7, description="phone code", example="+62"),
     *              @SWG\Property(property="flag", type="string", description="link to country flag", example="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/id.svg"),
     *              @SWG\Property(property="seen_in_p11", type="integer", enum={0,1}, description="seen in p11 (0 == cannot be seen in p11, 1 == can be seen in p11)", example=1),
     *              @SWG\Property(property="seen_in_security_module", type="integer", enum={0,1}, description="seen in security module (0 == cannot be seen in security module, 1 == can be seen in security module)", example=1),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $countryData = $request->only($this->fillable);
        $countryData['language_slug'] = str_slug($request->language);

        $record = $this->model::create($countryData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/countries/{id}",
     *   tags={"Country"},
     *   summary="Update Country Data",
     *   description="File: app\Http\Controllers\API\CountryController@update, Permission: Edit Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="country id"),
     *   @SWG\Parameter(
     *          name="country",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "name", "country_code", "nationality", "phone_code", "seen_in_p11", "seen_in_security_module"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="name", type="string", description="Name of the country", example="Indonesia"),
     *              @SWG\Property(property="country_code", type="string", maxLength=3, description="country code", example="id"),
     *              @SWG\Property(property="nationality", type="string", description="nationality", example="Indonesian"),
     *              @SWG\Property(property="phone_code", type="string", minLength=1, maxLength=7, description="phone code", example="+62"),
     *              @SWG\Property(property="flag", type="string", description="link to country flag", example="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/id.svg"),
     *              @SWG\Property(property="seen_in_p11", type="integer", enum={0,1}, description="seen in p11 (0 == cannot be seen in p11, 1 == can be seen in p11)", example=1),
     *              @SWG\Property(property="seen_in_security_module", type="integer", enum={0,1}, description="seen in security module (0 == cannot be seen in security module, 1 == can be seen in security module)", example=1),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update(Request $request, $id)
    {
        // $validatedData = $this->validate($request, $this->rules);
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::findOrFail($id);

        $countryData = $request->only($this->fillable);

        if($record->language_slug !== str_slug($request->language)) {
            $countryData['language_slug'] = str_slug($request->language);
        }

        $record->fill($countryData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/countries/{id}",
     *   tags={"Country"},
     *   summary="Delete Country Data",
     *   description="File: app\Http\Controllers\API\CountryController@destroy, Permission: Delete Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="country id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/countries/set-seen-in-p11",
     *   tags={"Country"},
     *   summary="Update seen_in_p11 data for specific country",
     *   description="File: app\Http\Controllers\API\CountryController@setSeenInP11, Permission: Edit Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="country",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "id"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="id", type="integer", description="id should be exists in id column in countries table", example=1),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setSeenInP11(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer|exists:countries,id']);
        $record = $this->model::findOrFail($validatedData['id']);

        $updated = $record->fill(['seen_in_p11' => $record->seen_in_p11 == 1 ? 0 : 1 ])->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /*
    * Create a new function setSeenInSecurityModule
    *
    */

    /**
     * @SWG\Post(
     *   path="/api/countries/set-seen-in-security-module",
     *   tags={"Country"},
     *   summary="Update seen_in_security_module data for specific country",
     *   description="File: app\Http\Controllers\API\CountryController@setSeenInSecurityModule, Permission: Add Country|Edit Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="country",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "id"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="id", type="integer", description="id should be exists in id column in countries table", example=1),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setSeenInSecurityModule(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer|exists:countries,id']);
        $record = $this->model::findOrFail($validatedData['id']);

        $updated = $record->fill(['seen_in_security_module' => $record->seen_in_security_module == 1 ? 0 : 1 ])->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/countries/set-vehicle-filled-by-immaper",
     *   tags={"Country"},
     *   summary="Update seen_in_security_module data for specific country",
     *   description="File: app\Http\Controllers\API\CountryController@setVehicleFilledByiMMAPer, Permission: Add Country|Edit Country",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="country",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "id"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="id", type="integer", description="id should be exists in id column in countries table", example=1),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function setVehicleFilledByiMMAPer(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer|exists:countries,id']);
        $record = $this->model::findOrFail($validatedData['id']);

        $updated = $record->fill(['vehicle_filled_by_immaper' => $record->vehicle_filled_by_immaper == 'yes' ? 'no' : 'yes' ])->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Get(
     *   path="/api/countries/nationalities",
     *   tags={"Country"},
     *   summary="Get All Nationalities from countries table with {value: 1, label:Indonesia, country_code: id} format",
     *   description="File: app\Http\Controllers\API\CountryController@nationalities, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function nationalities()
    {
        $nationalities = $this->model::select('id as value', 'nationality as label', 'country_code')->orderBy('nationality','asc')->get();

        return response()->success(__('crud.success.default'), $nationalities);
    }

    /**
     * @SWG\Get(
     *   path="/api/countries/all",
     *   tags={"Country"},
     *   summary="Get All Country data with {value: 1, label:Indonesia} format",
     *   description="File: app\Http\Controllers\API\CountryController@allCountries, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function allCountries()
    {
        $countries = $this->model::select('id as value', 'name as label')->orderBy('name','asc')->get();

        return response()->success(__('crud.success.default'), $countries);
    }

    /**
     * @SWG\Get(
     *   path="/api/countries/phone-codes",
     *   tags={"Country"},
     *   summary="Get All Phone Codes data with {value: +62, label:Indonesia} format",
     *   description="File: app\Http\Controllers\API\CountryController@phoneCodes, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function phoneCodes()
    {
        return response()->success(__('crud.success.default'), $this->model::select('phone_code as value', 'phone_code as label')->orderBy('name','asc')->distinct()->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/countries/country-code-with-flag",
     *   tags={"Country"},
     *   summary="Get All Phone Codes data with {country: Indonesia, flag_base64: https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/id.svg, calling_code: +62} format",
     *   description="File: app\Http\Controllers\API\CountryController@countryCodeWithFlag, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function countryCodeWithFlag()
    {
        return response()->success(__('crud.success.default'), $this->model::select('name as country','flag as flag_base64','phone_code as calling_code')->orderBy('name', 'asc')->distinct()->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/countries",
     *   tags={"Country", "Security Module"},
     *   summary="Get all countries that can be seen for security module form with array of {value: 1, label: Indonesia, country_code: id} format",
     *   description="File: app\Http\Controllers\API\CountryController@securityCountries, Permission: Can Make Travel Request|Manage Security Module|Approve National Travel Request|Approve Global Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function securityCountries()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label', 'country_code', 'vehicle_filled_by_immaper')->where('seen_in_security_module',1)->orderBy('name','asc')->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/risk-locations/countries",
     *   tags={"Country", "Security Module"},
     *   summary="Get all countries for Risk Locations page",
     *   description="File: app\Http\Controllers\API\CountryController@riskLocationCountries, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function riskLocationCountries()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id', 'name', 'is_high_risk')->withCount(['high_risk_cities'])->orderBy('id','desc')->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/notify-countries",
     *   tags={"Security Module"},
     *   summary="Get all countries with its email list",
     *   description="File: app\Http\Controllers\API\CountryController@notifyCountries, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function notifyCountries()
    {
        $countries = $this->model::select('id', 'name')->where('seen_in_security_module',1)->orderBy('name','asc')->get();
        foreach($countries as &$country) {
            $country->emails = $country->notifyEmails->pluck('email');
            unset($country->notifyEmails);
        }
        return response()->success(__('crud.success.default'), $countries);
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/notify-settings/{id}",
     *   tags={"Security Module"},
     *   summary="Update email lists by country",
     *   description="File: app\Http\Controllers\API\CountryController@getNotifyEmailsByCountry, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="country id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getNotifyEmailsByCountry($id)
    {

        $country = $this->model::findOrFail($id);
        $emailLists = [];

        if (!empty($country->notifyEmails)) {
            $emailLists = $country->notifyEmails()->select('country_id', 'email')->get();
        }

        return response()->success(__('crud.success.default'), $emailLists);
    }

    /**
     * @SWG\POST(
     *   path="/api/security-module/notify-settings",
     *   tags={"Country", "Security Module"},
     *   summary="Get all countries with its email list",
     *   description="File: app\Http\Controllers\API\CountryController@updateNotifyEmailsByCountry, Permission: Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="country id"),
     *   @SWG\Parameter(
     *          name="country",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="emails", type="array", description="All the emails and country_id data assign for this country",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="email", type="string", description="Email address", example="careers@organization.org"),
     *                      @SWG\Property(property="country_id", type="integer", description="Conutry id", example=1)
     *                  )
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function updateNotifyEmailsByCountry(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'emails' => 'sometimes|nullable|array',
            'emails.*.email' => 'sometimes|nullable|email',
            'emails.*.country_id' => 'sometimes|nullable|integer|exists:countries,id'
        ]);

        $country = $this->model::findOrFail($id);
        $country->notifyEmails()->delete();

        if (!empty($validatedData['emails'])) {
            foreach($validatedData['emails'] as $emails) {
                \App\Models\SecurityModule\NotifyTravelSetting::updateOrCreate($emails);
            }

        }

        return response()->success(__('crud.success.default'));
    }
}
