@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
There is an error while removing account from a user request.

## Please see user details here:
- Name: {{ $user->full_name }}
- Email: {{ $user->email }}
- User ID: {{ $user->id }}


Regards,<br>
{{ config('app.name') }}
@endcomponent

