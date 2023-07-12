@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
{{ $message }}

Best regards,<br>
{{ config('app.name') }}

@endcomponent
