@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
Hidden User Notification feature has failed send a notification to HR Staff for this user: {{$name}}. Please check the log file.
<br/>
<br/>

Best regards,<br>
{{ config('app.name') }}

@endcomponent
