<?php

namespace App\Http\Controllers\API\SecurityModule;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Response as ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\MRFRequestRevision;
use App\Models\SecurityModule\MRFRequestItinerary;
use App\Models\SecurityModule\MRFRequestItineraryRevision;
use App\Models\SecurityModule\MRFRequestTravelDetail;
use App\Models\SecurityModule\MRFRequestTravelDetailRevision;
use App\Mail\SecurityModule\MRFSubmissionEmail;
use App\Mail\SecurityModule\SecurityReminderMRFSubmissionEmail;
use App\Mail\SecurityModule\iMMAPerReminderMRFApprovalEmail;
use App\Mail\SecurityModule\DomesticTravelDisapprovedMailForGlobalSecurity;
use App\Mail\SecurityModule\NotifyMRFTravel;
use App\Mail\SecurityModule\NotifySBPManagersMRFApprovedEmail;
use App\Mail\SecurityModule\SecurityReminderAfterApprovalMRFSubmissionEmail;
use App\Mail\SecurityModule\NotifyIMMAPerCheckInMRFEmail;
use App\Models\Country;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use PDF;
use App\Traits\SecurityModule\MRFTrait;
use Carbon\Carbon;

// Manage every request related to tha MRF
class MRFRequestController extends Controller
{
    use MRFTrait;

    protected $singular = 'domestic request';
    protected $fillable = [
        'country_id', 'country_name', 'purpose', 'criticality_of_the_movement',
        'status', 'name', 'travel_type', 'transportation_type', 'security_measure',
        'vehicle_filled_by_yourself', 'risk_level'
    ];
    protected $basicRules = [
        'transportation_type' => 'required|string|in:air-travel,ground-travel,air-and-ground-travel',
        'country_id' => 'required|integer|exists:countries,id',
        'country_name' => 'required|string|exists:countries,name',
        'vehicle_filled_by_immaper' => 'sometimes|nullable|string|in:yes,no',
        'vehicle_filled_by_yourself' => 'sometimes|nullable|string|in:yes,no',
        'purpose' => 'required|string',
        'edit_flight_number' => 'required|boolean',
        'risk_level' => 'required|string|in:High,Moderate,Low,Negligible,Unknown',
        'travel_type' => 'required|string|in:one-way-trip,round-trip,multi-location',
        'status' => 'sometimes|nullable|in:not submit,saved,submit,submitted,approved,disapproved,revision',
        'criticality_of_the_movement' => 'required_if:transportation_type,ground-travel,air-and-ground-travel|string|in:routine,essential,critical',
        'itineraries' => 'required|array',
        'itineraries.*.date_time' => 'required|date_format:Y-m-d H:i:s',
        'itineraries.*.return_date_time' => 'sometimes|nullable|date_format:Y-m-d H:i:s',
        'itineraries.*.etd' => 'sometimes|nullable|date_format:H:i',
        'itineraries.*.from_city' => 'required|string',
        'itineraries.*.to_city' => 'required|string',
        'itineraries.*.flight_number' => 'sometimes|nullable|string',
        'itineraries.*.flight_number_outbound_trip' => 'sometimes|nullable|string',
        'itineraries.*.flight_number_return_trip' => 'sometimes|nullable|string',
        'itineraries.*.eta' => 'sometimes|nullable|date_format:H:i',
        'itineraries.*.need_government_paper' => 'required|in:yes,no',
        'itineraries.*.need_government_paper_now' => 'sometimes|nullable|boolean',
        'itineraries.*.government_paper_id' => 'sometimes|nullable|integer|exists:attachments,id',
        'itineraries.*.overnight' => 'required|boolean',
        'itineraries.*.overnight_explanation' => 'sometimes|nullable|string',
        'itineraries.*.travelling_by' => 'sometimes|nullable|string',
        'itineraries.*.outbound_trip_final_destination' => 'sometimes|nullable|boolean',
        'isSubmit' => 'sometimes|nullable|boolean'
    ];

    protected function travelDetailRules($rules, $request, $vehicleFilledByImmaper)
    {
        if($this->checkTransportationByVehicle($request->itineraries)){
            $rules['travel_details'] = [
                function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                    if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                        if (empty($value)) {
                            $fail($attribute . ' is required ' . $value);
                        }
                    }
                },
                'array'
            ];

