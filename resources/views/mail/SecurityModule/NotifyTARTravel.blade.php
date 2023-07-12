@component('mail::message')
<h1 style="font-size: 19px;font-weight: bold;">Dear Colleague,</h3>

<p style="margin-top: 32px">The international travel request from {{$fullName}} has been <b>APPROVED</b>. Please see the travel details below: </p>
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
            <td colspan="4" class="show-pre-line minheight-5">@if(empty($tar->remarks)) <br/> @else {{ $tar->remarks }} @endif</td>
        </tr>
    </tbody>
</table>

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent

