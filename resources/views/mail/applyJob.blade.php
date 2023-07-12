{{-- @component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Thank you for applying to the <b>{{ $job->title }}</b> position.

Hiring managers will review your profile and they may invite you for a professional interview.

Best regards,<br>
{{ config('app.name') }}

@endcomponent --}}



 @component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Thank you for applying to the <b>{{ $job->title }}</b> position.

iMMAP will review your profile and contact you if you are selected for the next step of the recruitment process.

Best regards,<br>
{{ config('app.name') }}

@endcomponent