            if ($request->security_measure == 'use-of-hire-car') {
                $rules['travel_details.*.company_name'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.company_email'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.company_phone_number'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.company_driver'] = 'sometimes|nullable|string';
            } else {
                $rules['travel_details.*.vehicle_make'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.vehicle_model'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.vehicle_color'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.vehicle_plate'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.comm_gsm'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
                $rules['travel_details.*.comm_sat_phone'] = 'sometimes|nullable|string';
                $rules['travel_details.*.comm_vhf_radio'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if ($value != 0 && $value != 1) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'boolean'
                ];
                $rules['travel_details.*.comm_vhf_radio_call_sign'] = 'sometimes|nullable|string';
                $rules['travel_details.*.comm_sat_tracker'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if ($value != 0 && $value != 1) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'boolean'
                ];
                $rules['travel_details.*.ppe'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if ($value != 0 && $value != 1) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'boolean'
                ];
                $rules['travel_details.*.medical_kit'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if ($value != 0 && $value != 1) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'boolean'
                ];
                $rules['travel_details.*.personnel_on_board'] = [
                    function ($attribute, $value, $fail) use ($request, $vehicleFilledByImmaper) {
                        if (($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') && $vehicleFilledByImmaper) {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    },
                    'string'
                ];
            }
        }
        return $rules;
    }

    protected function rules(Request $request)
    {
        $vehicleFilledByImmaper = empty($request->vehicle_filled_by_immaper) ? 'yes' : $request->vehicle_filled_by_immaper;
        $rules = $this->basicRules;

        if($this->checkTransportationByVehicle($request->itineraries)){
            $rules['security_measure'] = [
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') {
                        if (empty($value)) {
                            $fail($attribute . ' is required ' . $value);
                        }
                    }
                },
                'string',
                'in:single-vehicle-movement,multiple-vehicle-movements,use-of-hire-car'
            ];

            $rules = $this->travelDetailRules($rules, $request, $vehicleFilledByImmaper);
        }

        return $rules;
    }

    protected function edit_rules($request)
    {
        $rules = $this->rules($request);
        $rules['itineraries.*.id'] = 'sometimes|nullable|integer|exists:security_module_mrf_request_itineraries,id';

        return $rules;
    }

    protected function securityUpdateRules(Request $request)
    {
        $vehicleFilledByImmaper = empty($request->vehicle_filled_by_immaper) ? 'yes' : $request->vehicle_filled_by_immaper;
        $isApproved = (empty($request->status) ? false : $request->status !== 'approved') ? false : true;
        $rules = [
            'transportation_type' => 'required|string|in:air-travel,ground-travel,air-and-ground-travel',
            'status' => $this->basicRules['status'],
            'vehicle_filled_by_immaper' => $this->basicRules['vehicle_filled_by_immaper'],
            'vehicle_filled_by_yourself' => $this->basicRules['vehicle_filled_by_yourself'],
            'disapproved_reasons' => 'sometimes|nullable|required_if:status,disapproved|string',
            'revision_needed' => 'sometimes|nullable|required_if:status,revision|string',
            'approved_comments' => 'sometimes|nullable|string',
            'security_assessment' => [
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') {
                        if ($request->status == 'approved') {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    }
                },
                'string'
            ],
            'movement_state' => [
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->transportation_type == 'ground-travel' || $request->transportation_type == 'air-and-ground-travel') {
                        if ($request->status == 'approved') {
                            if (empty($value)) {
                                $fail($attribute . ' is required ' . $value);
                            }
                        }
                    }
                },
                'string',
                'in:low-risk,moderate-risk,high-risk,lock-down'
            ],
            'security_measure_email' => 'sometimes|nullable|boolean',
            'security_measure_smart24' => 'sometimes|nullable|boolean',
            'security_measure_immap_careers' => 'sometimes|nullable|boolean',
        ];

        if ($isApproved) {
            $rules = $this->travelDetailRules($rules, $request, $vehicleFilledByImmaper);
        }

        return $rules;
    }

    // Create revision for each MRF
    protected function create_revision(int $id)
    {
        $new_record = MRFRequest::findOrFail($id);
        $revisionData = [
            'name' => $new_record->name,
            'transportation_type' => $new_record->transportation_type,
            'country_id' => $new_record->country_id,
            'country_name' => $new_record->country_name,
            'purpose' => $new_record->purpose,
            'criticality_of_the_movement' => $new_record->criticality_of_the_movement,
            'status' => $new_record->status,
            'mrf_request_id' => $new_record->id,
            'user_id' => $new_record->user_id,
            'submitted_date' => $new_record->submitted_date,
            'user_who_edit' => auth()->user()->id,
            'disapproved_reasons' => !empty($new_record->disapproved_reasons) ? $new_record->disapproved_reasons : null,
            'revision_needed' => !empty($new_record->revision_needed) ? $new_record->revision_needed : null,
            'approved_comments' => !empty($new_record->approved_comments) ? $new_record->approved_comments : null,
            'security_assessment' => !empty($new_record->security_assessment) ? $new_record->security_assessment : null,
            'security_measure' => !empty($new_record->security_measure) ? $new_record->security_measure : null,
            'movement_state' => !empty($new_record->movement_state) ? $new_record->movement_state : null,
            'travel_type' => !empty($new_record->travel_type) ? $new_record->travel_type : null,
            'security_measure_email' => $new_record->security_measure_email,
            'security_measure_smart24' => $new_record->security_measure_smart24,
            'security_measure_immap_careers' => $new_record->security_measure_immap_careers,
            'vehicle_filled_by_yourself' => $new_record->vehicle_filled_by_yourself,
            'risk_level' => $new_record->risk_level,
        ];

        $revision = MRFRequestRevision::create($revisionData);

        if ($revision) {
            foreach ($new_record->itineraries as $key => $itinerary) {
                $revision->itineraries()->create([
                    'date_time' => $itinerary['date_time'],
                    'return_date_time' => $itinerary['return_date_time'],
                    'from_city' => $itinerary['from_city'],
                    'to_city' => $itinerary['to_city'],
                    'flight_number' => $itinerary['flight_number'],
                    'flight_number_outbound_trip' => $itinerary['flight_number_outbound_trip'],
                    'flight_number_return_trip' => $itinerary['flight_number_return_trip'],
                    'need_government_paper' => $itinerary['need_government_paper'],
                    'need_government_paper_now' => $itinerary['need_government_paper_now'],
                    'government_paper_id' =>  $itinerary['need_government_paper'] == "yes" ? $itinerary['government_paper_id'] : null,
                    'overnight' => $itinerary['overnight'],
                    'overnight_explanation' =>  $itinerary['overnight_explanation'],
                    'travelling_by' =>  $itinerary['travelling_by'],
                    'outbound_trip_final_destination' =>  $itinerary['outbound_trip_final_destination'],
                    'etd' => $itinerary['etd'],
                    'eta' => $itinerary['eta'],
                    'order' => $key
                ]);
            }

            if (!empty($new_record->travel_details)) {
                foreach ($new_record->travel_details as $key => $detail) {
                    $revision->travel_details()->create([
                        'vehicle_make' => $detail['vehicle_make'],
                        'vehicle_model' => $detail['vehicle_model'],
                        'vehicle_color' => $detail['vehicle_color'],
                        'vehicle_plate' => $detail['vehicle_plate'],
                        'comm_gsm' => $detail['comm_gsm'],
                        'comm_sat_phone' => $detail['comm_sat_phone'],
                        'comm_vhf_radio' => $detail['comm_vhf_radio'],
                        'comm_vhf_radio_call_sign' => $detail['comm_vhf_radio_call_sign'],
                        'comm_sat_tracker' => $detail['comm_sat_tracker'],
                        'ppe' => $detail['ppe'],
                        'medical_kit' => $detail['medical_kit'],
                        'personnel_on_board' => $detail['personnel_on_board'],
                        'company_name' => $detail['company_name'],
                        'company_email' => $detail['company_email'],
                        'company_phone_number' => $detail['company_phone_number'],
                        'company_driver' => $detail['company_driver'],
                        'order' => $key
                    ]);
                }
            }

            return count($revision->itineraries) && count($revision->travel_details) ? true : false;
        } else {
            return false;
        }
    }

    // Get Government Access Paper data on MRF
    protected function getGovernmentPaper($record)
    {
        $media = $record->attachment;
        if (!empty($media)) {
            $media = $media->media->first();

            if (!empty($media)) {
                $record->government_paper = new \stdclass;
                $record->government_paper->file_id = $record->government_paper_id;
                $record->government_paper->filename = $media->file_name;
                $record->government_paper->download_url = $media->getFullUrlFromS3();
                $record->government_paper->file_url = $media->getFullUrlFromS3();
                $record->government_paper->mime = $media->mime_type;
            } else {
                $record->government_paper = null;
            }
            unset($record->attachment);
        }

        return $record;
    }

    // Get Air Ticket data on TAR
    protected function getAirTicket($record)
    {
        $media = $record->airTicket;
        if (!empty($media)) {
            $media = $media->media->first();

            if (!empty($media)) {
                $record->air_ticket = new \stdclass;
                $record->air_ticket->file_id = $record->air_ticket_id;
                $record->air_ticket->filename = $media->file_name;
                $record->air_ticket->download_url = $media->getFullUrlFromS3();
                $record->air_ticket->file_url = $media->getFullUrlFromS3();
                $record->air_ticket->mime = $media->mime_type;
            } else {
                $record->air_ticket = null;
            }
            unset($record->airTicket);
        }

        return $record;
    }

    // Generate pdf file for each MRF
    public function createPDF(int $id, bool $fromScript = false)
    {
        $record = MRFRequest::with([
            'country',
            'itineraries' => function ($query) {
                $query->orderBy('order', 'asc');
            },
            'travel_details' => function ($query) {
                $query->orderBy('order', 'asc');
            }
        ])->findOrFail($id);

        $data = ['mrf' => $record];

        $getLastEdit = $record->revisions()->orderBy('id', 'desc')->first();

        if (!empty($getLastEdit)) {
            $data['last_edit_user'] = $getLastEdit->last_edit_user;
        }

        if (!empty($record)) {
            if ($fromScript) {
                $pdf = $record->getMedia('mrf_pdf');
                if (!empty($pdf)) {
                    if (count($pdf)) {
                        foreach ($pdf as $mrfpdf) {
                            $mrfpdf->delete();
                        }
                    }
                }
            }

            $header = view('security-module.MRFPDFHeader')->render();
            $footer = view('security-module.MRFPDFFooter')->render();
            $date = date("Y-m-d");
            $dataAsc =  $record->itineraries()->orderBy('order','asc')->first();
            $travelDate = Carbon::parse($dataAsc->date_time)->format('d-m-Y');
            $slug = Str::slug($record->user->family_name);
            if($record->status == 'approved'){
                $fileName = 'Travel-request-' . $slug . '-' . $travelDate . '-approved'. '.pdf';
            }else{
                $fileName = 'Travel-request-' . $slug . '-' . $travelDate . '.pdf';
            }
            $path = storage_path("app/public/security-module/mrf/{$fileName}");

            if (is_file($path)) {
                unlink($path);
            }

            $view = view('security-module.MRFPDF', $data)->render();

            $pdf = PDF::loadHTML($view)
                ->setPaper('a4')
                ->setOption('margin-top', '38.1mm')
                ->setOption('margin-bottom', '27.4mm')
                ->setOption('margin-left', '25.4mm')
                ->setOption('margin-right', '25.4mm')
                ->setOption('footer-html', $footer)
                ->setOption('header-html', $header);

            $pdf->save($path);

            $record->addMedia($path)->toMediaCollection('mrf_pdf', 's3');

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
        $officers = User::select('id', 'full_name as name', 'immap_email')->permission('Approve Domestic Travel Request')
            ->whereHas('officer_country', function ($query) use ($record) {
                $query->where('country_id', $record->country_id);
            })->orderByDesc('id')->get();

        $officers = $officers->filter(function ($officer, $key) {
            return !$officer->hasPermissionTo('Approve Global Travel Request');
        })->pluck('immap_email')->toArray();

        if (count($officers) == 0) {
            $officers = User::select('id', 'full_name as name', 'immap_email')->permission('Approve Domestic Travel Request')->permission('Approve Global Travel Request')->orderByDesc('id')->get();
            $officers = $officers->filter(function ($officer, $key) {
                return !$officer->hasPermissionTo('Set as Admin');
            })->pluck('immap_email')->toArray();
        }

        if (count($officers)) {
            if (empty($replyTo)) {
                if($prevStatus == 'approved'){
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderAfterApprovalMRFSubmissionEmail($status, $record));
                }else{
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderMRFSubmissionEmail($status, $record));
                }
            } else {
                if($prevStatus == 'approved'){
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderAfterApprovalMRFSubmissionEmail($status, $record, $replyTo));
                }else{
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new SecurityReminderMRFSubmissionEmail($status, $record, $replyTo));
                }
            }
        }

        return true;
    }

    /**
     * @SWG\Get(
     *   path="/api/security-module/mrf/{id}/pdf",
     *   tags={"Security Module"},
     *   summary="Get specific pdf file of domestic request (MRF)",
     *   description="File: app\Http\Controllers\API\MRFRequestController@getMRFPDF, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function getMRFPDF($id)
    {
        $record = MRFRequest::findOrFail($id);
        $authUser = auth()->user();

        if (($record->user_id !== $authUser->id) && !$authUser->hasAnyPermission(['Approve Global Travel Request', 'Approve Domestic Travel Request', 'View Other Travel Request', 'View SBP Travel Request', 'View Only On Security Page'])) {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        $pdf = $record->getMedia('mrf_pdf');
        $pdf = empty($pdf) ? '' : $pdf[0]->getFullUrlFromS3();

        return response()->success(__('crud.success.default'), $pdf);
    }

    // Create MRF, store new MRF when no record exists in database
    /**
     * @SWG\Post(
     *   path="/api/security-module/mrf",
     *   tags={"Security Module"},
     *   summary="Store domestic travel (MRF) request",
     *   description="File: app\Http\Controllers\API\MRFRequestController@store, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="mrf",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"country_id", "country_name", "purpose", "travel_type", "status", "criticality_of_the_movement", "itineraries"},
     *              @SWG\Property(property="country_id", type="integer", description="Country id", example=1),
     *              @SWG\Property(property="country_name", type="string", description="Country name", example="Indonesia"),
     *              @SWG\Property(property="risk_level", type="string", description="Risk Level", example="Low"),
     *              @SWG\Property(property="vehicle_filled_by_immaper", type="string", enum={"yes","no"}, description="Is the vehicle details filled by iMMAPer (value: yes/no)", example="yes"),
     *              @SWG\Property(property="vehicle_filled_by_yourself", type="string", enum={"yes","no"}, description="Is the vehicle details filled by yourself (value: yes/no)", example="yes"),
     *              @SWG\Property(property="purpose", type="string", description="Purpose & Justification", example="Purpose of the domestic travel"),
     *              @SWG\Property(property="travel_type", type="string", enum={"round-trip", "multi-location"}, description="Travel Type, round trip or multi location", example="round-trip"),
     *              @SWG\Property(property="status", type="string", enum={"not submit", "saved", "submit", "submitted", "approved", "disapproved", "revision"}, description="Domestic request status", example="saved"),
     *              @SWG\Property(property="criticality_of_the_movement", type="integer", description="Security Module Critical Movement id", example=1),
     *              @SWG\Property(property="itineraries", type="array", description="Domestic travel request itineraries",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="date_time", format="date", type="string", description="Travel Date / Departure date [Date format: 2020-12-10 13:45:01]", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="travelling_by", format="string", type="string", enum={"Vehicle", "Train", "Boat"}, description="Travelling BY", example="Train"),
     *                      @SWG\Property(property="return_date_time", format="date", type="string", description="Return date [Date format: 2020-12-10 13:45:01] (Can be empty)", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="from_city", format="string", type="string", description="From City", example="Marseille"),
     *                      @SWG\Property(property="to_city", format="string", type="string", description="To City", example="Paris"),
     *                      @SWG\Property(property="need_government_paper", type="string", enum={"yes", "no"}, description="Is this trip need government paper? (Yes, No)", example="yes"),
     *                      @SWG\Property(property="need_government_paper_now", type="integer", enum={0,1}, description="Attach Your Government Paper Now? (0 = no, 1 = yes)", example=1),
     *                      @SWG\Property(property="government_paper_id", type="integer", description="Attachment ID (Required if need_government_paper == yes & need_government_paper_now == 1)", example=1000),
     *                      @SWG\Property(property="overnight", type="integer", enum={0,1}, description="Overnight is required? (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="overnight_explanation", type="string", description="Overnight explanation required if overnight == 1", example="Overnight explanation"),
     *                      @SWG\Property(property="flight_number", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_outbound_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_return_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="outbound_trip_final_destination", type="integer", enum={0,1}, description="outbound trip final destination (yes = 1, no = 0)", example=1),
     *                  )
     *              ),
     *              @SWG\Property(property="travel_details", type="array", description="Travel details on Domestic travel request (required if vehicle_filled_by_immaper == yes)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="vehicle_make", type="string", description="Vehicle make (required if vehicle_filled_by_immaper == yes)", example="Toyota"),
     *                      @SWG\Property(property="vehicle_model", type="string", description="Vehicle model (required if vehicle_filled_by_immaper == yes)", example="Land Cruiser"),
     *                      @SWG\Property(property="vehicle_color", type="string", description="Vehicle color (required if vehicle_filled_by_immaper == yes)", example="Black"),
     *                      @SWG\Property(property="vehicle_plate", type="string", description="Vehicle plate (required if vehicle_filled_by_immaper == yes)", example="BK 9999 CMD"),
     *                      @SWG\Property(property="comm_gsm", type="string", description="GSM Communication (required if vehicle_filled_by_immaper == yes)", example="+44889898999"),
     *                      @SWG\Property(property="comm_sat_phone", type="string", description="Sat Phone Communication (can be empty)", example="0897832823"),
     *                      @SWG\Property(property="comm_vhf_radio", type="integer", enum={0,1}, description="Use VHF Radio Communication [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="comm_vhf_radio_call_sign", type="string", description="Call Sign of VHF Radio", example="ABCD"),
     *                      @SWG\Property(property="comm_sat_tracker", type="integer", enum={0,1}, description="Use Sat Tracker Communication [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="ppe", type="integer", enum={0,1}, description="Use PPE [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="medical_kit", type="integer", enum={0,1}, description="Use Medical Kit [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="personnel_on_board", type="string", description="Personnel on board", example="iMMAP Driver and iMMAPer"),
     *                      @SWG\Property(property="company_name", type="string", description="Company Nmae", example="Name of Company"),
     *                      @SWG\Property(property="company_email", type="email", description="Company Email", example="example@mail.com"),
     *                      @SWG\Property(property="company_phone_number", type="string", description="Company Phone Number", example="0995307252"),
     *                      @SWG\Property(property="company_driver", type="string", description="Company's driver details", example="Joe Doe")
     *                  )
     *              ),
     *              @SWG\Property(property="security_measure", type="integer", description="Security measure id, should be exist in security_module_security_measures table", example=1),
     *              @SWG\Property(property="isSubmit", type="integer", enum={0,1}, description="Submit or save (0 = save, 1 = submit) can be empty also", example="0"),
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
        $validatedData = $this->validate($request, $this->rules($request));

        $user = auth()->user();
        $recordData = $request->only($this->fillable);
        $recordData['user_id'] = $user->id;
        if ($request->isSubmit) {
            $recordData['submitted_date'] = date("Y-m-d H:i:s");
            $recordData['status'] = 'submitted';
        }

        $record = MRFRequest::create($recordData);

        if ($record) {

            if (empty($request->status)) {
                $date = date("dmy", strtotime($request->itineraries[0]['date_time']));
                $record->fill(['name' => 'DOM-' . $user->family_name . '-' . $date])->save();
            }

            foreach ($request->itineraries as $key => $itinerary) {
                $record->itineraries()->create([
                    'date_time' => $itinerary['date_time'],
                    'return_date_time' => $itinerary['return_date_time'],
                    'from_city' => $itinerary['from_city'],
                    'to_city' => $itinerary['to_city'],
                    'flight_number' => $itinerary['flight_number'],
                    'flight_number_outbound_trip' => $itinerary['flight_number_outbound_trip'],
                    'flight_number_return_trip' => $itinerary['flight_number_return_trip'],
                    'need_government_paper' => $itinerary['need_government_paper'],
                    'need_government_paper_now' => $itinerary['need_government_paper_now'],
                    'government_paper_id' =>  $itinerary['need_government_paper'] == "yes" ? $itinerary['government_paper_id'] : null,
                    'overnight' => $itinerary['overnight'],
                    'overnight_explanation' => $itinerary['overnight_explanation'],
                    'travelling_by' =>  $itinerary['travelling_by'],
                    'outbound_trip_final_destination' => $itinerary['outbound_trip_final_destination'],
                    'etd' => $itinerary['etd'],
                    'eta' => $itinerary['eta'],
                    'order' => $key
                ]);
            }

            $vehicleFilledByImmaper = empty($request->vehicle_filled_by_immaper) ? 'yes' : $request->vehicle_filled_by_immaper;
            $vehicleFilledByYourself = empty($request->vehicle_filled_by_yourself) ? 'yes' : $request->vehicle_filled_by_yourself;
            if ((($record->transportation_type == "ground-travel" || $record->transportation_type == "air-and-ground-travel") && $this->checkTransportationByVehicle($record->itineraries) && $vehicleFilledByImmaper == "yes") ||
                (($record->transportation_type == "ground-travel" || $record->transportation_type == "air-and-ground-travel") && $this->checkTransportationByVehicle($record->itineraries) && $vehicleFilledByImmaper == "no" && $vehicleFilledByYourself == 'yes')
            ) {
                foreach ($request->travel_details as $key => $detail) {
                    $record->travel_details()->create([
                        'vehicle_make' => $detail['vehicle_make'],
                        'vehicle_model' => $detail['vehicle_model'],
                        'vehicle_color' => $detail['vehicle_color'],
                        'vehicle_plate' => $detail['vehicle_plate'],
                        'comm_gsm' => $detail['comm_gsm'],
                        'comm_sat_phone' => $detail['comm_sat_phone'],
                        'comm_vhf_radio' => $detail['comm_vhf_radio'],
                        'comm_vhf_radio_call_sign' => $detail['comm_vhf_radio_call_sign'],
                        'comm_sat_tracker' => $detail['comm_sat_tracker'],
                        'ppe' => $detail['ppe'],
                        'medical_kit' => $detail['medical_kit'],
                        'personnel_on_board' => $detail['personnel_on_board'],
                        'company_name' => $detail['company_name'],
                        'company_email' => $detail['company_email'],
                        'company_phone_number' => $detail['company_phone_number'],
                        'company_driver' => $detail['company_driver'],
                        'order' => $key
                    ]);
                }
            }

            if ($request->isSubmit) {
                $revision = $this->create_revision($record->id);
                Mail::to(auth()->user()->immap_email)->send(new MRFSubmissionEmail('submitted', auth()->user(), $record));
                $this->sendReminder('submitted', $record, auth()->user()->immap_email);
            }

            $this->createPDF($record->id);

            return response()->success(__('crud.success.store', ['singular' => ucwords($this->singular)]), $record, ResponseCode::HTTP_CREATED);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    // Update MRF
    /**
     * @SWG\Post(
     *   path="/api/security-module/mrf/{id}",
     *   tags={"Security Module"},
     *   summary="Update specific domestic travel (MRF) request",
     *   description="File: app\Http\Controllers\API\MRFRequestController@update, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="MRF id"),
     *   @SWG\Parameter(
     *          name="mrf",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "country_id", "purpose", "travel_type", "status", "criticality_of_the_movement", "itineraries"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="country_id", type="integer", description="Country id", example=1),
     *              @SWG\Property(property="country_name", type="string", description="Country name", example="Indonesia"),
     *              @SWG\Property(property="risk_level", type="string", description="Risk Level", example="Low"),
     *              @SWG\Property(property="vehicle_filled_by_immaper", type="string", enum={"yes","no"}, description="Is the vehicle details filled by iMMAPer (value: yes/no)", example="yes"),
     *              @SWG\Property(property="vehicle_filled_by_yourself", type="string", enum={"yes","no"}, description="Is the vehicle details filled by yourself (value: yes/no)", example="yes"),
     *              @SWG\Property(property="purpose", type="string", description="Purpose & Justification", example="Purpose of the domestic travel"),
     *              @SWG\Property(property="travel_type", type="string", enum={"round-trip", "multi-location"}, description="Travel Type, round trip or multi location", example="round-trip"),
     *              @SWG\Property(property="status", type="string", enum={"not submit", "saved", "submit", "submitted", "approved", "disapproved", "revision"}, description="Domestic request status", example="saved"),
     *              @SWG\Property(property="criticality_of_the_movement", type="integer", description="Security Module Critical Movement id", example=1),
     *              @SWG\Property(property="itineraries", type="array", description="Domestic travel request itineraries",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Itinerary ID if itinerary exist (can be empty, it will create new record)", example=1),
     *                      @SWG\Property(property="date_time", format="date", type="string", description="Travel Date / Departure date [Date format: 2020-12-10 13:45:01]", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="travelling_by", format="string", type="string", enum={"Vehicle", "Train", "Boat"}, description="Travelling BY", example="Train"),
     *                      @SWG\Property(property="return_date_time", format="date", type="string", description="Return date [Date format: 2020-12-10 13:45:01] (Can be empty)", example="2020-11-17 15:25:14"),
     *                      @SWG\Property(property="from_city", type="string", description="From City", example="Marseille"),
     *                      @SWG\Property(property="to_city", type="string", description="To City", example="Paris"),
     *                      @SWG\Property(property="need_government_paper", type="string", enum={"yes", "no"}, description="Is this trip need government paper? (Yes, No, Not Applicable)", example="yes"),
     *                      @SWG\Property(property="need_government_paper_now", type="integer", enum={0,1}, description="Attach Your Government Paper Now? (0 = no, 1 = yes)", example=1),
     *                      @SWG\Property(property="government_paper_id", type="integer", description="Attachment ID (Required if need_government_paper == yes)", example=1000),
     *                      @SWG\Property(property="overnight", type="integer", enum={0,1}, description="Overnight is required? (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="overnight_explanation", type="string", description="Overnight explanation required if overnight == 1", example="Overnight explanation"),
     *                      @SWG\Property(property="flight_number", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_outbound_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="flight_number_return_trip", type="string", description="Flight Number", example="234554"),
     *                      @SWG\Property(property="outbound_trip_final_destination", type="integer", enum={0,1}, description="outbound trip final destination (yes = 1, no = 0)", example=1),
     *                  )
     *              ),
     *              @SWG\Property(property="travel_details", type="array", description="Travel details on Domestic travel request (required if vehicle_filled_by_immaper == yes)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="vehicle_make", type="string", description="Vehicle make (required if vehicle_filled_by_immaper == yes)", example="Toyota"),
     *                      @SWG\Property(property="vehicle_model", type="string", description="Vehicle model (required if vehicle_filled_by_immaper == yes)", example="Land Cruiser"),
     *                      @SWG\Property(property="vehicle_color", type="string", description="Vehicle color (required if vehicle_filled_by_immaper == yes)", example="Black"),
     *                      @SWG\Property(property="vehicle_plate", type="string", description="Vehicle plate (required if vehicle_filled_by_immaper == yes)", example="BK 9999 CMD"),
     *                      @SWG\Property(property="comm_gsm", type="string", description="GSM Communication (required if vehicle_filled_by_immaper == yes)", example="+44889898999"),
     *                      @SWG\Property(property="comm_sat_phone", type="string", description="Sat Phone Communication (can be empty)", example="0897832823"),
     *                      @SWG\Property(property="comm_vhf_radio", type="integer", enum={0,1}, description="Use VHF Radio Communication [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="comm_vhf_radio_call_sign", type="integer", enum={0,1}, description="Call Sign for VHF Radio", example="ABCD"),
     *                      @SWG\Property(property="comm_sat_tracker", type="integer", enum={0,1}, description="Use Sat Tracker Communication [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="ppe", type="integer", enum={0,1}, description="Use PPE [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="medical_kit", type="integer", enum={0,1}, description="Use Medical Kit [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == yes)", example=0),
     *                      @SWG\Property(property="personnel_on_board", type="string", description="Personnel on board", example="iMMAP Driver and iMMAPer"),
     *                      @SWG\Property(property="company_name", type="string", description="Company Nmae", example="Name of Company"),
     *                      @SWG\Property(property="company_email", type="email", description="Company Email", example="example@mail.com"),
     *                      @SWG\Property(property="company_phone_number", type="string", description="Company Phone Number", example="0995307252"),
     *                      @SWG\Property(property="company_driver", type="string", description="Company's driver details", example="Joe Doe")
     *
     *                  )
     *              ),
     *              @SWG\Property(property="security_measure", type="integer", description="Security measure id, should be exist in security_module_security_measures table", example=1),
     *              @SWG\Property(property="isSubmit", type="integer", enum={0,1}, description="Submit or save (0 = save, 1 = submit) can be empty also", example="0"),
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
        $validatedData = $this->validate($request, $this->edit_rules($request));

        $auth_user_id = auth()->user()->id;
        $firstSubmit = false;
        $record = MRFRequest::findOrFail($id);
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

        $date = date("dmy", strtotime($request->itineraries[0]['date_time']));
        $recordData['name'] = 'DOM-' . $record->user->family_name . '-' . $date;

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
                    'date_time' => $itinerary['date_time'],
                    'return_date_time' => $itinerary['return_date_time'],
                    'from_city' => $itinerary['from_city'],
                    'to_city' => $itinerary['to_city'],
                    'flight_number' => $itinerary['flight_number'],
                    'flight_number_outbound_trip' => $itinerary['flight_number_outbound_trip'],
                    'flight_number_return_trip' => $itinerary['flight_number_return_trip'],
                    'need_government_paper' => $itinerary['need_government_paper'],
                    'need_government_paper_now' => $itinerary['need_government_paper_now'],
                    'government_paper_id' =>  $itinerary['need_government_paper'] == "yes" ? $itinerary['government_paper_id'] : null,
                    'overnight' => $itinerary['overnight'],
                    'overnight_explanation' => $itinerary['overnight_explanation'],
                    'travelling_by' =>  $itinerary['travelling_by'],
                    'outbound_trip_final_destination' => $itinerary['outbound_trip_final_destination'],
                    'etd' => $itinerary['etd'],
                    'eta' => $itinerary['eta'],
                    'order' => $key
                ];

                if (!empty($itinerary['id'])) {
                    $oldItinerary = $record->itineraries()->where('id', $itinerary['id'])->first();
                    if (!empty($oldItinerary)) {
                        $oldItinerary->fill($itineraryData);

                        if (!$oldItinerary->isClean()) {
                            $oldItinerary->save();
                        }
                    }
                } else {
                    $record->itineraries()->create($itineraryData);
                }
            }
            $vehicleFilledByImmaper = empty($request->vehicle_filled_by_immaper) ? 'yes' : $request->vehicle_filled_by_immaper;
            $vehicleFilledByYourself = empty($request->vehicle_filled_by_yourself) ? 'yes' : $request->vehicle_filled_by_yourself;
            if ((($record->transportation_type == "ground-travel" || $record->transportation_type == "air-and-ground-travel") && $this->checkTransportationByVehicle($record->itineraries) && $vehicleFilledByImmaper == "yes") ||
                (($record->transportation_type == "ground-travel" || $record->transportation_type == "air-and-ground-travel") && $this->checkTransportationByVehicle($record->itineraries) && $vehicleFilledByImmaper == "no" && $vehicleFilledByYourself == 'yes')
            ) {
                $oldTravelDetails = $record->travel_details->pluck('id');
                $newTravelDetails = Arr::pluck($request->travel_details, 'id');
                $deletedTravelDetails = $oldTravelDetails->filter(function ($id, $key) use ($newTravelDetails) {
                    return !in_array($id, $newTravelDetails);
                });

                if (!empty($deletedTravelDetails)) {
                    $record->travel_details()->whereIn('id', $deletedTravelDetails)->delete();
                }

                foreach ($request->travel_details as $key => $detail) {
                    $detailData = [
                        'vehicle_make' => $detail['vehicle_make'],
                        'vehicle_model' => $detail['vehicle_model'],
                        'vehicle_color' => $detail['vehicle_color'],
                        'vehicle_plate' => $detail['vehicle_plate'],
                        'comm_gsm' => $detail['comm_gsm'],
                        'comm_sat_phone' => $detail['comm_sat_phone'],
                        'comm_vhf_radio' => $detail['comm_vhf_radio'],
                        'comm_vhf_radio_call_sign' => $detail['comm_vhf_radio_call_sign'],
                        'comm_sat_tracker' => $detail['comm_sat_tracker'],
                        'ppe' => $detail['ppe'],
                        'medical_kit' => $detail['medical_kit'],
                        'personnel_on_board' => $detail['personnel_on_board'],
                        'company_name' => $detail['company_name'],
                        'company_email' => $detail['company_email'],
                        'company_phone_number' => $detail['company_phone_number'],
                        'company_driver' => $detail['company_driver'],
                        'order' => $key
                    ];

                    if (!empty($detail['id'])) {
                        $oldDetail = $record->travel_details()->where('id', $detail['id'])->first();
                        if (!empty($oldDetail)) {
                            $oldDetail->fill($detailData);
                            if (!$oldDetail->isClean()) {
                                $oldDetail->save();
                            }
                        }
                    } else {
                        $record->travel_details()->create($detailData);
                    }
                }
            }

            if ($request->isSubmit) {
                $revision = $this->create_revision($record->id);
                if($validatedData['edit_flight_number'] == false){
                    if ($firstSubmit) {
                        Mail::to(auth()->user()->immap_email)->send(new MRFSubmissionEmail('submitted', auth()->user(), $record));
                        $this->sendReminder('submitted', $record, auth()->user()->immap_email);
                    } else {
                        Mail::to(auth()->user()->immap_email)->send(new MRFSubmissionEmail('resubmitted', auth()->user(), $record));
                        if($prevStatus == 'approved') {
                            $this->sendReminder('resubmitted', $record, auth()->user()->immap_email, 'approved');
                        }else{
                            $this->sendReminder('resubmitted', $record, auth()->user()->immap_email);
                        }
                    }
                }
            }

            $pdf = $record->getMedia('mrf_pdf');
            if (!empty($pdf)) {
                if (count($pdf)) {
                    foreach ($pdf as $mrfpdf) {
                        $mrfpdf->delete();
                    }
                }
            }

            $this->createPDF($record->id);
            $record = MRFRequest::findOrFail($record->id);

            return response()->success(__('crud.success.update', ['singular' => ucwords($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    // Delete the MRF
    /**
     * @SWG\Delete(
     *   path="/api/security-module/mrf/{id}",
     *   tags={"Security Module"},
     *   summary="Delete specific domestic travel (MRF) request",
     *   description="File: app\Http\Controllers\API\MRFRequestController@destroy, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="MRF id"),
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

        $record = MRFRequest::findOrFail($id);

        if (($record->user_id !== $authUser->id) && !$authUser->hasAnyPermission(['Approve Global Travel Request', 'Approve Domestic Travel Request'])) {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        $this->deleteMRFItineraryFiles($record->itineraries);

        $result = $record->delete();

        if ($result) {
            return response()->success(__('crud.success.delete', ['singular' => ucwords($this->singular)]), $record);
        }

        return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
    }

    // Get MRF Request
    /**
     * @SWG\Get(
     *   path="/api/security-module/mrf/{user}/show/{id}",
     *   tags={"Security Module"},
     *   summary="Get specific domestic request (MRF) for iMMAPer or Security POV",
     *   description="File: app\Http\Controllers\API\MRFRequestController@show, Should be an iMMAPer, Permission: Can Make Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="user", in="path", required=true, type="string", enum={"immaper","security"}, description="iMMAPer or Security"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="MRF id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=403, description="Sorry you cannot access this data"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function show($user = 'immaper', $id)
    {
        $auth_user = auth()->user();

        $record = MRFRequest::with([
            'country' => function ($query) {
                $query->select('id', 'id as value', 'name as label', 'vehicle_filled_by_immaper');
            },
            'itineraries' => function ($query) {
                $query->orderBy('order', 'asc');
            },
            'travel_details' => function ($query) {
                $query->orderBy('order', 'asc');
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

        if ($record->user_id != $auth_user->id && $user == 'immaper') {
            return response()->error('Sorry you cannot access this data', Response::HTTP_FORBIDDEN);
        }

        if ($record->itineraries->count() > 0) {
            $itineraries = $record->itineraries->map(function ($itinerary) {
                $itinerary->etd = empty($itinerary->etd) ? null : substr($itinerary->etd, 0, -3);
                $itinerary->eta = empty($itinerary->eta) ? null : substr($itinerary->eta, 0, -3);
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
                if ($itinerary->upload_air_ticket !== 'yes') {
                    $itinerary->air_ticket = null;
                } else {
                    if ($itinerary->upload_air_ticket_now == 1) {
                        $media = $itinerary->airTicket;
                        if (!empty($media)) {
                            $media = $media->media->first();

                            if (!empty($media)) {
                                $itinerary->air_ticket = new \stdclass;
                                $itinerary->air_ticket->file_id = $itinerary->air_ticket_id;
                                $itinerary->air_ticket->filename = $media->file_name;
                                $itinerary->air_ticket->download_url = $media->getFullUrlFromS3();
                                $itinerary->air_ticket->file_url = $media->getFullUrlFromS3();
                                $itinerary->air_ticket->mime = $media->mime_type;
                            } else {
                                $itinerary->air_ticket = null;
                            }
                            unset($itinerary->airTicket);
                        } else {
                            $itinerary->air_ticket = null;
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

        // Needed if we want to show all revisions
        // $revisions = $record->revisions;
        // if (!empty($revisions)) {
        //     foreach($revisions as $revision) {
        //         $revision = $this->getGovernmentPaper($revision);
        //     }
        // }

        return response()->success(__('crud.success.default', ['singular' => ucwords($this->singular)]), $record);
    }

    // Update MRF Request from security POV
    /**
     *   @SWG\Post(
     *   path="/api/security-module/mrf/{id}/security-update",
     *   tags={"Security Module"},
     *   summary="Update specific domestic travel (MRF) request from security POV",
     *   description="File: app\Http\Controllers\API\MRFRequestController@security_update, Should be an iMMAPer, Permission: Approve Domestic Travel Request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="MRF id"),
     *   @SWG\Parameter(
     *          name="mrf",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"status", "travel_details", "security_assessment", "security_measure", "movement_state"},
     *              @SWG\Property(property="status", type="string", enum={"not submit", "saved", "submit", "submitted", "approved", "disapproved", "revision"}, description="Domestic request status", example="saved"),
     *              @SWG\Property(property="vehicle_filled_by_immaper", type="string", enum={"yes","no"}, description="Is the vehicle details filled by iMMAPer (value: yes/no)", example="yes"),
     *              @SWG\Property(property="vehicle_filled_by_yourself", type="string", enum={"yes","no"}, description="Is the vehicle details filled by yourself (value: yes/no)", example="yes"),
     *              @SWG\Property(property="disapproved_reasons", type="string", description="Disapproved reasons, required if status == disapproved", example="Disapproved because of ...."),
     *              @SWG\Property(property="revision_needed", type="string", description="Revision explanation, required if status == revision", example="Something need to be revised ..."),
     *              @SWG\Property(property="approved_comments", type="string", description="Approved comments, required if status == approved", example="Approve comments"),
     *              @SWG\Property(property="security_assessment", type="string", description="Security Assessment from security officer", example="Assessment from security officer"),
     *              @SWG\Property(property="movement_state", type="integer", description="Movement state id, should be exist in security_module_movement_states table", example="1"),
     *              @SWG\Property(property="security_measure_email", type="integer", enum={0,1}, description="For air travel approval, 1 for using email", example="1"),
     *              @SWG\Property(property="security_measure_smart24", type="integer", enum={0,1}, description="For air travel approval, 1 for using smart24", example="1"),
     *              @SWG\Property(property="security_measure_immap_careers", type="integer", enum={0,1}, description="For air travel approval, 1 for using 3iSolution Careers", example="1"),
     *              @SWG\Property(property="travel_details", type="array", description="Travel details on Domestic travel request (required if vehicle_filled_by_immaper == no and status == approved)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="vehicle_make", type="string", description="Vehicle make (required if vehicle_filled_by_immaper == no and status == approved)", example="Toyota"),
     *                      @SWG\Property(property="vehicle_model", type="string", description="Vehicle model (required if vehicle_filled_by_immaper == no and status == approved)", example="Land Cruiser"),
     *                      @SWG\Property(property="vehicle_color", type="string", description="Vehicle color (required if vehicle_filled_by_immaper == no and status == approved)", example="Black"),
     *                      @SWG\Property(property="vehicle_plate", type="string", description="Vehicle plate (required if vehicle_filled_by_immaper == no and status == approved)", example="BK 9999 CMD"),
     *                      @SWG\Property(property="comm_gsm", type="string", description="GSM Communication (required if vehicle_filled_by_immaper == no and status == approved)", example="+44889898999"),
     *                      @SWG\Property(property="comm_sat_phone", type="string", description="Sat Phone Communication (can be empty)", example="0897832823"),
     *                      @SWG\Property(property="comm_vhf_radio", type="integer", enum={0,1}, description="Use VHF Radio Communication [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == no and status == approved)", example=0),
     *                      @SWG\Property(property="comm_vhf_radio_call_sign", type="string", enum={0,1}, description="Call Sign Of VHF Radio", example="ABC123"),
     *                      @SWG\Property(property="comm_sat_tracker", type="integer", enum={0,1}, description="Use Sat Tracker Communication [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == no and status == approved)", example=0),
     *                      @SWG\Property(property="ppe", type="integer", enum={0,1}, description="Use PPE [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == no and status == approved)", example=0),
     *                      @SWG\Property(property="medical_kit", type="integer", enum={0,1}, description="Use Medical Kit [0 = no, 1 = yes] (required if vehicle_filled_by_immaper == no and status == approved)", example=0),
     *                      @SWG\Property(property="personnel_on_board", type="string", description="Personnel on board", example="iMMAP Driver and iMMAPer")
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
    public function security_update(Request $request, $id)
    {
        $validatedData = $this->validate($request,  $this->securityUpdateRules($request));

        $record = MRFRequest::findOrFail($id);

        $record->fill($request->only([
            'status', 'disapproved_reasons', 'revision_needed', 'approved_comments',
            'security_assessment', 'movement_state',
            'security_measure_email', 'security_measure_smart24', 'security_measure_immap_careers'
        ]))->save();

        if ($record) {
            $vehicleFilledByImmaper = empty($request->vehicle_filled_by_immaper) ? 'yes' : $request->vehicle_filled_by_immaper;
            $vehicleFilledByYourself = empty($request->vehicle_filled_by_yourself) ? 'yes' : $request->vehicle_filled_by_yourself;
            if ((($record->transportation_type == "ground-travel" || $record->transportation_type == "air-and-ground-travel") && $this->checkTransportationByVehicle($record->itineraries) && $vehicleFilledByImmaper == 'no' && $vehicleFilledByYourself == 'no' && $request->status == 'approved')) {
                $oldTravelDetails = $record->travel_details->pluck('id');
                $newTravelDetails = Arr::pluck($request->travel_details, 'id');
                $deletedTravelDetails = $oldTravelDetails->filter(function ($id, $key) use ($newTravelDetails) {
                    return !in_array($id, $newTravelDetails);
                });

                if (!empty($deletedTravelDetails)) {
                    $record->travel_details()->whereIn('id', $deletedTravelDetails)->delete();
                }

                foreach ($request->travel_details as $key => $detail) {
                    $detailData = [
                        'vehicle_make' => $detail['vehicle_make'],
                        'vehicle_model' => $detail['vehicle_model'],
                        'vehicle_color' => $detail['vehicle_color'],
                        'vehicle_plate' => $detail['vehicle_plate'],
                        'comm_gsm' => $detail['comm_gsm'],
                        'comm_sat_phone' => $detail['comm_sat_phone'],
                        'comm_vhf_radio' => $detail['comm_vhf_radio'],
                        'comm_vhf_radio_call_sign' => $detail['comm_vhf_radio_call_sign'],
                        'comm_sat_tracker' => $detail['comm_sat_tracker'],
                        'ppe' => $detail['ppe'],
                        'medical_kit' => $detail['medical_kit'],
                        'personnel_on_board' => $detail['personnel_on_board'],
                        'order' => $key
                    ];

                    if (!empty($detail['id'])) {
                        $oldDetail = $record->travel_details()->where('id', $detail['id'])->first();
                        if(!empty($oldDetail)) {
                            $oldDetail->fill($detailData);
                            if(!$oldDetail->isClean()) {
                                $oldDetail->save();
                            }
                        }
                    } else {
                        $record->travel_details()->create($detailData);
                    }
                }
            }

            $revision = $this->create_revision($record->id);
            $record = MRFRequest::findOrFail($record->id);

            $country = Country::select('id','name','country_code')
                                ->where('id',$record->country_id)
                                ->with('user_officer:id,full_name,email,immap_email')
                                ->first();

            $advisor = $country->user_officer->first();

            if ($advisor) {
                $userAdvisor = User::find($advisor->id);

                if (!($userAdvisor->hasPermissionTo('Approve Domestic Travel Request') && !$userAdvisor->hasPermissionTo('Approve Global Travel Request'))) {
                    $advisor = null;
                }
            }

            $pdf = $record->getMedia('mrf_pdf');
            if (!empty($pdf)) {
                if (count($pdf)) {
                    foreach ($pdf as $mrfpdf) {
                        $mrfpdf->delete();
                    }
                }
            }

            $this->createPDF($record->id);
            $pdf = $this->getMRFPDFFile($record->id);

            // Sending Email
            Mail::to($record->user->immap_email)->send(new iMMAPerReminderMRFApprovalEmail($record->user->full_name, $record, auth()->user()->immap_email, $advisor, $pdf));
            if ($request->status == "disapproved") {
                $officers = User::select('id', 'full_name as name', 'immap_email')->permission('Approve Domestic Travel Request')->permission('Approve Global Travel Request')->orderByDesc('id')->get();
                $officers = $officers->filter(function ($officer, $key) {
                    return !$officer->hasPermissionTo('Set as Admin');
                })->pluck('immap_email')->toArray();

                if (count($officers)) {
                    Mail::to(config('mail.from.address'))->cc($officers)->send(new DomesticTravelDisapprovedMailForGlobalSecurity($record, auth()->user()->immap_email));
                }
            }

            // Notify other staff / email when it's approved
            if (($request->status == "approved")) {
                $record = MRFRequest::findOrFail($record->id);
                $notifyEmails = \App\Models\SecurityModule\NotifyTravelSetting::where('country_id', $record->country_id)->get();
                if (!$notifyEmails->isEmpty()) {
                    $notifyEmails = array_unique($notifyEmails->pluck('email')->toArray());
                    foreach ($notifyEmails as $notifyEmail) {
                        Mail::to($notifyEmail)->send(new NotifyMRFTravel($record));
                    }
                }

                 //Notify SBP Managers
                 if($record->user->profile->under_sbp_program == true){
                    $SBPManagers = User::role('SBPP Manager')->whereNotNull('immap_email')->pluck('immap_email');
                    if(!$SBPManagers->isEmpty()){
                        Mail::to($SBPManagers)->send(new NotifySBPManagersMRFApprovedEmail($record));
                    }
                  }
            }

            $record = MRFRequest::findOrFail($record->id);

            return response()->success(__('crud.success.update', ['singular' => ucwords($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

   //function to check if the itinerary has at least one vehicle as transportation type
   public function checkTransportationByVehicle($itineraries){
       $itineraries = collect($itineraries);

       $check = $itineraries->filter(function ($itinerary){
            return $itinerary['travelling_by'] == 'Vehicle';
       });

       return $check->count() > 0;
   }

    // Update Check in MRF
    /**
     * @SWG\Post(
     *   path="/api/security-module/mrf/{id}/check-in",
     *   tags={"Security Module"},
     *   summary="Update the check in of a trip",
     *   description="File: app\Http\Controllers\API\MRFRequestController@checkIn, Should be an iMMAPer",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="MRF id"),
     *   @SWG\Parameter(
     *          name="mrf",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "itineraries"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="itineraries", type="array", description="Domestic travel request itineraries",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Itinerary ID", example=1),
     *                      @SWG\Property(property="check_in", type="integer", enum={0,1}, description="check in (yes = 1, no = 0)", example=1),
     *                      @SWG\Property(property="check_in_outbound", type="integer", enum={0,1}, description="check in outbound (yes = 1, no = 0)", example=0),
     *                      @SWG\Property(property="check_in_return", type="integer", enum={0,1}, description="check in return (yes = 1, no = 0)", example=1),
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
           'itineraries.*.id' => 'required|integer|exists:security_module_mrf_request_itineraries,id',
           'itineraries.*.check_in' => 'required|boolean',
           'itineraries.*.check_in_outbound' => 'required|boolean',
           'itineraries.*.check_in_return' => 'required|boolean'
       ]);

       $record = MRFRequest::findOrFail($id);

       if($record && $record->status == "approved"){
           foreach($validatedData['itineraries'] as $data){
               $itinerary = MRFRequestItinerary::where('mrf_request_id',$id)->where('id', $data['id'])->first();
               $itinerary->check_in = $data['check_in'];
               $itinerary->check_in_outbound = $data['check_in_outbound'];
               $itinerary->check_in_return = $data['check_in_return'];
               $itinerary->save();
           }
           $revision = $this->create_revision($record->id);
           Mail::to($record->user->immap_email)->send(new NotifyIMMAPerCheckInMRFEmail($record));
       }else{
           return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
       }

       return response()->success(__('crud.success.update', ['singular' => ucwords($this->singular)]), $record);
   }

   public function getMRFPDFFile($id)
   {
       $record = MRFRequest::findOrFail($id);

       $pdf = $record->getMedia('mrf_pdf');
       $pdf = empty($pdf) ? '' : $pdf[0]->getFromS3()->getPath();

       return $pdf;
    }
}
