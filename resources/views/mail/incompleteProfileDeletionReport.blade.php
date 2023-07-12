
@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Incomplete Profile Deletion script run successfully. Please see the deleted users below.

## Report
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach

Thank you,<br>
{{ config('app.name') }}

@endcomponent

