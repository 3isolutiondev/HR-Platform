<?php

namespace App\Http\Controllers\API\SecurityModule;

use App\Exports\TravelRequestExport;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\SecurityModule\TARRequest;
use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\MRFRequestRevision;
use App\Models\SecurityModule\TARRequestRevision;
use App\Traits\SecurityModule\TravelRequestTrait;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Http\Response as ResponseCode;
use Excel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;

// Travel Request Controller (iMMAPer POV [Travel Request Tab inside Profile page])
class TravelRequestController extends Controller
{
    use TravelRequestTrait;

    // Get data by setting Filter and Query
    protected function setFilter($travelQuery, $filterData, $requestType)
    {
        if (!empty($filterData['search'])) {
            $travelQuery = $travelQuery->whereHas('user', function($query) use ($filterData) {
                $query->search($filterData['search']);
            });
        }

        if (!empty($filterData['archiveTypes'])) {
            if (count($filterData['archiveTypes']) == 1) {
                if ($filterData['archiveTypes'][0] == 'latest') {
                    $travelQuery = $travelQuery->where('is_archived', false);
                } else {
                    $travelQuery = $travelQuery->where('is_archived', true);
                }
            }
        }

        if (!empty($filterData['offices'])) {
            $travelQuery = $travelQuery->whereHas('user.profile', function($query) use ($filterData) {
                $query->whereIn('immap_office_id', $filterData['offices']);
            });
        }

        if (!empty($filterData['submitted_from'])) {
            $travelQuery = $travelQuery->where('submitted_date', '>=', $filterData['submitted_from']);
        }

        if (!empty($filterData['submitted_to'])) {
            $travelQuery = $travelQuery->where('submitted_date', '<=', $filterData['submitted_to'] . ' 23:59:59');
        }

        if ($requestType == 'tar') {
            if (!empty($filterData['traveled_from'])) {
                $fromDate = $filterData['traveled_from'];
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($fromDate) {
                    $query->where('date_travel', '>=', $fromDate);
                });
            }
    
            if (!empty($filterData['traveled_to'])) {
                $toDate = $filterData['traveled_to'];
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($toDate) {
                    $query->where('date_travel', '<=', $toDate);
                });
            }   
        }

        if ($requestType == 'mrf') {
            if (!empty($filterData['traveled_from'])) {
                $fromDate = $filterData['traveled_from'];
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($fromDate) {
                    $query->where('date_time', '>=', $fromDate);
                });
            }
    
            if (!empty($filterData['traveled_to'])) {
                $toDate = $filterData['traveled_to'];
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($toDate) {
                    $query->where('date_time', '<=', $toDate);
                });
            }   
        }

        if (!empty($filterData['status'])) {
            $travelQuery = $travelQuery->whereIn('status', $filterData['status']);
        }

        if ($requestType == 'tar') {
            $travelQuery = $travelQuery->select('id','name','status','user_id','submitted_date','edit_on_approval','travel_type', 'travel_purpose');
            if (!empty($filterData['purposes'])) {
                $travelQuery = $travelQuery->whereIn('travel_purpose', $filterData['purposes']);
            }
        }

        if ($requestType == 'mrf') {
            $travelQuery = $travelQuery->select('id','name','country_name as country','status','user_id','submitted_date','edit_on_approval','travel_type', 'transportation_type', 'purpose');
            if (!empty($filterData['criticalities'])) {
                $travelQuery = $travelQuery->whereIn('criticality_of_the_movement', $filterData['criticalities']);
            }
        }

        if (empty($filterData['search']) && empty($filterData['archiveTypes']) && empty($filterData['offices']) && empty($filterData['submitted_from']) 
              && empty($filterData['submitted_to']) && empty($filterData['traveled_from']) && empty($filterData['traveled_to']) 
              && empty($filterData['traveled_to'])  && empty($filterData['status']) && empty($filterData['purposes']) && empty($filterData['criticalities'])) {
                 $travelQuery = $travelQuery->where('is_archived', false);
     }

        $records = $travelQuery->get();

        if ($requestType == 'tar') {
            $records = $records->map(function($record, $key) {
                $dataAsc =  $record->itineraries()->orderBy('order','asc')->first();
                $dataDesc = $record->itineraries()->orderBy('order','desc')->first();
                $dataAll = $record->itineraries()->orderBy('order','asc')->get();

                $nationality = '-';
                if (count($record->user->profile->present_nationalities) != 0) {
                        $nationality = implode(', ', Arr::pluck($record->user->profile->present_nationalities, 'nationality'));
                }

                $record->countries_export = $this->getCountriesOrCities($dataAll, 'tar');
                $record->country = $dataAsc->from_country_name . ' - ' . $dataDesc->to_country_name;
                $record->immaper = $record->user->full_name;
                $record->profile_id = $record->user->profile->id;
                $record->project_code = $record->user->profile->project_code;
                $record->job_title = $record->user->profile->job_title;
                $record->nationality = $nationality;
                $record->request_type = 'tar';
                $record->purpose = $record->travel_purpose;
                $record->travel_type = $record->travel_type;
                $record->date_travel = Carbon::parse($dataAsc->date_travel)->format('d/m/Y');
                $record->return_date_travel = $record->travel_type == 'round-trip' ? Carbon::parse($dataDesc->return_date_travel)->format('d/m/Y') : '-';
                $record->end_date = Carbon::parse($dataDesc->date_travel)->format('d/m/Y');
                $record->duty_station = $record->user->profile->duty_station;

                unset($record->user_id);
                unset($record->user);

                return $record;
            });
        }

        if ($requestType == 'mrf') {
            $records = $records->map(function($record, $key) {
                $dataAsc =  $record->itineraries()->orderBy('order','asc')->first();
                $dataDesc = $record->itineraries()->orderBy('order','desc')->first();
                $dataAll = $record->itineraries()->orderBy('order','asc')->get();

                $nationality = '-';
                if (count($record->user->profile->present_nationalities) != 0) {
                        $nationality = implode(', ', Arr::pluck($record->user->profile->present_nationalities, 'nationality'));
                }

                $record->countries_export = $record->country . ': ' . $this->getCountriesOrCities($dataAll, 'mrf');
                $record->immaper = $record->user->full_name;
                $record->profile_id = $record->user->profile->id;
                $record->project_code = $record->user->profile->project_code;
                $record->job_title = $record->user->profile->job_title;
                $record->nationality = $nationality;
                $record->request_type = 'mrf';
                $record->purpose = $record->purpose;
                $record->travel_type = $record->travel_type;
                $record->date_travel = Carbon::parse($dataAsc->date_time)->format('d/m/Y');
                $record->return_date_travel = ($record->transportation_type == 'ground-travel' || $record->transportation_type == 'air-and-ground-travel')
                          && $record->travel_type == 'round-trip' ? Carbon::parse($dataDesc->date_time)->format('d/m/Y') : $record->travel_type == 'round-trip' ? Carbon::parse($dataDesc->return_date_time)->format('d/m/Y') : '-';
                $record->end_date = Carbon::parse($dataDesc->date_time)->format('d/m/Y');
                $record->duty_station = $record->user->profile->duty_station;

                unset($record->user);
                return $record;
            });
        }

        return $records;
    }

    protected function getCountriesOrCities($travel, $type)
    {
        $countries = [];
        $cities = [];

        if ($type == 'tar') {
            foreach($travel as $country)
            {
                array_push($countries, $country->from_country_name);
                array_push($countries, $country->to_country_name);
            }

            $result = implode(' → ', $countries);
        } else {
            foreach($travel as $city)
            {
                array_push($cities, $city->from_city);
                array_push($cities, $city->to_city);
            }

            $result = implode(' → ', $cities);
        }

        return $result;
        
    }

    // Get all requests (TAR & MRF)
    protected function getAll($validatedData)
    {
        $tar = TARRequest::where('status', '<>', 'saved')->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->orderBy('submitted_date', 'desc');
        $mrf = MRFRequest::where('status', '<>', 'saved')->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->orderBy('submitted_date', 'desc');

        $user = auth()->user();
        $countries = [];
       
       //For View travel requests when the user connected has Approve Domestic Travel Request or View Other Travel Request permissions
        if (($user->hasPermissionTo('Approve Domestic Travel Request') && !$user->hasPermissionTo('Approve Global Travel Request')) ||
            $user->hasPermissionTo('View Other Travel Request')
        ) {
            $countries = $user->officer_country->pluck('id')->toArray();
            if (count($countries) > 0) {
                $tar = $tar->whereHas('itineraries', function($query) use ($countries) {
                    $query->whereIn('from_country_id', $countries)->orWhereIn('to_country_id', [$countries]);
                });

                $mrf = $mrf->whereIn('country_id', $countries);
            }
        //For SBP Manager to view all travel requests for the traveler who is working under Surge Program   
        } else if ($user->hasPermissionTo('View SBP Travel Request') && !$user->hasPermissionTo('Approve Global Travel Request')){
            $tar = $tar->whereHas('user.profile', function($query) {
                $query->where('under_sbp_program', true);
            });
            $mrf = $mrf->whereHas('user.profile', function($query) {
                $query->where('under_sbp_program', true);
            });
        //For CEOs and Operation Managers to view all approved travel requests   
        } else if ($user->hasPermissionTo('View Only On Security Page')){
            $tar = $tar->where('status','approved');
            $mrf = $mrf->where('status','approved');
        }

        $tar = $this->setFilter($tar, $validatedData, 'tar');
        $mrf = $this->setFilter($mrf, $validatedData, 'mrf');
       
        $tar = $tar->toArray();
        $mrf = $mrf->toArray();
        $requests = array_merge($tar, $mrf);
        $requests = array_reverse(Arr::sort($requests, function($value) {
            return $value['submitted_date'];
        }));

        return $requests;
    }

    // Get TAR requests only
    protected function getTAR($validatedData)
    {
        $tar = TARRequest::where('status', '<>', 'saved')->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->orderBy('submitted_date', 'desc');
        $user = auth()->user();
        $countries = [];

        //For View travel requests when the user connected has Approve Domestic Travel Request or View Other Travel Request permissions
        if (($user->hasPermissionTo('Approve Domestic Travel Request') && !$user->hasPermissionTo('Approve Global Travel Request')) ||
            $user->hasPermissionTo('View Other Travel Request')
        ) {
            $countries = $user->officer_country->pluck('id')->toArray();
            if (count($countries) > 0) {
                $tar = $tar->whereHas('itineraries', function($query) use ($countries) {
                    $query->whereIn('from_country_id', $countries)->orWhereIn('to_country_id', [$countries]);
                });
            }
         //For SBP Manager to view all travel requests for the traveler who is working under Surge Program    
        } else if ($user->hasPermissionTo('View SBP Travel Request') && !$user->hasPermissionTo('Approve Global Travel Request')){
            $tar = $tar->whereHas('user.profile', function($query) {
                $query->where('under_sbp_program', true);
            });
        //For CEOs and Operation Managers to view all approved travel requests
        } else if ($user->hasPermissionTo('View Only On Security Page')){
            $tar = $tar->where('status','approved');
        }
 
        $tar = $this->setFilter($tar, $validatedData, 'tar');

        return $tar;
    }

    // Get MRF requests only
    protected function getMRF($validatedData)
    {
        $mrf = MRFRequest::where('status', '<>', 'saved')->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->orderBy('submitted_date', 'desc');
        $user = auth()->user();
        $countries = [];

        //For View travel requests when the user connected has Approve Domestic Travel Request or View Other Travel Request permissions
        if (($user->hasPermissionTo('Approve Domestic Travel Request') && !$user->hasPermissionTo('Approve Global Travel Request')) ||
            $user->hasPermissionTo('View Other Travel Request')
        ) {
            $countries = $user->officer_country->pluck('id')->toArray();
            if (count($countries) > 0) {
                $mrf = $mrf->whereIn('country_id', $countries);
            }
        //For SBP Manager to view all travel requests for the traveler who is working under Surge Program 
        } else if ($user->hasPermissionTo('View SBP Travel Request') && !$user->hasPermissionTo('Approve Global Travel Request')){
            $mrf = $mrf->whereHas('user.profile', function($query) {
                $query->where('under_sbp_program', true);
            });
        //For CEOs and Operation Managers to view all approved travel requests
        } else if ($user->hasPermissionTo('View Only On Security Page')){
            $mrf = $mrf->where('status','approved');
        }

        $mrf = $this->setFilter($mrf, $validatedData, 'mrf');

        return $mrf;
    }

     /**
     * @SWG\Get(
     *   path="/api/security-module/travel-requests?tab={tab}&search={keyword}&status[]={status}&offices[]={office}&purposes[]={purpose}&criticalities[]={criticality}&from={from}&to={to}",
     *   tags={"Security Module"},
     *   summary="Get travel request lists for the security page",
     *   description="File: app\Http\Controllers\API\TravelRequestController@lists, Should be an iMMAPer",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="tab", in="query", type="integer", required=true, description="Tab number [0 = all travel, 1 = international (TAR), 2 = domestic (MRF)]"),
     *   @SWG\Parameter(name="search", in="query", type="string", description="Keyword"),
     *   @SWG\Parameter(name="status[]", in="query", type="array", description="List of status [submitted, approved, disapproved, revision]", @SWG\Items(type="string", enum={"submitted","approved","disapproved","revision"})),
     *   @SWG\Parameter(name="offices[]", in="query", type="array", description="List of iMMAP Office IDs", @SWG\Items(type="integer")),
     *   @SWG\Parameter(name="purposes[]", in="query", type="array", description="List of Travel Purpose IDs [exists on security_module_travel_purposes]", @SWG\Items(type="string", enum={"start-of-contract","end-of-contract","leave","work-related","rr","personal-reason"})),
     *   @SWG\Parameter(name="criticalities[]", in="query", type="array", description="List of Critical Movement IDs [exists on security_module_critical_movements]", @SWG\Items(type="string", enum={"routine", "essential", "critical"})),
     *   @SWG\Parameter(name="from", in="query", type="string", format="date", description="Period from"),
     *   @SWG\Parameter(name="to", in="query", type="string", format="date", description="Period to"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function lists(Request $request) {
        $validatedData = $this->validate($request, [
            'tab' => 'required|integer',
            'search' => 'sometimes|nullable|string',
            'archiveTypes' => 'sometimes|nullable|array',
            'archiveTypes.*' => 'sometimes|nullable|string|in:latest,archive',
            'status' => 'sometimes|nullable|array',
            'status.*' => 'sometimes|nullable|string|in:submitted,approved,disapproved,revision',
            'offices' => 'sometimes|nullable|array',
            'offices.*' => 'sometimes|nullable|integer|exists:immap_offices,id',
            'purposes' => 'sometimes|nullable|array',
            'purposes.*' => 'sometimes|nullable|string|in:start-of-contract,end-of-contract,leave,work-related,rr,personal-reason',
            'criticalities' => 'sometimes|nullable|array',
            'criticalities.*' => 'sometimes|nullable|string|in:routine,essential,critical',
            'submitted_from' => 'sometimes|nullable|date_format:Y-m-d',
            'submitted_to' => 'sometimes|nullable|date_format:Y-m-d',
            'traveled_from' => 'sometimes|nullable|date_format:Y-m-d',
            'traveled_to' => 'sometimes|nullable|date_format:Y-m-d',
        ]);

        $travelRequests = [];
        if ($validatedData['tab'] == 1) {
            //tar
            $travelRequests = $this->getTAR($validatedData);
        } elseif ($validatedData['tab'] == 2) {
            //mrf
            $travelRequests = $this->getMRF($validatedData);
        } else {
            // all
            $travelRequests = $this->getAll($validatedData);
        }
        return response()->success(__('crud.success.default'), $this->paginate($travelRequests));
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/travel-requests/{requestType}/immaper/lists/{status}",
     *   tags={"Security Module"},
     *   summary="Get travel request lists for the immaper",
     *   description="File: app\Http\Controllers\API\TravelRequestController@listsForImmaper, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="requestType", in="path", type="string", required=true, enum={"all","tar","mrf"}, description="One of travel request type: [all|tar|mrf]"),
     *   @SWG\Parameter(name="status", in="path", type="string", required=true, enum={"all","saved","submitted","approved","disapproved","revision"}, description="One of travel request status: [all|saved|submitted|approved|disapproved|revision]"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function listsForImmaper(Request $request, $requestType, $status)
    {
        $auth_user_id = auth()->user()->id;

        $travelRequests = [];
        $tar = '';
        $mrf = '';
        $todayDate = Carbon::now()->format('Y-m-d');

        if ($requestType == 'tar' || $requestType == 'all') {
            $tar = TARRequest::select('id','name','status','user_id','travel_type','submitted_date','edit_on_approval','created_at')->where('user_id', $auth_user_id)->orderBy('submitted_date', 'desc');
            if ($status !== 'all') {
                $tar->where('status', $status);
            }
            $tar = $tar->get();
            $tar = $tar->map(function($travel, $key) use($todayDate) {
                $firstItinerary = $travel->itineraries()->orderBy('order','asc')->first();
                if ($travel->travel_type == 'multi-location') {
                    $lastItinerary = $travel->itineraries()->orderBy('order','desc')->first();
                    $travel->country = $firstItinerary->from_country_name . ' - ' . $lastItinerary->to_country_name;
                } else {
                    $travel->country = $firstItinerary->from_country_name . ' - ' . $firstItinerary->to_country_name;
                }
                $travel->request_type = 'tar';
                $travel->submitted_date = is_null($travel->submitted_date) ? '-' : $travel->submitted_date;
                $travel->last_edit = $travel->status == "saved" ? auth()->user()->full_name : $travel->revisions()->orderBy('id','desc')->first()->last_edit_user->full_name;
                $travel->editable = Carbon::parse($firstItinerary->date_travel)->format('Y-m-d') > $todayDate  ? true : false;
                return $travel;
            });
        }

        if ($requestType == 'mrf' || $requestType == 'all') {
            $mrf = MRFRequest::select('id','name','country_name','status','user_id','submitted_date','edit_on_approval','created_at')->where('user_id', $auth_user_id)->orderBy('submitted_date', 'desc');
            if ($status !== 'all') {
                $mrf->where('status', $status);
            }
            $mrf = $mrf->get();
            $mrf = $mrf->map(function($travel, $key) use($todayDate) {
                $firstItinerary = $travel->itineraries()->orderBy('order','asc')->first();
                $travel->country = $travel->country_name;
                $travel->request_type = 'mrf';
                unset($travel->user);
                $travel->submitted_date = is_null($travel->submitted_date) ? '-' : $travel->submitted_date;
                $travel->last_edit = $travel->status == "saved" ? auth()->user()->full_name : $travel->revisions()->orderBy('id','desc')->first()->last_edit_user->full_name;
                $travel->editable = Carbon::parse($firstItinerary->date_time)->format('Y-m-d') >  $todayDate ? true : false;
                return $travel;
            });
        }

        if ($requestType == 'all') {
            if(!empty($tar) && !empty($mrf)) {
                $tar = $tar->toArray();
                $mrf = $mrf->toArray();
                $travelRequests = array_merge($tar, $mrf);
                $travelRequests = array_reverse(Arr::sort($travelRequests, function($value) {
                    return $value['submitted_date'];
                }));
            } else {
                return response()->error(__('crud.error.default'), 500);
            }
        }

        if ($requestType == 'tar') {
            if(!empty($tar)) {
                $travelRequests = $tar;
            } else {
                return response()->error(__('crud.error.default'), 500);
            }
        }

        if ($requestType == 'mrf') {
            if(!empty($mrf)) {
                $travelRequests = $mrf;
            } else {
                return response()->error(__('crud.error.default'), 500);
            }
        }

        return response()->success(__('crud.success.default'), $travelRequests);
    }

    // Get Travel approval data by user connected and some filters
    public function setFilterApproval($travelQuery,$requestType,$filterData){
        $authUser = auth()->user();
        $todayDate = Carbon::now()->toDateString();

        if($authUser->hasPermissionTo('Approve Global Travel Request')){
            $travelQuery = $travelQuery;
        }else if($authUser->hasAnyPermission(['Approve Domestic Travel Request','View Other Travel Request'])){
            $countries = $authUser->officer_country->pluck('id')->toArray();
            if($requestType == 'tar'){
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($countries) {
                    $query->whereIn('from_country_id', $countries)->orWhereIn('to_country_id', $countries);
                });
            }
            if($requestType == 'mrf'){
                $travelQuery = $travelQuery->whereIn('country_id', $countries);
            }
        }else if($authUser->hasPermissionTo('View SBP Travel Request')){
            $travelQuery = $travelQuery->whereHas('user.profile', function($query) {
                $query->where('under_sbp_program', true);
            });
        }else{
            $travelQuery = null;
        }

        //Filters Before data reformating 
        if(!empty($filterData['fromCities']) && $travelQuery){
            $fromCities = $filterData['fromCities'];
            if($requestType == 'tar'){
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($fromCities,$todayDate) {
                    $query->whereIn('from_city', $fromCities)->where('date_travel',$todayDate);
                });
           }

           if($requestType == 'mrf'){
            $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($fromCities,$todayDate) {
                $query->whereIn('from_city', $fromCities)->where('date_time',$todayDate);
            });
          }
        }

        if(!empty($filterData['toCities']) && $travelQuery){
            $toCities = $filterData['toCities'];
            if($requestType == 'tar'){
                $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($toCities,$todayDate) {
                    $query->whereIn('to_city', $toCities)->where('date_travel',$todayDate);
                });
           }

           if($requestType == 'mrf'){
            $travelQuery = $travelQuery->whereHas('itineraries',  function($query) use ($toCities,$todayDate) {
                $query->whereIn('to_city', $toCities)->where('date_time',$todayDate);
            });
          }
        }

        if(!empty($filterData['showImmapUs']) && $travelQuery){
            $travelQuery = $travelQuery->whereHas('user.profile',  function($query) {
                $query->Where('is_immap_inc', true);
            });
        
        }

        if(!empty($filterData['showImmapFrance']) && $travelQuery){
            $travelQuery = $travelQuery->whereHas('user.profile',  function($query){
                $query->where('is_immap_france', true);
            });
        
        }
        if($authUser->hasPermissionTo('Approve Global Travel Request')){
            if(!empty($filterData['showHiddenTrips'])){
                $travelQuery = $travelQuery;
            
            }else{
                $travelQuery = $travelQuery->where('view_status','unhide');
            }
        }
    
        if (!empty($filterData['searchImmaper'])) {
            $travelQuery = $travelQuery->whereHas('user', function($query) use ($filterData) {
                $query->search($filterData['searchImmaper']);
            });
        }
        
        $sbpRelated = !empty($filterData['showSbpRelated']) ? true : false;
        $records = $travelQuery ? $travelQuery->get() : collect([]);
       
        if ($requestType == 'tar') {
            $records = $records->map(function($record, $key) use($todayDate, $sbpRelated) {
                $dataAll =  $record->itineraries()->orderBy('order','asc')->get();
                $dataAsc =  $record->itineraries()->orderBy('order','asc')->first();
                $dataDesc = $record->itineraries()->orderBy('order','desc')->first();
    
                if($record->travel_type == 'multi-location' || $record->travel_type == 'round-trip'){
                    if($record->travel_type == 'multi-location'){
                        $cities = $dataAll->pluck('to_city')->implode(' → ');
                        $citesPath =  $dataAsc->from_city .' → '. $cities;
                        if(Carbon::parse($dataDesc->date_travel)->format('Y-m-d') == Carbon::parse($dataAsc->date_travel)->format('Y-m-d')){
                            $end_date_travel = Carbon::parse($dataDesc->date_travel)->format('Y-m-d\T00:00:00');
                        }else{
                            $end_date_travel = Carbon::parse($dataDesc->date_travel)->format('Y-m-d\T23:59:59');
                        }   
                    }else{
                        $citesPath = $dataAsc->from_city .' → '. $dataDesc->to_city .' → '. $dataAsc->from_city;
                        if(Carbon::parse($dataDesc->return_date_travel)->format('Y-m-d') == Carbon::parse($dataAsc->date_travel)->format('Y-m-d')){
                            $end_date_travel = Carbon::parse($dataDesc->return_date_travel)->format('Y-m-d\T00:00:00');
                        }else{
                            $end_date_travel = Carbon::parse($dataDesc->return_date_travel)->format('Y-m-d\T23:59:59');
                        }
                    }
                }else{
                    $citesPath = $dataAsc->from_city .' → '. $dataDesc->to_city;
                    $end_date_travel = Carbon::parse($dataDesc->date_travel)->format('Y-m-d\T00:00:00');
                }
    
                if($record->travel_type == 'one-way-trip'){
                    $travel_type = 'ONE WAY';
                }else if($record->travel_type == 'multi-location'){
                    $travel_type = 'MULTI LOCATION';
                }else{
                    $travel_type = 'ROUND TRIP';
                }

                $highRiskFrom = $this->checkHighRiskCountry($dataAsc->from_country_id, $dataAsc->from_city);
                $highRiskTo = $this->checkHighRiskCountry($dataDesc->to_country_id, $dataDesc->to_city);
                $color = $this->eventColor($sbpRelated, $record->user->profile->under_sbp_program, $highRiskFrom, $highRiskTo);
                $todayDateFormat = Carbon::now()->format('Y-m-d');

                if ($record->risk_level == 'High' || $record->risk_level == 'Moderate' || $record->user->profile->under_sbp_program == true) {
                    if($record->travel_type == 'round-trip'){
                        $completedTrip = $dataDesc->check_in_return == true && Carbon::parse($dataDesc->return_date_travel)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }else{
                        $completedTrip = $dataDesc->check_in == true && Carbon::parse($dataDesc->date_travel)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }
                } else {
                    if($record->travel_type == 'round-trip'){
                        $completedTrip = Carbon::parse($dataDesc->return_date_travel)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }else{
                        $completedTrip = Carbon::parse($dataDesc->date_travel)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }
                }
               
                $record->title = $record->user->full_name .' - ' . $citesPath;
                $record->immaper = $record->user->full_name;
                $record->country_from = $dataAsc->from_country_name;
                $record->country_to = $dataAsc->to_country_name;
                $record->from_city = $dataAsc->from_city;
                $record->to_city = $dataDesc->to_city;
                $record->date_travel = Carbon::parse($dataAsc->date_travel)->format('Y-m-d\T00:00:00');
                $record->end_date_travel = $end_date_travel;
                $record->return_date_travel = $dataDesc->return_date_travel;
                $record->flight_number = $dataAsc->flight_number;
                $record->flight_number_outbound_trip = $dataDesc->flight_number_outbound_trip;
                $record->flight_number_return_trip = $dataDesc->flight_number_return_trip;
                $record->transportation_type = 'INT';
                $record->transportation_travel_type = 'INT' . ' - '. $travel_type;
                $record->travel_type = $record->travel_type;
                $record->today_date = $todayDate;
                $record->itineraries = $dataAll;
                $record->color = $color;
                $record->check_in = $dataAsc->check_in;
                $record->check_in_outbound = $dataAsc->check_in_outbound;
                $record->check_in_return = $dataDesc->check_in_return;
                $record->completedTrip = $completedTrip;
                $record->under_sbp_program  = $record->user->profile->under_sbp_program;
                $record->risk_level = $record->risk_level;

                unset($record->user_id);
                unset($record->user);

                 return $record;
    
            });
        }

        if ($requestType == 'mrf') {
            $records = $records->map(function($record, $key) use($todayDate, $sbpRelated) {
                $dataAll =  $record->itineraries()->orderBy('order','asc')->get();
                $dataAsc =  $record->itineraries()->orderBy('order','asc')->first();
                $dataDesc = $record->itineraries()->orderBy('order','desc')->first();
                $to_city = $dataDesc->to_city;
    
                if($record->travel_type == 'multi-location' || $record->travel_type == 'round-trip'){
                    $cities = $dataAll->pluck('to_city')->implode(' → ');
                    if($record->travel_type == 'multi-location'){
                        $citesPath =  $dataAsc->from_city .' → '. $cities;
                        if(Carbon::parse($dataDesc->date_time)->format('Y-m-d') == Carbon::parse($dataAsc->date_time)->format('Y-m-d')){
                            $end_date_travel = Carbon::parse($dataDesc->date_time)->format('Y-m-d\T00:00:00');
                        }else{
                            $end_date_travel = Carbon::parse($dataDesc->date_time)->format('Y-m-d\T23:59:59');
                        }  
                    }else{
                        if($record->transportation_type == 'ground-travel' || $record->transportation_type == 'air-and-ground-travel'){
                            $citesPath =  $dataAsc->from_city .' → '. $cities;
                            if(Carbon::parse($dataDesc->date_time)->format('Y-m-d') == Carbon::parse($dataAsc->date_time)->format('Y-m-d')){
                                $end_date_travel = Carbon::parse($dataDesc->date_time)->format('Y-m-d\T00:00:00');
                            }else{
                                $end_date_travel = Carbon::parse($dataDesc->date_time)->format('Y-m-d\T23:59:59');
                            }
                            $to_city = $dataAsc->to_city;
                        }else{
                            $citesPath = $dataAsc->from_city .' → '. $dataDesc->to_city .' → '. $dataAsc->from_city;
                            if(Carbon::parse($dataDesc->return_date_time)->format('Y-m-d') == Carbon::parse($dataAsc->date_time)->format('Y-m-d')){
                                $end_date_travel = Carbon::parse($dataDesc->return_date_time)->format('Y-m-d\T00:00:00');
                            }else{
                                $end_date_travel = Carbon::parse($dataDesc->return_date_time)->format('Y-m-d\T23:59:59');
                            }
                        }   
                    }
                }else{
                    $citesPath = $dataAsc->from_city .' → '. $to_city;
                    $end_date_travel = Carbon::parse($dataDesc->date_time)->format('Y-m-d\T00:00:00');
                }
    
                if($record->travel_type == 'one-way-trip'){
                    $travel_type = 'ONE WAY';
                }else if($record->travel_type == 'multi-location'){
                    $travel_type = 'MULTI LOCATION';
                }else{
                    $travel_type = 'ROUND TRIP';
                }

                $highRiskFrom = $this->checkHighRiskCountry($record->country_id, $dataAsc->from_city);
                $highRiskTo = $this->checkHighRiskCountry($record->country_id, $to_city);
                $color = $this->eventColor($sbpRelated, $record->user->profile->under_sbp_program, $highRiskFrom, $highRiskTo);
                $todayDateFormat = Carbon::now()->format('Y-m-d');

                if ($record->risk_level == 'High' || $record->risk_level == 'Moderate' || $record->user->profile->under_sbp_program == true) {
                    if($record->travel_type == 'round-trip'){
                        $completedTrip = $dataDesc->check_in_return == true && Carbon::parse($dataDesc->return_date_time)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }else{
                        $completedTrip = $dataDesc->check_in == true && Carbon::parse($dataDesc->date_time)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }
                } else {
                    if($record->travel_type == 'round-trip'){
                        $completedTrip = Carbon::parse($dataDesc->return_date_time)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }else{
                        $completedTrip = Carbon::parse($dataDesc->date_time)->format('Y-m-d') < $todayDateFormat ? true : false;
                    }
                }

                if($record->transportation_type == 'air-travel'){
                    $transportationType = 'DOM AIR';
                }else if($record->transportation_type == 'ground-travel'){
                    $transportationType = 'DOM GROUND';
                }else{
                    $transportationType ='DOM AIR AND GROUND';
                }

                $record->title = $record->user->full_name .' - ' . $citesPath;
                $record->immaper = $record->user->full_name;
                $record->departure_etd = $dataAsc->etd;
                $record->departure_eta = $dataAsc->eta;
                $record->return_etd = $dataDesc->etd;
                $record->return_eta = $dataDesc->eta;
                $record->from_city = $dataAsc->from_city;
                $record->to_city = $to_city;
                $record->date_travel = Carbon::parse($dataAsc->date_time)->format('Y-m-d\T00:00:00');
                $record->end_date_travel = $end_date_travel;
                $record->return_date_travel = ($record->transportation_type == 'ground-travel' || $record->transportation_type == 'air-and-ground-travel')  && $record->travel_type == 'round-trip' ? $dataDesc->date_time :  $dataDesc->return_date_time;
                $record->flight_number = $dataAsc->flight_number;
                $record->flight_number_outbound_trip = $dataDesc->flight_number_outbound_trip;
                $record->flight_number_return_trip = $dataDesc->flight_number_return_trip;
                $record->transportation_type = $transportationType;
                $record->transportation_travel_type = $record->transportation_type .' - '. $travel_type;
                $record->travel_type = $record->travel_type;
                $record->today_date = $todayDate;
                $record->itineraries = $dataAll;
                $record->color = $color;
                $record->check_in = $dataAsc->check_in;
                $record->check_in_outbound = $dataAsc->check_in_outbound;
                $record->check_in_return = $dataDesc->check_in_return;
                $record->completedTrip = $completedTrip;
                $record->under_sbp_program  = $record->user->profile->under_sbp_program;
                $record->risk_level = $record->risk_level;

                unset($record->user_id);
                unset($record->user);

                return $record;
            });
        }

        return $records;  
    }

    //Filting travel data after reformating
    public function filterParamsApprovedTravel($travels, $filterData)
    {
        $todayDate = Carbon::now()->toDateString();

        if(!empty($filterData['inCities'])){
            $inCities = $filterData['inCities'];
            $travels = $travels->filter(function($record, $key) use ($inCities , $todayDate) {  
                if($record->travel_type == 'round-trip'){
                     if (in_array($record->to_city, $inCities) && $record->date_travel < $todayDate && $record->return_date_travel > $todayDate) {
                         return $record;
                     };
                }else if($record->travel_type == 'multi-location'){
                    $checkRoundTrip = false;
                    $array = $record->itineraries;
                    $return_travel_date_multi;
                    $record->itineraries->map(function($data, $key) use (&$checkRoundTrip, $array, $record, &$return_travel_date_multi){
                        if($data->outbound_trip_final_destination == 1){
                            $checkRoundTrip = true;
                            if($record->transportation_type === 'INT'){
                                $return_travel_date_multi = $array[$key+1]['date_travel'];
                              }else{
                                $return_travel_date_multi = $array[$key+1]['date_time'];
                              }
                        }
                    });
                    if($checkRoundTrip){
                        $result;
                        $record  = $record->itineraries->map(function($data, $key) use ($inCities , $todayDate, $record, $return_travel_date_multi,&$result) {  
                            if($record->transportation_type === 'INT'){
                                $travel_date_multi = $data->date_travel;
                            }else{
                                $travel_date_multi = $data->date_time;
                            }
                            if (in_array($data->to_city, $inCities) && $travel_date_multi < $todayDate && $return_travel_date_multi > $todayDate && $data->check_in == 1) {
                                $result = $record;
                            }
                        });

                        return $result;
                    }
                }    
            });
        }

        if(!empty($filterData['travelTypes'])){
            $travels = $travels->whereIn('transportation_type',$filterData['travelTypes']);
        }else{
            $travels = collect([]);
        }

        return array_values($travels->toArray());
    }

    // Get all approval requests (TAR & MRF)
    /**
     * @SWG\GET(
     *   path="/api/security-module/approval-travel-requests?date={date}",
     *   tags={"Security Module"},
     *   summary="Get approval travel request lists for the dashboard calendar",
     *   description="File: app\Http\Controllers\API\TravelRequestController@getAllApproval, Should be an iMMAPer",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="date", in="query", type="string", required=true, description="Date format 12/12/2021"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
     public function getAllApproval(Request $request)
     {
        $validatedData = $this->validate($request, [
            'date' => 'string|required',
            'travelTypes' => 'sometimes|nullable|array',
            'showHiddenTrips' => 'sometimes|nullable|string',
            'fromCities' => 'sometimes|nullable|array',
            'toCities' => 'sometimes|nullable|array',
            'inCities' => 'sometimes|nullable|array',
            'showImmapUs' => 'sometimes|nullable|string',
            'showImmapFrance' => 'sometimes|nullable|string',
            'showSbpRelated' => 'sometimes|nullable|string',
            'searchImmaper' => 'sometimes|nullable|string'
        ]);

        if($request->date != 'null'){
            $dateStart = Carbon::createFromFormat('d/m/Y', $request->date)->startOfMonth()->subMonth();
            $dateEnd = Carbon::createFromFormat('d/m/Y', $request->date)->startOfMonth()->addMonth(); 
        }else{
            $dateStart = Carbon::now()->startOfMonth()->subMonth();
            $dateEnd = Carbon::now()->startOfMonth()->addMonth(); 
        }

         $tar = TARRequest::where('status','approved')->whereHas('user', function($query) {
             $query->whereIn('status', ['Active', 'Inactive']);
         })->whereHas('itineraries',function($query) use ($dateStart,$dateEnd){
            $query->whereBetween('date_travel', [$dateStart, $dateEnd]);
         });

         $mrf = MRFRequest::where('status','approved')->whereHas('user', function($query) {
             $query->whereIn('status', ['Active', 'Inactive']);
         })->whereHas('itineraries',function($query) use ($dateStart,$dateEnd){
            $query->whereBetween('date_time', [$dateStart, $dateEnd]);
         });

         $tar = $this->setFilterApproval($tar, 'tar',$validatedData);
         $mrf = $this->setFilterApproval($mrf, 'mrf',$validatedData);

         $merged = $mrf->concat($tar);

         $requests = $this->filterParamsApprovedTravel($merged,$validatedData);
         
         return response()->success(__('crud.success.default'), $requests);
     }
     
     // Update The Trip view status
     /**
     * @SWG\Post(
     *   path="/api/security-module/update-trip-view-status/{id}",
     *   tags={"Security Module"},
     *   summary="Update Trip view status",
     *   description="File: app\Http\Controllers\API\TravelRequestController@updateTripViewStatus, Permission: Hide Travel Dashboard Event",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="trip id",
     *      ),
     *   @SWG\Parameter(
     *          name="trip",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "name", "permissions"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="type", type="string", description="type of the trip", example="INT"),
     *              @SWG\Property(property="status", type="string", description="status of the trip", example="unhide")
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
     public function updateTripViewStatus(Request $request, $id)
     {
        $this->validate($request, [
            'status' => 'string|required',
            'type' => 'string|required', 
        ]); 

        if($request->type == 'INT'){
            $trip = TARRequest::findOrFail($id);
        }else{
            $trip = MRFRequest::findOrFail($id);
        }

        $trip->view_status = $request->status;
        $trip->save();

        if(!$trip){
            return response()->error(__('crud.error.update'), ResponseCode::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->success(__('crud.success.default'), $trip);
     }

    public function eventColor($sbpRelated, $underSbp, $highRiskFrom, $highRiskTo)
    {
        $color = '#3174AD';

        if($sbpRelated && $underSbp){
            $color = '#EB5A33';
        }else{
            if($highRiskFrom || $highRiskTo){
              $color = '#BF3228';
            }else{
                $color = '#3174AD';
            }
        }

        return $color;
    }

    /**
     *  @SWG\Get(
     *      path="/api/security-module/download-travel-requests",
     *      tags={"Job"},
     *      summary="Get travel requests with selected filter",
     *      description="File: app\Http\Controllers\API\TravelRequestController@getTravelRequestsExport",
     *      security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *      @SWG\Response(response=200, description="Success"),
     *      @SWG\Response(response=404, description="Travel Request Not Found"),
     *      @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getTravelRequestsExport(Request $request)
    {
        $validatedData = $this->validate($request, [
            'tab' => 'required|integer',
            'search' => 'sometimes|nullable|string',
            'archiveTypes' => 'sometimes|nullable|array',
            'archiveTypes.*' => 'sometimes|nullable|string|in:latest,archive',
            'status' => 'sometimes|nullable|array',
            'status.*' => 'sometimes|nullable|string|in:submitted,approved,disapproved,revision',
            'offices' => 'sometimes|nullable|array',
            'offices.*' => 'sometimes|nullable|integer|exists:immap_offices,id',
            'purposes' => 'sometimes|nullable|array',
            'purposes.*' => 'sometimes|nullable|string|in:start-of-contract,end-of-contract,leave,work-related,rr,personal-reason',
            'criticalities' => 'sometimes|nullable|array',
            'criticalities.*' => 'sometimes|nullable|string|in:routine,essential,critical',
            'submitted_from' => 'sometimes|nullable|date_format:Y-m-d',
            'submitted_to' => 'sometimes|nullable|date_format:Y-m-d',
            'traveled_from' => 'sometimes|nullable|date_format:Y-m-d',
            'traveled_to' => 'sometimes|nullable|date_format:Y-m-d',
        ]);

        $travelRequests = [];
        
        if ($validatedData['tab'] == 1) {
            //tar
            $travelRequests = $this->getTAR($validatedData);
        } elseif ($validatedData['tab'] == 2) {
            //mrf
            $travelRequests = $this->getMRF($validatedData);
        } else {
            // all
            $travelRequests = $this->getAll($validatedData);
        }

        $travelRequestsForExport =  [];
        
        foreach($travelRequests as $travelRequest) {
            $data['profile_id'] = $travelRequest['profile_id'];
            $data['full_name'] = $travelRequest['immaper'];
            $data['job_title'] = $travelRequest['job_title'];
            $data['nationality'] = $travelRequest['nationality'];
            $data['project_code'] = $travelRequest['project_code'] ? $travelRequest['project_code'] : '-';
            $data['tar_type'] = $travelRequest['request_type'] === 'tar' ? 'INT' : 'DOM';
            $data['purpose'] = $travelRequest['purpose'];
            $data['travel_type'] = $travelRequest['travel_type'];  
            $data['country'] = $travelRequest['countries_export'];
            $data['duty_station'] = $travelRequest['duty_station'];  
            $data['date_travel'] = $travelRequest['date_travel'];  
            $data['date_return'] = $travelRequest['return_date_travel'];
            $data['end_date'] =   $travelRequest['travel_type'] != 'round-trip' ? $travelRequest['end_date'] : '-';
            $data['edit_status'] = 'Latest Approved Travel Request';

            array_push($travelRequestsForExport, $data);

            if ($travelRequest['edit_on_approval'] == true) {
                if ($travelRequest['request_type'] === 'tar') {
                        $revision = TARRequestRevision::where('tar_request_id', $travelRequest['id'])
                                        ->where('status', 'approved')
                                        ->where('edit_on_approval', false)
                                        ->first();
                        if ($revision) {
                            $dataAsc =  $revision->itineraries()->orderBy('order','asc')->first();
                            $dataDesc = $revision->itineraries()->orderBy('order','desc')->first();
                            $dataAll = $revision->itineraries()->orderBy('order','asc')->get();

                            $dataRevision['profile_id'] = $travelRequest['profile_id'];
                            $dataRevision['full_name'] = $travelRequest['immaper'];
                            $dataRevision['job_title'] = $travelRequest['job_title'];
                            $dataRevision['nationality'] = $travelRequest['nationality'];
                            $dataRevision['project_code'] = $travelRequest['project_code'] ? $travelRequest['project_code'] : '-';
                            $dataRevision['tar_type'] = $travelRequest['request_type'] === 'tar' ? 'INT' : 'DOM';
                            $dataRevision['purpose'] = $revision->travel_purpose;
                            $dataRevision['travel_type'] = $revision->travel_type; 
                            $dataRevision['country'] = $this->getCountriesOrCities($dataAll, 'tar');
                            $dataRevision['duty_station'] = $travelRequest['duty_station'];
                            $dataRevision['date_travel'] = Carbon::parse($dataAsc->date_time)->format('d/m/Y');
                            $dataRevision['date_return'] =  $revision->travel_type == 'round-trip' ? Carbon::parse($dataDesc->return_date_travel)->format('d/m/Y') : '-';
                            $dataRevision['end_date'] =   $revision->travel_type != 'round-trip' ? Carbon::parse($dataDesc->date_travel)->format('d/m/Y') : '-';
                            $dataRevision['edit_status'] = 'Previous Approved Travel Request';  
                        }
                    } else {
                            $revision = MRFRequestRevision::where('mrf_request_id', $travelRequest['id'])
                                            ->where('status', 'approved')
                                            ->where('edit_on_approval', false)
                                            ->first();
                            if ($revision) {
                                $dataAsc =  $revision->itineraries()->orderBy('order','asc')->first();
                                $dataDesc = $revision->itineraries()->orderBy('order','desc')->first();
                                $dataAll = $revision->itineraries()->orderBy('order','asc')->get();

                                $dataRevision['profile_id'] = $travelRequest['profile_id'];
                                $dataRevision['full_name'] = $travelRequest['immaper'];
                                $dataRevision['job_title'] = $travelRequest['job_title'];
                                $dataRevision['nationality'] = $travelRequest['nationality'];
                                $dataRevision['project_code'] = $travelRequest['project_code'] ? $travelRequest['project_code'] : '-';
                                $dataRevision['tar_type'] = $travelRequest['request_type'] === 'tar' ? 'INT' : 'DOM';
                                $dataRevision['purpose'] = $revision->purpose;
                                $dataRevision['travel_type'] = $revision->travel_type; 
                                $dataRevision['country'] = $revision->country_name . ': ' . $this->getCountriesOrCities($dataAll, 'mrf');
                                $dataRevision['duty_station'] = $travelRequest['duty_station'];
                                $dataRevision['date_travel'] = Carbon::parse($dataAsc->date_time)->format('d/m/Y');
                                $dataRevision['date_return'] =  ($revision->transportation_type == 'ground-travel' || $revision->transportation_type == 'air-and-ground-travel')
                                                                        && $revision->travel_type == 'round-trip' ? Carbon::parse($dataDesc->date_time)->format('d/m/Y') : $revision->travel_type == 'round-trip' ? Carbon::parse($dataDesc->return_date_time)->format('d/m/Y') : '-';
                                $dataRevision['end_date'] =   $revision->travel_type != 'round-trip' ? Carbon::parse($dataDesc->date_time)->format('d/m/Y') : '-';
                                $dataRevision['edit_status'] = 'Previous Approved Travel Request';
                            }
                    }

                    if ($revision) {
                        array_push($travelRequestsForExport, $dataRevision);
                    }
            }
        }

        $travelRequestsExport = new TravelRequestExport($travelRequestsForExport);
        ob_end_clean(); // this
        ob_start(); // and this

        return Excel::download($travelRequestsExport, "Travel-requests-data.xlsx");
    }

    private function paginate($items, $perPage = 15, $page = null, $options = [])
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);
        $items = $items instanceof Collection ? $items : Collection::make($items);
        $travels = new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);

        $data = $travels->values();
    
        return [
            'current_page' => $travels->currentPage(),
            'data' => $data,
            'first_page_url' => $travels->url(1),
            'from' => $travels->firstItem(),
            'last_page' => $travels->lastPage(),
            'last_page_url' => $travels->url($travels->lastPage()),
            'next_page_url' => $travels->nextPageUrl(),
            'per_page' => $travels->perPage(),
            'prev_page_url' => $travels->previousPageUrl(),
            'to' => $travels->lastItem(),
            'total' => $travels->total(),
        ];
    }
}
