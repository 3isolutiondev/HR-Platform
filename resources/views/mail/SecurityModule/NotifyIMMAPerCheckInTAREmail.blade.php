@component('mail::message')
<h1>Dear {{ $immaper }},</h1>

<br/>
Your check-in was received. <br/>
Thank you for confirming your safe arrival. 

Best regards and stay safe,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
