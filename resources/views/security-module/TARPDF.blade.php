<html>
    <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="{{ resource_path('css/bootstrap.min.css') }}"/>
        <link rel="stylesheet" href="{{ resource_path('css/tar.css') }}"/>
    </head>
    <body>
        <p>INTERNATIONAL TRAVEL REQUEST DETAILS</p>
        <table class="table table-bordered table-sm">
            <tbody>
                <tr class="immap-bg"><td colspan="4" class="text-white">PART 1: REQUEST</td></tr>
                <tr>
                    <td colspan="2"><b>Name:</b></td>
                    <td colspan="2">{{ $tar->user->full_name }}</td>
                </tr>
                <tr>
                    <td><b>Position:</b></td>
                    <td>{{ $tar->user->profile->job_title }}</td>
                    <td><b>Duty Station:</b></td>
                    <td>{{ $tar->user->profile->duty_station}}</td>
                </tr>
                <tr>
                    <td><b>Email:</b></td>
                    <td>{{ $tar->user->profile->immap_email }}</td>
                    <td><b>Phone:</b></td>
                    @php
                        $phone = $tar->user->profile->phones()->where('is_primary', 1)->first();
                        if (empty($phone)) {
                            $phone = $tar->user->profile->phones()->first();
                        }
                    @endphp
                    <td>{{ empty($phone) ? '' : $phone->phone }}</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Date of Request:</b></td>
                    <td colspan="2">
                        @if(!empty($tar->submitted_date))
                        {{ date('jS F, Y', strtotime($tar->submitted_date)) }}
                        @endif
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><b>Date of Travel:</b></td>
                    @php
                        $date = $tar->itineraries()->orderBy('date_travel', 'asc')->first()->date_travel;
                        $date = date('jS F, Y', strtotime($date));
                    @endphp
                    <td colspan="2">{{ $date }}</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Purpose of travel:</b></td>
                    <td colspan="2" class="show-pre-line">{{ config('securitymodule.labelByValue.travelPurposes.'.$tar->travel_purpose) }}</td>
                </tr>
                <tr>
                    <td colspan="2"><b>Risk Level:</b></td>
                    <td colspan="2">{{ $tar->risk_level }}</td>
                </tr>
            </tbody>
        </table>
        @php
            $countFinalOutBoundTrip= 0;
            $countReturnTrips = 1;
        @endphp
        <table class="table table-bordered table-sm">
            <tbody>
                <tr class="immap-bg"><td colspan="4" class="text-white">PART 2: TRAVEL DETAILS</td></tr>
                @foreach ($tar->itineraries as $key => $itinerary)
                    @if($tar->travel_type == 'one-way-trip')
                        <tr class="secondary-bg text-center"><td colspan="4">ITINERARY</td></tr>
                    @elseif($tar->travel_type == 'round-trip')
                        <tr class="secondary-bg text-center"><td colspan="4">ITINERARY</td></tr>
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
                        $date_travel = strtotime($itinerary->date_travel);
                        $detail_date = date('j F Y', $date_travel);
                        if ($tar->travel_type == "round-trip") {
                            $return_date_travel = strtotime($itinerary->return_date_travel);
                            $return_date = date('j F Y', $return_date_travel);
                        }
                    @endphp
                    <tr>
                        @if($tar->travel_type == "round-trip")
                            <td><b>Departure Date:</b></td>
                            <td>{{ $detail_date }}</td>
                            <td><b>Return Date:</b></td>
                            <td>{{ $return_date }}
                        @else
                            <td colspan="2"><b>Date:</b></td>
                            <td colspan="2">{{ $detail_date }}</td>
                        @endif
                    </tr>
                    <tr>
                        <td><b>From Country</b></td>
                        <td><b>From City</b></td>
                        <td><b>To Country</b></td>
                        <td><b>To City</b></td>
                    </tr>
                    <tr>
                        <td>{{ $itinerary->from_country_name}}</td>
                        <td>{{ $itinerary->from_city }}</td>
                        <td>{{ $itinerary->to_country_name}}</td>
                        <td>{{ $itinerary->to_city }}</td>
                    </tr>
                    @if($tar->travel_type == 'multi-location')
                    <tr>
                        <td colspan="2"><b>Outbound Trip Final Destination:</b></td>
                        <td colspan="2">{{ $itinerary->outbound_trip_final_destination == 1 ? 'Yes' :  'No' }}</td>
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
                                <span class="download-yes">Yes </span>  
                                @if(!empty($gPaper))
                                        <a href="{{$gPaper}}" class="download-btn">Download</a>
                                @endif
                                @elseif($itinerary->need_government_paper == 'yes' && $itinerary->need_government_paper_now == 0)
                                Yes (Document not Attached)
                            @else
                                No
                            @endif
                        </td>
                    </tr>
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
                <tr class="secondary-bg text-center"><td colspan="4"><b>Additional Comments:</b></td></tr>
                <tr>
                    <td colspan="4" class="show-pre-line minheight-5">{{ $tar->remarks }}</td>
                </tr>
            </tbody>
        </table>
        @if($tar->status == "revision")
            <table class="table table-bordered table-sm">
                <tbody>
                    <tr class="immap-bg"><td class="text-white">REVISION EXPLANATION</td></tr>
                    <tr><td>{{ $tar->revision_needed }}</td></tr>
                </tbody>
            </table>
        @endif
        @if($tar->status == 'approved' || $tar->status == 'disapproved')
        <table class="table table-bordered table-sm no-margin-bottom">
            <tbody>
                <tr class="immap-bg"><td colspan="4" class="text-white">PART 3: AUTHORIZATION AND ADVICE - TO BE COMPLETED BY THE SECURITY DEPARTMENT</td></tr>
                @if($tar->status == "approved")
                    <tr>
                        <td colspan="2"><b>Authorization:</b></td>
                        <td colspan="2">APPROVED</td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Security Advice:</b></td>
                        <td colspan="2" class="show-pre-line">{{ $tar->approved_comments}}</td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Security Measures Required:</b></td>
                        <td colspan="2" class="show-pre-line">
                            @if($tar->security_measure_email == 1 && $tar->security_measure_smart24 == 1 && $tar->security_measure_immap_careers == 1)
                                Check-in on arrival via email , Mobile App and iMMAP Careers
                            @elseif($tar->security_measure_email == 0 && $tar->security_measure_smart24 == 0 && $tar->security_measure_immap_careers == 0)
                                None
                            @else
                                @if($tar->security_measure_email == 1)
                                    Check-in on arrival via email
                                @endif
                                @if($tar->security_measure_smart24 == 1)
                                    Check-in on arrival via Mobile App
                                @endif
                                @if($tar->security_measure_immap_careers == 1)
                                    Check-in on arrival via iMMAP Careers
                                @endif       
                            @endif
                        </td>
                    </tr>
                @endif
                @if($tar->status == "disapproved")
                    <tr>
                        <td colspan="2"><b>Authorization:</b></td>
                        <td colspan="2">DISAPPROVED</td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Reasons:</b></td>
                        <td colspan="2" class="show-pre-line">{{ $tar->disapproved_reasons}}</td>
                    </tr>
                @endif
                <tr>
                    <td colspan="1" class="show-pre-line"><b>Name:</b> <br/> {{ $last_edit_user->full_name }} </td>
                    <td colspan="2" class="show-pre-line"><b>Position:</b> <br/> {{ $last_edit_user->profile->job_title }}</td>
                    <td colspan="1" class="show-pre-line"><b>Date:</b> <br/> {{ $tar->updated_at }}</td>
                </tr>
            </tbody>
        </table>
        @endif
    </body>
</html>
