
@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Hidden User Script run successfully. Please see the deleted users below.

## Report (Total: {{ $usersCount }})
@if($usersCount == 0)
    - No hidden users deleted by the script.
@else
@foreach ($users as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach
@endif

Thank you,<br>
{{ config('app.name') }}

@endcomponent

