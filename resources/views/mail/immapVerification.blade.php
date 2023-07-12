{{-- @component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Please verify your immap email address by clicking button below.

@component('mail::button', ['url'=>$verification_link])
Verify iMMAP Email Address
@endcomponent

Best regards,<br>
{{ config('app.name') }}

@component('mail::subcopy')
If you’re having trouble clicking the "Verify iMMAP Email Address" button, copy and paste the URL below into your web browser: {!! $verification_link !!}
@endcomponent
@endcomponent --}}




 @component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Please verify your iMMAP email address by clicking on the button below.

@component('mail::button', ['url'=>$verification_link])
Verify iMMAP Email Address
@endcomponent

<br>
{{ config('app.name') }}

@component('mail::subcopy')
If you’re having trouble clicking the "Verify iMMAP Email Address" button, copy and paste the URL below into your web browser: {!! $verification_link !!}
@endcomponent
@endcomponent


