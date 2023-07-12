@component('mail::message')
<h1>Dear {{ $hr_manager_name }},</h1>

<br/>
The following user has applied to the  <b>{{ $job_title }}</b> position:
@component('mail::button', ['url'=>$profile_link])
{{ $user_name }}
@endcomponent

Email: {{ $user_email }}

Please review the profile and assess its relevance according to the Job ToRs.
@component('mail::button', ['url'=>$tor_link])
View ToR
@endcomponent

Best regards,<br>
{{ config('app.name') }}

@endcomponent

