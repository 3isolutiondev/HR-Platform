@component('mail::message')
<h1>Dear {{ $country }} Security Officer,</h1>

<br/>
{{ $immaper }} has successfully @if($submit_status == "submitted") submitted @else resubmitted @endif a domestic @if($mrf_type == 'air-travel') air @else ground @endif travel request.<br/>

@component('mail::button', ['url' => $security_page])
{{ $mrf_name }}
@endcomponent

Please action the travel request.

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
