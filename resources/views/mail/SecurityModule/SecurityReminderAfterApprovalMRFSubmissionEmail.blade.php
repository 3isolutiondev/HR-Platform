@component('mail::message')
<h1>Dear {{ $country }} Security Officer,</h1>

<br/>
{{ $immaper }} has edited an already approved TAR.<br/>

@component('mail::button', ['url' => $security_page])
{{ $mrf_name }}
@endcomponent

Please action the travel request.

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
