@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Check In Reminder script found an error while trying to send the email. Please see the trips ID below.

## Report (Total: {{ count($trips) }})
@if(count($trips) == 0)
    - No trips affected by the script.
@else
@foreach ($trips as $trip)
    - {{ $trip }}
@endforeach
@endif

Thank you,<br>
{{ config('app.name') }}

@endcomponent