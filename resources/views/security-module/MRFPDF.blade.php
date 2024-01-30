<html>
    <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="{{ resource_path('css/bootstrap.min.css') }}"/>
        <link rel="stylesheet" href="{{ resource_path('css/mrf.css') }}"/>
    </head>
    <body>
        <p><b>DOMESTIC TRAVEL REQUEST DETAILS</b></p>
        <table class="table table-bordered table-sm">
            <tbody>
                <tr class="immap-bg"><td colspan="4" class="text-white">PART 1: REQUEST</td></tr>
                <tr>
                    <td colspan="2"><b>Name:</b></td>
                    <td colspan="2">{{ $mrf->user->full_name }}</td>
                </tr>
                <tr>
                    <td><b>Position:</b></td>
                    <td>{{ $mrf->user->profile->job_title }}</td>
                    <td><b>Duty Station:</b></td>
                    <td>{{ $mrf->user->profile->duty_station}}</td>
                </tr>
                <tr>
                    <td><b>Email:</b></td>
                    <td>{{ $mrf->user->profile->immap_email }}</td>
                    @php
                        $phone = $mrf->user->profile->phones()->where('is_primary', 1)->first();
                        if (empty($phone)) {
                            $phone = $mrf->user->profile->phones()->first();
                        }
                    @endphp
                    <td><b>Phone:</b></td>
                    <td>
                        @if(!empty($phone))
                        {{ $phone->phone }}
                        @endif
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><b>Date of Travel:</b></td>
                    @php
                        $date = $mrf->itineraries()->orderBy('date_time', 'asc')->first()->date_time;
                        $date = date('jS F Y', strtotime($date));
                    @endphp
                    <td colspan="2">{{ $date }}</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Purpose of travel:</b></td>
                    <td colspan="2" class="show-pre-line">{{ $mrf->purpose }}</td>
                </tr>
            </tbody>
        </table>
        <table class="table table-bordered table-sm">
            <tbody>
                <tr class="immap-bg"><td colspan="4" class="text-white">PART 2: MISSION DETAILS</td></tr>
                <tr>
                    <td colspan="2"><b>Transportation Type:</b></td>
                    @php
                        if ($mrf->transportation_type == 'air-travel') {
                            $transportationType = 'Air Travel';
                        } else if ($mrf->transportation_type == 'ground-travel') {
                            $transportationType = 'Ground Travel';
                        } else {
                            $transportationType = 'Air And Ground Travel';
                        }
                    @endphp
                    <td colspan="2">{{ $transportationType }}</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Country:</b></td>
                    <td colspan="2">{{ $mrf->country_name }}</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Risk Level:</b></td>
                    <td colspan="2">{{ $mrf->risk_level }}</td>
                </tr>
                @if($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel')
                    <tr>
                        <td colspan="2"><b>Criticality of the mission:</b></td>
                        <td colspan="2">{{ config('securitymodule.labelByValue.criticalMovements.'.$mrf->criticality_of_the_movement) }}</td>
                    </tr>
                @endif
                @php
                    $countFinalOutBoundTrip= 0;
                    $countReturnTrips = 1;
                @endphp
                @foreach ($mrf->itineraries as $key => $itinerary)
                    @if($mrf->travel_type == 'one-way-trip')
                        <tr class="secondary-bg text-center"><td colspan="4">ITINERARY</td></tr>
                    @elseif($mrf->travel_type == 'round-trip')
                      @if($mrf->transportation_type == 'air-travel')
                         <tr class="secondary-bg text-center"><td colspan="4">ITINERARY</td></tr>
                      @else
                        @if($key == 0)
                            <tr class="secondary-bg text-center"><td colspan="4">OUTBOUND TRIP</td></tr>
                         @else
                            <tr class="secondary-bg text-center"><td colspan="4">RETURN TRIP</td></tr>
                         @endif
                      @endif
                    @else
                      @if($countFinalOutBoundTrip == 0)
                        <tr class="secondary-bg text-center"><td colspan="4">OUTBOUND TRIP {{ $key + 1 }}</td></tr>
                      @else
                         <tr class="secondary-bg text-center"><td colspan="4">RETURN TRIP {{ $countReturnTrips }}</td></tr>
                         @php
                             $countReturnTrips++;
                        @endphp
                      @endif
                    @endif
                    @php
                        $date_time = strtotime($itinerary->date_time);
                        $detail_date = date('j F Y', $date_time);
                    @endphp
                    @if($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel')
                        <tr>
                            <td colspan="2"><b>Date:<b></td>
                            <td colspan="2">{{ $detail_date }}</td>
                        </tr>
                        <tr>
                            <td colspan="2"><b>Travelling By:<b></td>
                            <td colspan="2">{{ $itinerary->travelling_by }}</td>
                        </tr>
                        <tr>
                            <td><b>From:</b> </td>
                            <td>{{ $itinerary->from_city }}</td>
                            <td><b>To:</b> </td>
                            <td>{{ $itinerary->to_city }}</td>
                        </tr>
                        <tr>
                            <td><b>Estimated Time Departure:</b> </td>
                            <td>{{ substr($itinerary->etd, 0, -3) }}</td>
                            <td><b>Estimated Time Arrival:</b> </td>
                            <td>{{ substr($itinerary->eta, 0, -3) }}</td>
                        </tr>
                    @endif
                    <tr>
                        <td colspan="2"><b>Government Access Paper or UN Security Clearance:</b> </td>
                        <td colspan="2">
                            @if($itinerary->need_government_paper == 'yes' && $itinerary->need_government_paper_now == 1)
                                @php
                                    $gPaper = '';
                                    $mediaPdf = $itinerary->attachment;
                                    if (!empty($mediaPdf)) {
                                        $mediaPdf = $mediaPdf->media->first();
                                        $gPaper = $mediaPdf->getFullUrl();
                                    }
                                @endphp
                                <span class="download-yes">Yes </span>  @if(!empty($gPaper))<a href="{{$gPaper}}" class="download-btn">Download</a>@endif
                            @elseif($itinerary->need_government_paper == 'yes' && $itinerary->need_government_paper_now == 0)
                                Yes (Document not Attached)
                            @else
                                No
                            @endif
                        </td>
                    </tr>
                    @if($mrf->transportation_type == 'air-travel')
                        @if($mrf->travel_type == 'round-trip')
                            @php
                                $return_time = strtotime($itinerary->return_date_time);
                                $return_date = date('j F Y', $return_time);
                            @endphp
                            <tr>
                                <td><b>Date:<b></td>
                                <td>{{ $detail_date }}</td>
                                <td><b>Return Date:<b></td>
                                <td>{{ $return_date }}</td>
                            </tr>
                        @else
                            <tr>
                                <td colspan="2"><b>Date:<b></td>
                                <td colspan="2">{{ $detail_date }}</td>
                            </tr>
                        @endif
                        <tr>
                            <td><b>From:</b> </td>
                            <td>{{ $itinerary->from_city }}</td>
                            <td><b>To:</b> </td>
                            <td>{{ $itinerary->to_city }}</td>
                        </tr>
                    @endif
                    @if($mrf->travel_type == 'multi-location')
                        <tr>
                            <td colspan="2"><b>Outbound Trip Final Destination:</b></td>
                            <td colspan="2">{{ $itinerary->outbound_trip_final_destination == 1 ? 'Yes' :  'No' }}</td>
                        </tr>
                    @endif
                    <tr>
                        <td colspan="2"><b>Overnight:</b> </td>
                        <td colspan="2">{{ $itinerary->overnight == 1 ? 'Yes' :  'No' }}</td>
                    </tr>
                    @if($itinerary->overnight == 1)
                    <tr>
                        <td colspan="2"><b>Explanation:</b></td>
                        <td colspan="2">{{ $itinerary->overnight_explanation }}</td>
                    </tr>
                    @endif
                    @if($itinerary->outbound_trip_final_destination == 1)
                        @php
                            $countFinalOutBoundTrip++;
                        @endphp
                    @endif
                @endforeach
            </tbody>
        </table>
        @php
             $checkVehicle = $mrf->itineraries->filter(function ($itinerary){
                return $itinerary->travelling_by == 'Vehicle';
            });
        @endphp
        @if((($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel') && $checkVehicle->count() > 0) && ($mrf->vehicle_filled_by_yourself =='yes' || $mrf->status =='approved'))
            <table class="table table-bordered table-sm">
                <tbody>
                    <tr class="immap-bg"><td colspan="4" class="text-white">PART 3: VEHICLE DETAILS / COMMUNICATIONS / STAFF DETAILS</td></tr>
                    <tr>
                        <td colspan="2"><b>Security Measures Required:</b></td>
                        <td colspan="2">
                            @if(!empty($mrf->security_measure))
                            {{ config('securitymodule.labelByValue.securityMeasures.'.$mrf->security_measure) }}
                            @endif
                        </td>
                    </tr>
                    @if(count($mrf->travel_details))
                        @foreach( $mrf->travel_details as $key => $travel )
                            @if($mrf->security_measure == 'use-of-hire-car')
                                <tr>
                                    <td colspan="4" class="bold secondary-bg"><b>Car Hire Company {{ $key + 1 }} details:</b></td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <div><b>Company name:</b> {{ $travel->company_name }}</div>
                                        <div><b>Company Email:</b> {{ $travel->company_email }}</div>
                                        <div><b>Company Phone Number:</b> {{ $travel->company_phone_number }}</div>
                                        <div><b>Company Driver:</b> {{ $travel->company_driver }}</div>
                                    </td>
                                </tr>
                            @else
                                <tr >
                                    <td colspan="1" class="bold secondary-bg"><b>Vehicle {{ $key + 1 }} details:</b></td>
                                    <td colspan="2" class="bold secondary-bg"><b>Communications:</b></td>
                                    <td colspan="1" class="bold secondary-bg"><b>Staff on board:</b></td>
                                </tr>
                                <tr>
                                    <td colspan="1">
                                        <div><b>Make:</b> {{ $travel->vehicle_make }}</div>
                                        <div><b>Model:</b> {{ $travel->vehicle_model }}</div>
                                        <div><b>Color:</b> {{ $travel->vehicle_color }}</div>
                                        <div><b>Plate:</b> {{ $travel->vehicle_plate }}</div>
                                    </td>
                                    <td colspan="2">
                                        <div><b>GSM:</b> {{ $travel->comm_gsm }}</div>
                                        <div><b>Sat. Phone:</b> {{ empty($travel->comm_sat_phone) ? '-' : $travel->comm_sat_phone }}</div>
                                        <div><b>VHF Radio:</b> {{ $travel->comm_vhf_radio == 1 ? 'Yes' : 'No' }}</div>
                                        <div><b>VHF Radio Call sign:</b> {{ $travel->comm_vhf_radio_call_sign ? $travel->comm_vhf_radio_call_sign : '-' }}</div>
                                        <div><b>Sat. Tracker:</b> {{ $travel->comm_sat_tracker == 1 ? 'Yes' : 'No' }}</div>
                                        <div><b>PPE:</b> {{ $travel->ppe == 1 ? 'Yes' : 'No' }}</div>
                                        <div><b>Medical Kit:</b> {{ $travel->medical_kit == 1 ? 'Yes' : 'No' }}</div>
                                    </td>
                                    <td colspan="1">
                                        <div class="show-pre-line">{{ $travel->personnel_on_board }}</div>
                                    </td>
                                </tr>
                            @endif
                        @endforeach
                    @endif
                </tbody>
            </table>
        @endif
        @if($mrf->status == "revision")
            <table class="table table-bordered table-sm">
                <tbody>
                    <tr class="immap-bg"><td colspan="4" class="text-white">REVISION EXPLANATION</td></tr>
                    @if($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel')
                    <tr>
                        <td colspan="2"><b>Current Movement Status:</b></td>
                        <td colspan="2">
                            @if(!empty($mrf->movement_state))
                            {{ config('securitymodule.labelByValue.movementStates.'.$mrf->movement_state) }}
                            @endif
                        </td>
                    </tr>
                    @endif
                    <tr>
                        <td colspan="2"><b>Reasons & Comments:</b></td>
                        <td colspan="2">{{ $mrf->revision_needed }}</td>
                    </tr>
                </tbody>
            </table>
        @endif
        @if($mrf->status == "approved")
            <table class="table table-bordered table-sm">
                <tbody>
                    @if(($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel') && $checkVehicle->count() > 0)
                        <tr class="immap-bg"><td colspan="4" class="text-white">PART 4: TO BE COMPLETED BY THE SECURITY DEPARTMENT</td></tr>
                    @else
                        <tr class="immap-bg"><td colspan="4" class="text-white">PART 3: TO BE COMPLETED BY THE SECURITY DEPARTMENT</td></tr>
                    @endif
                         <tr class="secondary-bg"><td colspan="4" class="text-center">AUTHORIZATION AND ADVICE</td></tr>
                    @if($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel')
                        <tr>
                            <td colspan="2"><b>Current Movement Status:</b></td>
                            <td colspan="2">
                                @if(!empty($mrf->movement_state))
                                {{ config('securitymodule.labelByValue.movementStates.'.$mrf->movement_state) }}
                                @endif
                            </td>
                        </tr>
                    @endif
                    @if($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel')
                        <tr>
                            <td colspan="2"><b>Security Assessment:</b></td>
                            @if(!empty($mrf->security_assessment))
                                <td colspan="2" class="show-pre-line" style="vertical-align: top;">{{ $mrf->security_assessment }}</td>
                            @else
                                <td colspan="2" class="show-pre-line" style="vertical-align: top;"> - </td>
                            @endif
                        </tr>
                    @endif
                    <tr>
                        <td colspan="2"><b>Comments & Recommendations:</b></td>
                        @if(!empty($mrf->approved_comments))
                            <td colspan="2" class="show-pre-line" style="vertical-align: top;">{{ $mrf->approved_comments }}</td>
                        @else
                            <td colspan="2" class="show-pre-line" style="vertical-align: top;"> - </td>
                        @endif
                    </tr>
                    <tr>
                        <td colspan="2"><b>Security Measures Required:</b></td>
                        <td colspan="2" class="show-pre-line">
                            @if($mrf->security_measure_email == 1 && $mrf->security_measure_smart24 == 1 && $mrf->security_measure_immap_careers == 1)
                                Check-in on arrival via email , Mobile App and 3iSolution Careers
                            @elseif($mrf->security_measure_email == 0 && $mrf->security_measure_smart24 == 0 && $mrf->security_measure_immap_careers == 0)
                                None
                            @else
                                @if($mrf->security_measure_email == 1)
                                    Check-in on arrival via email
                                @endif
                                @if($mrf->security_measure_smart24 == 1)
                                    Check-in on arrival via Mobile App
                                @endif
                                @if($mrf->security_measure_immap_careers == 1)
                                    Check-in on arrival via 3iSolution Careers
                                @endif
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Authorization:</b></td>
                        <td colspan="2" class="show-pre-line">Approved</td>
                    </tr>
                    <tr>
                        <td colspan="1" class="show-pre-line"><b>Name:</b> <br/> {{ $last_edit_user->full_name }} </td>
                        <td colspan="2" class="show-pre-line"><b>Position:</b> <br/> {{ $last_edit_user->profile->job_title }}</td>
                        <td colspan="1" class="show-pre-line"><b>Date:</b> <br/> {{ $mrf->updated_at }}</td>
                    </tr>
                </tbody>
            </table>
        @endif
        @if($mrf->status == "disapproved")
        <table class="table table-bordered table-sm">
            <tbody>
                @if(($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel') && $checkVehicle->count() > 0)
                     <tr class="immap-bg"><td colspan="4" class="text-white">PART 4: TO BE COMPLETED BY THE SECURITY DEPARTMENT</td></tr>
                @else
                     <tr class="immap-bg"><td colspan="4" class="text-white">PART 3: TO BE COMPLETED BY THE SECURITY DEPARTMENT</td></tr>
                @endif
                <tr class="secondary-bg"><td colspan="4" class="text-center">AUTHORIZATION AND ADVICE</td></tr>
                @if($mrf->transportation_type == 'ground-travel' || $mrf->transportation_type == 'air-and-ground-travel')
                    <tr>
                        <td colspan="2"><b>Current Movement Status:</b></td>
                        <td colspan="2">
                            @if(!empty($mrf->movement_state))
                            {{ config('securitymodule.labelByValue.movementStates.'.$mrf->movement_state) }}
                            @endif
                        </td>
                    </tr>
                @endif
                <tr>
                    <td colspan="2"><b>Authorization:</b></td>
                    <td colspan="2">Disapproved</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Reasons & Comments:</b></td>
                    <td colspan="2" class="show-pre-line">{{ $mrf->disapproved_reasons }}</td>
                </tr>
                <tr>
                    <td colspan="1" class="show-pre-line"><b>Name:</b> <br/> {{ $last_edit_user->full_name }} </td>
                    <td colspan="2" class="show-pre-line"><b>Position:</b> <br/> {{ $last_edit_user->profile->job_title }}</td>
                    <td colspan="1" class="show-pre-line"><b>Date:</b> <br/> {{ $mrf->updated_at }}</td>
                </tr>
            </tbody>
        </table>
        @endif
    </body>
</html>
