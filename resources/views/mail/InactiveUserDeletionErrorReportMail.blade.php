@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Inactive Profile Deletion script found an error while trying to delete the profile. Please see the failed users below.

## Report (Total: {{ count($users) }})
@if(count($users) == 0)
    - No users affected by the error in the script.
@else
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach
@endif

Thank you,<br>
{{ config('app.name') }}

@endcomponent
