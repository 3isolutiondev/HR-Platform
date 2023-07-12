@component('mail::message')
<h1>Hello,</h1>

<br/>
The status of the following user has changed from **ACTIVE** to **HIDDEN**: {{$name}}.
<br/>
<br/>
This is just a notification. No further actions are required.
<br/>
<br/>

Best regards,<br>
{{ config('app.name') }}

@endcomponent
