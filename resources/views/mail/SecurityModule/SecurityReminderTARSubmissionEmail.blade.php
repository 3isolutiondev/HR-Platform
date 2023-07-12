@component('mail::message')
<h1>Dear Global Security Advisor,</h1>

<br/>
{{ $immaper }} has successfully @if($submit_status == "submitted") submitted @else resubmitted @endif an international travel request.<br/>

@component('mail::button', ['url' => $security_page])
{{ $tar_name }}
@endcomponent

Please action the travel request.

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
