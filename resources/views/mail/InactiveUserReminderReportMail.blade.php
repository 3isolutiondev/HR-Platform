
@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Inactive User Reminder Script run successfully. Please see the users that has been notified below.

## Report (Total: {{ count($users) }})
@if(count($users) == 0)
    - No users affected by the script.
@else
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach
@endif

Thank you,<br>
{{ config('app.name') }}

@endcomponent

