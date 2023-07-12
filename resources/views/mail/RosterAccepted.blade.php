{{-- @component('mail::message')
<h1>Dear {{ $profile_name }},</h1>

CONGRATULATIONS! You are now an official member of {{ $roster_process }}
<br/>

iMMAP checked your references and is delighted to inform you that you have been accepted as an official member of the {{ $roster_process }}. You are now part of the pool of candidates for deployment to the field.

You will soon receive an invitation to upload the following  documents to your profile
- Deployment Documentation (copy of passport, medical check, vaccines certificates, emergency contacts, banking information, conflict of interest certification)
- Dates of availability

Starting from now, please make sure the information you provide on the platform is always up to date.

Thank you, iMMAP will come back to you as soon as a deployment request matches your profile.

Regards,<br>
{{ config('app.name') }}

@endcomponent --}}



 @component('mail::message')
<h1>Dear {{ $profile_name }},</h1>

CONGRATULATIONS! You are now an official member of the {{ $roster_process }}
<br/>

iMMAP checked your references and is delighted to inform you that you have been accepted to the {{ $roster_process }}. You are now part of our pool of candidates eligible for deployment to the field.

Please make sure the information you provide on the platform is always up to date.

Thank you and best regards
<br>

{{ config('app.name') }}

@endcomponent

