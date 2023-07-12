@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Incomplete Profile Reminder script run successfully. Please see the report below.

## Report
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach

Thank you,<br>
{{ config('app.name') }}

@endcomponent

