<?php

namespace App\Http\Controllers\API\SecurityModule;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Response as ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SecurityModule\TARRequest;
use App\Models\SecurityModule\TARRequestRevision;
use App\Models\SecurityModule\TARRequestItinerary;
use App\Models\SecurityModule\TARRequestItineraryRevision;
use App\Mail\SecurityModule\TARSubmissionEmail;
use App\Mail\SecurityModule\SecurityReminderTARSubmissionEmail;
use App\Mail\SecurityModule\iMMAPerReminderTARApprovalEmail;
use App\Mail\SecurityModule\NotifySBPManagersTARApprovedEmail;
use App\Mail\SecurityModule\NotifyIMMAPerCheckInTAREmail;
use App\Mail\SecurityModule\NotifyTARTravel;
use App\Mail\SecurityModule\SecurityReminderAfterApprovalTARSubmissionEmail;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use PDF;

// Manage every request related to tha TAR
class TARRequestController extends Controller
{
    protected $singular = 'international request';
    protected $fillable = [
        'name', 'travel_purpose', 'overnight', 'explanation', 'status', 'remarks',
        'disapproved_reasons', 'revision_needed', 'approved_comments', 'travel_type',
        'is_high_risk', 'heat_certificate', 'risk_level'
    ];
    protected $rules = [
        'travel_purpose' => 'required|string|in:start-of-contract,end-of-contract,leave,work-related,rr,personal-reason',
        'travel_type' => 'required|string|in:one-way-trip,round-trip,multi-location',
        'status' => 'sometimes|nullable|in:saved,submit,submitted,approved,disapproved,revision',
        'edit_flight_number' => 'required|boolean',
        'risk_level' => 'required|string|in:High,Moderate,Low,Negligible,Unknown',
        'itineraries' => 'required|array',
        'itineraries.*.date_travel' => 'required|date_format:Y-m-d H:i:s',
        'itineraries.*.return_date_travel' => 'sometimes|nullable|date_format:Y-m-d H:i:s|required_if:travel_type,round-trip',
        'itineraries.*.from_country' => 'required',
        'itineraries.*.from_country.value' => 'required|integer|exists:countries,id',
        'itineraries.*.from_country.label' => 'required|string|exists:countries,name',
        'itineraries.*.from_city' => 'required|string',
        'itineraries.*.to_country' => 'required',
        'itineraries.*.to_country.value' => 'required|integer|exists:countries,id',
        'itineraries.*.to_country.label' => 'required|string|exists:countries,name',
        'itineraries.*.to_city' => 'required|string',
        'itineraries.*.flight_number' => 'sometimes|nullable|string',
        'itineraries.*.flight_number_outbound_trip' => 'sometimes|nullable|string',
        'itineraries.*.flight_number_return_trip' => 'sometimes|nullable|string',
        'itineraries.*.overnight' => 'required|boolean',
        'itineraries.*.overnight_explanation' => 'sometimes|nullable|string',
        'itineraries.*.is_high_risk' => 'required|boolean',
        'itineraries.*.outbound_trip_final_destination' => 'sometimes|nullable|boolean',
        'itineraries.*.need_government_paper' => 'required|in:yes,no',
        'itineraries.*.need_government_paper_now' => 'sometimes|nullable|boolean',
        'itineraries.*.government_paper_id' => 'sometimes|nullable|integer|exists:attachments,id',
        'isSubmit' => 'sometimes|nullable|boolean',
        'remarks' => 'sometimes|nullable|string',
        'is_high_risk' => 'required|boolean',
        'heat_certificate' => 'required|boolean',
        'disapproved_reasons' => 'sometimes|nullable|required_if:status,disapproved|string',
        'revision_needed' => 'sometimes|nullable|required_if:status,revision|string',
        'approved_comments' => 'sometimes|nullable|string'
    ];

    protected function edit_rules()
    {
        $rules = $this->rules;
        $rules['itineraries.*.id'] = 'sometimes|nullable|integer|exists:security_module_tar_request_itineraries,id';

        return $rules;
    }

