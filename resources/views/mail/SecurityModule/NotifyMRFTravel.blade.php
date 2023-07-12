@component('mail::message')
<h1 style="font-size: 19px;font-weight: bold;">Dear Colleague,</h1>

<p style="margin-top: 32px">The domestic @if($mrf_type == 'air-travel') air @else ground @endif travel request from {{$fullName}} has been <b>APPROVED</b>. Please see the travel details below: </p>
<style>
    table {
      table-layout: fixed;
      width: 100%;
  }
  </style>
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
                <tr>
                    <td colspan="2"><b>Government Access Paper or UN Security Clearance:</b> </td>
                    <td colspan="2">
                        @if($itinerary->need_government_paper == 'yes' && $itinerary->need_government_paper_now == 1)
                            @php
                                $gPaper = '';
                                $mediaPdf = $itinerary->attachment;
                                if (!empty($mediaPdf)) {
                                    $mediaPdf = $mediaPdf->media->first();
                                    $gPaper = $mediaPdf->getFullUrlFromS3();
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
                @endif
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
                    <tr>
                        <td colspan="2"><b>Air Ticket:</b> </td>
                        <td colspan="2">
                            @if($itinerary->upload_air_ticket == 'yes' && $itinerary->upload_air_ticket_now == 1)
                                @php
                                    $aTicket = '';
                                    $mediaPdf = $itinerary->airTicket;
                                    if (!empty($mediaPdf)) {
                                        $mediaPdf = $mediaPdf->media->first();
                                        $aTicket = $mediaPdf->getFullUrlFromS3();
                                    }
                                @endphp
                                <span class="download-yes">Yes </span> @if(!empty($aTicket))<a href="{{$aTicket}}" class="download-btn">Download</a>@endif
                            @elseif($itinerary->upload_air_ticket == 'yes' && $itinerary->upload_air_ticket_now == 0)
                                Yes (Document not Attached)
                            @else
                                No
                            @endif
                        </td>
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

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent

