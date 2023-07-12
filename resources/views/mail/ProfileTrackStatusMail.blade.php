
@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The track profile status script run successfully. Please see the affected users below.

## Report (Total: {{ count($affectedUsers) }})
@if(count($affectedUsers) == 0)
    - No users affected by the script.
@else
@foreach ($affectedUsers as $user)
    - {{ $user->full_name }} ({{ $user->email }})
@endforeach
@endif

Thank you,<br>
{{ config('app.name') }}

@endcomponent