    // Create revision for each TAR
    protected function create_revision(int $id)
    {
        $new_record = TARRequest::findOrFail($id);

        $revisionData = [
            'name' => $new_record->name,
            'travel_purpose' => $new_record->travel_purpose,
            'remarks' => $new_record->remarks,
            'status' => $new_record->status,
            'user_id' => $new_record->user_id,
            'submitted_date' => $new_record->submitted_date,
            'tar_request_id' => $new_record->id,
            'user_who_edit' => auth()->user()->id,
            'disapproved_reasons' => $new_record->disapproved_reasons,
            'revision_needed' => $new_record->revision_needed,
            'approved_comments' => $new_record->approved_comments,
            'travel_type' => $new_record->travel_type,
            'is_high_risk' => $new_record->is_high_risk,
            'heat_certificate' => $new_record->heat_certificate,
            'security_measure_email' => $new_record->security_measure_email,
            'security_measure_smart24' => $new_record->security_measure_smart24,
            'security_measure_immap_careers' => $new_record->security_measure_immap_careers,
            'risk_level' => $new_record->risk_level,
        ];

        $revision = TARRequestRevision::create($revisionData);

        if ($revision) {
            foreach ($new_record->itineraries as $key => $itinerary) {
                $revision->itineraries()->create([
                    'date_travel' => $itinerary['date_travel'],
                    'return_date_travel' => $itinerary['return_date_travel'],
                    'from_country_id' => $itinerary['from_country_id'],
                    'from_country_name' => $itinerary['from_country_name'],
                    'from_city' => $itinerary['from_city'],
                    'to_country_id' => $itinerary['to_country_id'],
                    'to_country_name' => $itinerary['to_country_name'],
                    'to_city' => $itinerary['to_city'],
                    'flight_number' => $itinerary['flight_number'],
                    'flight_number_outbound_trip' => $itinerary['flight_number_outbound_trip'],
                    'flight_number_return_trip' => $itinerary['flight_number_return_trip'],
                    'order' => $key,
                    'overnight' => $itinerary['overnight'],
                    'overnight_explanation' => $itinerary['overnight_explanation'],
                    'is_high_risk' => $itinerary['is_high_risk'],
                    'outbound_trip_final_destination' => $itinerary['outbound_trip_final_destination'],
                    'need_government_paper' => $itinerary['need_government_paper'],
                    'need_government_paper_now' => $itinerary['need_government_paper_now'],
                    'government_paper_id' =>  $itinerary['need_government_paper'] == "yes" ? $itinerary['government_paper_id'] : null,
                ]);
            }

            return count($revision->itineraries) ? true : false;
        } else {
            return false;
        }
    }

    // Generate pdf file for TAR
    public function createPDF(int $id, bool $fromScript = false)
    {
        $record = TARRequest::with([
            'itineraries' => function ($query) {
                $query->orderBy('order', 'asc');
            },
            'itineraries.fromCountry',
            'itineraries.toCountry'

        ])->findOrFail($id);

        $data = ['tar' => $record];
        $getLastEdit = $record->revisions()->orderBy('id', 'desc')->first();
        if (!empty($getLastEdit)) {
            $data['last_edit_user'] = $getLastEdit->last_edit_user;
        }

        if (!empty($record)) {
            if ($fromScript) {
                $pdf = $record->getMedia('tar_pdf');
                if (!empty($pdf)) {
                    if (count($pdf)) {
                        foreach ($pdf as $tarpdf) {
                            $tarpdf->delete();
                        }
                    }
                }
            }

            $header = view('security-module.TARPDFHeader')->render();
            $footer = view('security-module.TARPDFFooter')->render();
            $date = date("Y-m-d");
            $slug = Str::slug($record->user->family_name);
            $dataAsc =  $record->itineraries()->orderBy('order','asc')->first();
            $travelDate = Carbon::parse($dataAsc->date_travel)->format('d-m-Y');
            if($record->status == 'approved'){
                $fileName = 'Travel-request-' . $slug . '-' . $travelDate . '-approved'. '.pdf';
            }else{
                $fileName = 'Travel-request-' . $slug . '-' . $travelDate . '.pdf';
            }

            $path = storage_path("app/public/security-module/tar/{$fileName}");

            if (is_file($path)) {
                unlink($path);
            }

            $view = view('security-module.TARPDF', $data)->render();

            $pdf = PDF::loadHTML($view)
                ->setPaper('a4')
                ->setOption('margin-top', '38.1mm')
                ->setOption('margin-bottom', '27.4mm')
                ->setOption('margin-left', '25.4mm')
                ->setOption('margin-right', '25.4mm')
                ->setOption('footer-html', $footer)
                ->setOption('header-html', $header);

            $pdf->save($path);

            $record->addMedia($path)->toMediaCollection('tar_pdf', 's3');

            if ($fromScript) {
                return true;
            }
        }

        if ($fromScript) {
            return false;
        }
    }

