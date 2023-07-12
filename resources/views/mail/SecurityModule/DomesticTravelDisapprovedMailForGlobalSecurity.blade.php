@component('mail::message')
<h1>Dear Global Security Advisor,</h1>

<br/>
The domestic @if($mrf_type == 'air-travel') air @else ground @endif travel request {{ $mrf_name }} from {{ $immaper }} has been disapproved by {{ $securityOfficer }}.<br/><br/>
Please check the travel request.<br/>

@component('mail::button', ['url' => $security_page])
{{ $mrf_name }}
@endcomponent

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
