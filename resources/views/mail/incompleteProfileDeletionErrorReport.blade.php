
@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Incomplete Profile Deletion script found an error while trying to delete the profile. Please see the failed users below.

## Report
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach

Thank you,<br>
{{ config('app.name') }}

@endcomponent