    // Send reminder for security
    protected function sendReminder($status = 'submitted', $record, $replyTo = '', $prevStatus = 'submitted')
    {
        $officers = User::select('id', 'full_name as name', 'immap_email')->permission('Approve Domestic Travel Request')->permission('Approve Global Travel Request')->orderByDesc('id')->get();
        $officers = $officers->filter(function ($officer, $key) {
            return !$officer->hasPermissionTo('Set as Admin');
        })->pluck('immap_email')->toArray();

        if (count($officers)) {
            if (empty($replyTo)) {
                if($prevStatus == 'approved'){
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderAfterApprovalTARSubmissionEmail($status, $record));
                }else{
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderTARSubmissionEmail($status, $record));
                }
            } else {
                if($prevStatus == 'approved'){
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderAfterApprovalTARSubmissionEmail($status, $record, $replyTo));
                }else{
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderTARSubmissionEmail($status, $record, $replyTo));
                }
            }
        }

        return true;
    }
    // Get the pdf file for each TAR
    /**
     * @SWG\Get(
     *   path="/api/security-module/tar/{id}/pdf",
     *   tags={"Security Module"},
     *   summary="Get specific pdf file of international request (TAR)",
     *   description="File: app\Http\Controllers\API\TARRequestController@getTARPDF, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function getTARPDF($id)
    {
        $record = TARRequest::findOrFail($id);
        $authUser = auth()->user();

        if (($record->user_id !== $authUser->id) && !$authUser->hasAnyPermission(['Approve Global Travel Request', 'Approve Domestic Travel Request', 'View Other Travel Request', 'View SBP Travel Request', 'View Only On Security Page'])) {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        $pdf = $record->getMedia('tar_pdf');
        $pdf = empty($pdf) ? '' : $pdf[0]->getFullUrlFromS3();

        return response()->success(__('crud.success.default'), $pdf);
    }

    // Create tar, store new tar when no record exists in database
    /**
     * @SWG\Post(
     *   path="/api/security-module/tar",
     *   tags={"Security Module"},
     *   summary="Store international travel (TAR) request",
     *   description="File: app\Http\Controllers\API\TARRequestController@store, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="tar",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"travel_purpose", "travel_type", "itineraries"},
     *              @SWG\Property(property="travel_purpose", type="integer", description="Travel purpose id, should be exists on security_module_travel_purposes table", example=1),
     *              @SWG\Property(property="travel_type", type="string", enum={"one-way-trip", "round-trip", "multi-location"}, description="Travel type", example="one-way-trip"),
     *              @SWG\Property(property="risk_level", type="string", description="Risk Level", example="Low"),
     *              @SWG\Property(property="status", type="string", enum={"saved", "submit", "submitted", "approved", "disapproved", "revision"}, description="International request status", example="saved"),
     *              @SWG\Property(property="itineraries", type="array", description="International travel request itineraries",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="date_travel", format="date", type="string", description="Travel Date / Departure date [Date format: 2020-12-10 13:45:01]", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="return_date_travel", format="date", type="string", description="Return date [Date format: 2020-12-10 13:45:01] (Can be empty)", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="from_country", type="object", description="From Country [format : {value: 1, label: Indonesia}]",
     *                          @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *                      ),
     *                      @SWG\Property(property="from_city", type="string", description="From City", example="Medan"),
     *                      @SWG\Property(property="to_country", type="object", description="To Country [format : {value: 2, label: France}]",
     *                          @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=2)
     *                      ),
     *                      @SWG\Property(property="to_city", type="string", description="To City", example="Marseille"),
     *                      @SWG\Property(property="flight_number", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_outbound_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_return_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="overnight", type="integer", enum={0,1}, description="Overnight is required? (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="overnight_explanation", type="string", description="Overnight explanation required if overnight == 1", example="Overnight explanation"),
     *                      @SWG\Property(property="outbound_trip_final_destination", type="integer", enum={0,1}, description="outbound trip final destination (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="need_government_paper", type="string", enum={"yes", "no"}, description="Is this trip need government paper? (Yes, No)", example="yes"),
     *                      @SWG\Property(property="need_government_paper_now", type="integer", enum={0,1}, description="Attach Your Government Paper Now? (0 = no, 1 = yes)", example=1),
     *                      @SWG\Property(property="government_paper_id", type="integer", description="Attachment ID (Required if need_government_paper == yes & need_government_paper_now == 1)", example=1000),
     *                  )
     *              ),
     *              @SWG\Property(property="isSubmit", type="integer", enum={0,1}, description="Submit or save (0 = save, 1 = submit) can be empty also", example="0"),
     *              @SWG\Property(property="remarks", type="string", description="Additional comments", example="Additional comment for international request (TAR)"),
     *              @SWG\Property(property="disapproved_reasons", type="string", description="(Should be empty in iMMAPer POV)"),
     *              @SWG\Property(property="revision_needed", type="string", description="(Should be empty in iMMAPer POV)"),
     *              @SWG\Property(property="approved_comments", type="string", description="(Should be empty in iMMAPer POV)"),
     *          )
     *      ),
     *   @SWG\Response(response=201, description="Created"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $user = auth()->user();
        $recordData = $request->only($this->fillable);
        $recordData['user_id'] = $user->id;
        if ($request->isSubmit) {
            $recordData['submitted_date'] = date("Y-m-d H:i:s");
            $recordData['status'] = 'submitted';
        }
        $record = TARRequest::create($recordData);

        if ($record) {
            if (empty($request->status)) {
                $date = date("dmy", strtotime($request->itineraries[0]['date_travel']));
                $record->fill(['name' => 'INT-' . $user->family_name . '-' . $date])->save();
            }

            foreach ($request->itineraries as $key => $itinerary) {
                $record->itineraries()->create([
                    'date_travel' => $itinerary['date_travel'],
                    'return_date_travel' => $itinerary['return_date_travel'],
                    'from_country_id' => $itinerary['from_country']['value'],
                    'from_country_name' => $itinerary['from_country']['label'],
                    'from_city' => $itinerary['from_city'],
                    'to_country_id' => $itinerary['to_country']['value'],
                    'to_country_name' => $itinerary['to_country']['label'],
                    'to_city' => $itinerary['to_city'],
                    'flight_number' => $itinerary['flight_number'],
                    'flight_number_outbound_trip' => $itinerary['flight_number_outbound_trip'],
                    'flight_number_return_trip' => $itinerary['flight_number_return_trip'],
                    'order' => $key,
                    'overnight' => $itinerary['overnight'],
                    'overnight_explanation' => empty($itinerary['overnight_explanation']) ? null : $itinerary['overnight_explanation'],
                    'is_high_risk' => $itinerary['is_high_risk'],
                    'outbound_trip_final_destination' => $itinerary['outbound_trip_final_destination'],
                    'need_government_paper' => $itinerary['need_government_paper'],
                    'need_government_paper_now' => $itinerary['need_government_paper_now'],
                    'government_paper_id' =>  $itinerary['need_government_paper'] == "yes" ? $itinerary['government_paper_id'] : null,
                ]);
            }

            if ($request->isSubmit) {
                $revision = $this->create_revision($record->id);
                Mail::to(auth()->user()->immap_email)->send(new TARSubmissionEmail('submitted', auth()->user(), $record));
                $this->sendReminder('submitted', $record, auth()->user()->immap_email);
            }

            $this->createPDF($record->id);

            return response()->success(__('crud.success.store', ['singular' => ucwords($this->singular)]), $record, ResponseCode::HTTP_CREATED);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    // Update TAR from iMMAPer POV
    /**
     * @SWG\Post(
     *   path="/api/security-module/tar/{id}",
     *   tags={"Security Module"},
     *   summary="Update specific international travel (TAR) request",
     *   description="File: app\Http\Controllers\API\TARRequestController@update, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="TAR id"),
     *   @SWG\Parameter(
     *          name="tar",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "travel_purpose", "travel_type", "itineraries"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="travel_purpose", type="integer", description="Travel purpose id, should be exists on security_module_travel_purposes table", example=1),
     *              @SWG\Property(property="travel_type", type="string", enum={"one-way-trip", "round-trip", "multi-location"}, description="Travel type", example="one-way-trip"),
     *              @SWG\Property(property="risk_level", type="string", description="Risk Level", example="Low"),
     *              @SWG\Property(property="status", type="string", enum={"saved", "submit", "submitted", "approved", "disapproved", "revision"}, description="International request status", example="saved"),
     *              @SWG\Property(property="itineraries", type="array", description="International travel request itineraries",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Itinerary ID if itinerary exist (can be empty, it will create new record)", example=1),
     *                      @SWG\Property(property="date_travel", format="date", type="string", description="Travel Date / Departure date [Date format: 2020-12-10 13:45:01]", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="return_date_travel", format="date", type="string", description="Return date [Date format: 2020-12-10 13:45:01] (Can be empty)", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="from_country", type="object", description="From Country [format : {value: 1, label: Indonesia}]",
     *                          @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *                      ),
     *                      @SWG\Property(property="from_city", type="string", description="From City", example="Medan"),
     *                      @SWG\Property(property="to_country", type="object", description="To Country [format : {value: 2, label: France}]",
     *                          @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=2)
     *                      ),
     *                      @SWG\Property(property="to_city", type="string", description="To City", example="Marseille"),
     *                      @SWG\Property(property="flight_number", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_outbound_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_return_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="overnight", type="integer", enum={0,1}, description="Overnight is required? (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="overnight_explanation", type="string", description="Overnight explanation required if overnight == 1", example="Overnight explanation"),
     *                      @SWG\Property(property="outbound_trip_final_destination", type="integer", enum={0,1}, description="outbound trip final destination (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="need_government_paper", type="string", enum={"yes", "no"}, description="Is this trip need government paper? (Yes, No, Not Applicable)", example="yes"),
     *                      @SWG\Property(property="need_government_paper_now", type="integer", enum={0,1}, description="Attach Your Government Paper Now? (0 = no, 1 = yes)", example=1),
     *                      @SWG\Property(property="government_paper_id", type="integer", description="Attachment ID (Required if need_government_paper == yes)", example=1000),
     *                  )
     *              ),
     *              @SWG\Property(property="isSubmit", type="integer", enum={0,1}, description="Submit or save (0 = save, 1 = submit) can be empty also", example="0"),
     *              @SWG\Property(property="remarks", type="string", description="Additional comments", example="Additional comment for international request (TAR)"),
     *              @SWG\Property(property="disapproved_reasons", type="string", description="(Should be empty in iMMAPer POV)"),
     *              @SWG\Property(property="revision_needed", type="string", description="(Should be empty in iMMAPer POV)"),
     *              @SWG\Property(property="approved_comments", type="string", description="(Should be empty in iMMAPer POV)"),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->edit_rules());
        $securityOfficers = User::select('id', 'full_name as name')->permission('Approve Global Travel Request')->permission('Approve Domestic Travel Request')->orderByDesc('id')->get(); // also checking Global Security Role

        $auth_user_id = auth()->user()->id;
        $firstSubmit = false;
        $record = TARRequest::findOrFail($id);
        $prevStatus = $record->status;

        if ($record->user_id != $auth_user_id) {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        $recordData = $request->only($this->fillable);

        if($validatedData['edit_flight_number'] == false){
            if ($request->isSubmit) {
                if (empty($record->submitted_date) || is_null($record->submitted_date)) {
                    $firstSubmit = true;
                }
                $recordData['submitted_date'] = date("Y-m-d H:i:s");
                $recordData['status'] = 'submitted';

                if($prevStatus == 'approved') {
                    $recordData['edit_on_approval'] = true;
                }
            }
        }

        $date = date("dmy", strtotime($record->itineraries[0]['date_travel']));
        $recordData['name'] = 'INT-' . $record->user->family_name . '-' . $date;

        $record->fill($recordData)->save();

        if ($record) {
            $oldItineraries = $record->itineraries->pluck('id');
            $newItineraries = Arr::pluck($request->itineraries, 'id');
            $deletedItineraries = $oldItineraries->filter(function ($id, $key) use ($newItineraries) {
                return !in_array($id, $newItineraries);
            });
            if (!empty($deletedItineraries)) {
                $record->itineraries()->whereIn('id', $deletedItineraries)->delete();
            }
            foreach ($request->itineraries as $key => $itinerary) {
                $itineraryData = [
                    'date_travel' => $itinerary['date_travel'],
                    'return_date_travel' => $itinerary['return_date_travel'],
                    'from_country_id' => $itinerary['from_country']['value'],
                    'from_country_name' => $itinerary['from_country']['label'],
                    'from_city' => $itinerary['from_city'],
                    'to_country_id' => $itinerary['to_country']['value'],
                    'to_country_name' => $itinerary['to_country']['label'],
                    'to_city' => $itinerary['to_city'],
                    'flight_number' => $itinerary['flight_number'],
                    'flight_number_outbound_trip' => $itinerary['flight_number_outbound_trip'],
                    'flight_number_return_trip' => $itinerary['flight_number_return_trip'],
                    'order' => $key,
                    'overnight' => $itinerary['overnight'],
                    'overnight_explanation' => $itinerary['overnight_explanation'],
                    'is_high_risk' => $itinerary['is_high_risk'],
                    'outbound_trip_final_destination' => $itinerary['outbound_trip_final_destination'],
                    'need_government_paper' => $itinerary['need_government_paper'],
                    'need_government_paper_now' => $itinerary['need_government_paper_now'],
                    'government_paper_id' =>  $itinerary['need_government_paper'] == "yes" ? $itinerary['government_paper_id'] : null,
                ];

                if (!empty($itinerary['id'])) {
                    $oldItinerary = $record->itineraries()->where('id', $itinerary['id'])->first();
                    if ($oldItinerary->count() > 0) {
                        $oldItinerary->fill($itineraryData);

                        if (!$oldItinerary->isClean()) {
                            $oldItinerary->save();
                        }
                    }
                } else {
                    $record->itineraries()->create($itineraryData);
                }
            }

            if ($request->isSubmit) {
                $revision = $this->create_revision($record->id);
                if($validatedData['edit_flight_number'] == false){
                    if ($firstSubmit) {
                        Mail::to(auth()->user()->immap_email)->send(new TARSubmissionEmail('submitted', auth()->user(), $record));
                        $this->sendReminder('submitted', $record, auth()->user()->immap_email);
                    } else {
                        Mail::to(auth()->user()->immap_email)->send(new TARSubmissionEmail('resubmitted', auth()->user(), $record));
                        if($prevStatus == 'approved'){
                            $this->sendReminder('resubmitted', $record, auth()->user()->immap_email, 'approved');
                        }else{
                            $this->sendReminder('resubmitted', $record, auth()->user()->immap_email);
                        }   
                    }
                }
            }

            $pdf = $record->getMedia('tar_pdf');
            if (!empty($pdf)) {
                if (count($pdf)) {
                    foreach ($pdf as $tarpdf) {
                        $tarpdf->delete();
                    }
                }
            }

            $this->createPDF($record->id);
            $record = TARRequest::findOrFail($record->id);

            return response()->success(__('crud.success.update', ['singular' => ucwords($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    // Delete the TAR
    /**
     * @SWG\Delete(
     *   path="/api/security-module/tar/{id}",
     *   tags={"Security Module"},
     *   summary="Delete specific international travel (TAR) request",
     *   description="File: app\Http\Controllers\API\TARRequestController@destroy, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="TAR id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=403, description="Forbidden"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function destroy($id)
    {
        $authUser = auth()->user();

        $record = TARRequest::findOrFail($id);

        if (($record->user_id !== $authUser->id) && !$authUser->hasAnyPermission(['Approve Global Travel Request', 'Approve Domestic Travel Request'])) {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        $result = $record->delete();

        if ($result) {
            return response()->success(__('crud.success.delete', ['singular' => ucwords($this->singular)]), $record);
        }

        return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
    }

    // Get TAR Request
    /**
     * @SWG\Get(
     *   path="/api/security-module/tar/{user}/show/{id}",
     *   tags={"Security Module"},
     *   summary="Get specific international request (TAR) for iMMAPer or Security POV",
     *   description="File: app\Http\Controllers\API\TARRequestController@show, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="user", in="path", required=true, type="string", enum={"immaper","security"}, description="iMMAPer or Security"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="TAR id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=403, description="Sorry you cannot access this data"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function show($user = "immaper", int $id)
    {
        $auth_user = auth()->user();

        $record = TARRequest::with([
            'itineraries' => function ($query) {
                $query->orderBy('order', 'asc');
            },
            'itineraries.fromCountry' => function ($query) {
                $query->select('id', 'name as label', 'id as value');
            },
            'itineraries.toCountry' => function ($query) {
                $query->select('id', 'name as label', 'id as value');
            },
            'user:id,full_name',
            'user.profile' => function ($query) {
                $query->select('id', 'line_manager', 'job_title', 'end_of_current_contract', 'user_id', 'immap_office_id', 'under_sbp_program');
            },
            'user.profile.p11_immap_office:id,city,country_id',
            'user.profile.p11_immap_office.country:id,name'
        ])->findOrFail($id);

        if (!$auth_user->hasAnyPermission(['Approve Global Travel Request', 'Approve Domestic Travel Request', 'View Other Travel Request', 'View SBP Travel Request', 'View Only On Security Page'])) {
            $user = 'immaper';
        } else {
            $user = 'security';
        }

        if ($record->user_id != $auth_user->id && $user == "immaper") {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        if ($record->itineraries->count() > 0) {
            $itineraries = $record->itineraries->map(function ($itinerary) {
                if ($itinerary->need_government_paper !== 'yes') {
                    $itinerary->government_paper = null;
                } else {
                    if ($itinerary->need_government_paper_now == 1) {
                        $media = $itinerary->attachment;
                        if (!empty($media)) {
                            $media = $media->media->first();

                            if (!empty($media)) {
                                $itinerary->government_paper = new \stdclass;
                                $itinerary->government_paper->file_id = $itinerary->government_paper_id;
                                $itinerary->government_paper->filename = $media->file_name;
                                $itinerary->government_paper->download_url = $media->getFullUrlFromS3();
                                $itinerary->government_paper->file_url = $media->getFullUrlFromS3();
                                $itinerary->government_paper->mime = $media->mime_type;
                            } else {
                                $itinerary->government_paper = null;
                            }
                            unset($itinerary->attachment);
                        } else {
                            $itinerary->government_paper = null;
                        }
                    }
                }
                return $itinerary;
            });
            $itineraries = $itineraries->all();

            unset($record->itineraries);
            $record->itineraries = $itineraries;
        }

        $currentName = !empty(auth()->user()) ? auth()->user()->full_name : '';
        $lastEditUser = !empty($record->revisions()->orderBy('id', 'desc')->first()->last_edit_user) ? $record->revisions()->orderBy('id', 'desc')->first()->last_edit_user->full_name : '';
        $record->last_edit = $record->status == "saved" ? $currentName : $lastEditUser;

        return response()->success(__('crud.success.default', ['singular' => ucwords($this->singular)]), $record);
    }

    // Update TAR from Security POV
    /**
     * @SWG\Post(
     *   path="/api/security-module/tar/{id}/security-update",
     *   tags={"Security Module"},
     *   summary="Update specific international travel (TAR) request from security POV",
     *   description="File: app\Http\Controllers\API\TARRequestController@security_update, Should be an iMMAPer, Permission: Approve Global Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="TAR id"),
     *   @SWG\Parameter(
     *          name="tar",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"status"},
     *              @SWG\Property(property="status", type="string", enum={"saved", "submit", "submitted", "approved", "disapproved", "revision"}, description="International request status", example="saved"),
     *              @SWG\Property(property="disapproved_reasons", type="string", description="required if status = disapproved"),
     *              @SWG\Property(property="revision_needed", type="string", description="required if status = revision"),
     *              @SWG\Property(property="approved_comments", type="string", description="Can be empty regardless of the status")
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function security_update(Request $request, int $id)
    {
        $validatedData = $this->validate($request, [
            'status' => 'required|string|in:saved,submit,submitted,approved,disapproved,revision',
            'disapproved_reasons' => $this->rules['disapproved_reasons'],
            'revision_needed' => $this->rules['revision_needed'],
            'approved_comments' => $this->rules['approved_comments'],
            'security_measure_email' => 'sometimes|nullable|boolean',
            'security_measure_smart24' => 'sometimes|nullable|boolean',
            'security_measure_immap_careers' => 'sometimes|nullable|boolean'
        ]);

        $record = TARRequest::findOrFail($id);

        $record->fill($validatedData)->save();

        if ($record) {
            $revision = $this->create_revision($record->id);


             // Manipulate the tar pdf
             $pdf = $record->getMedia('tar_pdf');
             if (!empty($pdf)) {
                 if (count($pdf)) {
                     foreach ($pdf as $tarpdf) {
                         $tarpdf->delete();
                     }
                 }
             }
 
             $this->createPDF($record->id);
             $pdf = $this->getTARPDFFile($record->id);

            // Sending Email
            Mail::to($record->user->immap_email)->send(new iMMAPerReminderTARApprovalEmail($record->user->full_name, $record, auth()->user()->immap_email, $pdf));

            // Notify other staff / email when it's approved
            if ($request->status == "approved") {
                $record = TARRequest::findOrFail($record->id);
                $itineraries = $record->itineraries;
                $allCountries = array_unique(array_merge($itineraries->pluck('from_country_id')->toArray(), $itineraries->pluck('to_country_id')->toArray()));
                $notifyEmails = \App\Models\SecurityModule\NotifyTravelSetting::whereIn('country_id', $allCountries)->get();
                if (!$notifyEmails->isEmpty()) {
                    $notifyEmails = array_unique($notifyEmails->pluck('email')->toArray());
                    foreach ($notifyEmails as $notifyEmail) {
                        Mail::to($notifyEmail)->send(new NotifyTARTravel($record));
                    }
                }
                
                //Notify SBP Managers
                if($record->user->profile->under_sbp_program == true){
                    $SBPManagers = User::role('SBPP Manager')->whereNotNull('immap_email')->pluck('immap_email');
                    if(!$SBPManagers->isEmpty()){
                        Mail::to($SBPManagers)->send(new NotifySBPManagersTARApprovedEmail($record));  
                    } 
                  }
            }

            $record = TARRequest::findOrFail($record->id);

            return response()->success(__('crud.success.update', ['singular' => ucwords($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    // Update Check in TAR
    /**
     * @SWG\Post(
     *   path="/api/security-module/tar/{id}/check-in",
     *   tags={"Security Module"},
     *   summary="Update the check in of a trip",
     *   description="File: app\Http\Controllers\API\TARRequestController@checkIn, Should be an iMMAPer",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="TAR id"),
     *   @SWG\Parameter(
     *          name="tar",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "itineraries"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="itineraries", type="array", description="International travel request itineraries",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Itinerary ID", example=1),
     *                      @SWG\Property(property="check_in", type="integer", enum={0,1}, description="check in (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="check_in_outbound", type="integer", enum={0,1}, description="check in outbound (yes = 1, no = 0)", example=0),
     *                      @SWG\Property(property="check_in_return", type="integer", enum={0,1}, description="check in return (yes = 1, no = 0)", example=0),
     *                  )
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function checkIn(Request $request, int $id)
    {
        $validatedData = $this->validate($request, [
            'itineraries' => 'required|array',
            'itineraries.*.id' => 'required|integer|exists:security_module_tar_request_itineraries,id',
            'itineraries.*.check_in' => 'required|boolean',
            'itineraries.*.check_in_outbound' => 'required|boolean',
            'itineraries.*.check_in_return' => 'required|boolean'
        ]);

        $record = TARRequest::findOrFail($id);
        
        if($record && $record->status == "approved"){
            foreach($validatedData['itineraries'] as $data){
                $itinerary = TARRequestItinerary::where('tar_request_id',$id)->where('id',$data['id'])->first();
                $itinerary->check_in = $data['check_in'];
                $itinerary->check_in_outbound = $data['check_in_outbound'];
                $itinerary->check_in_return = $data['check_in_return'];
                $itinerary->save();
            }
            $revision = $this->create_revision($record->id);
            Mail::to($record->user->immap_email)->send(new NotifyIMMAPerCheckInTAREmail($record));
        }else{
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucwords($this->singular)]), $record);
    }

    public function getTARPDFFile($id)
    {
       $record = TARRequest::findOrFail($id);
    
       $pdf = $record->getMedia('tar_pdf');
       $pdf = empty($pdf) ? '' : $pdf[0]->getFromS3()->getPath();

       return $pdf;
    }
}
