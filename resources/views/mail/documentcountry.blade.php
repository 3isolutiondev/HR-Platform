@component('mail::message')
<h1>Dear {{ $user }} immapers,</h1>

<br/>
attached 

Thank you and best regards,<br>
{{ config('app.name') }}

@endcomponent
