
@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Hidden User Script found an error while trying to delete the user(s). Please see the failed users below.

## Report (Total: {{ $usersCount }})
@if($usersCount == 0)
    - No users affected by the error in the script.
@else
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach
@endif

Thank you,<br>
{{ config('app.name') }}

@endcomponent

