@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Your domestic @if($mrf_type == 'air-travel') air @else ground @endif travel request {{ $mrf_name }} has been successfully @if($submit_status == "submitted") submitted. @else resubmitted. @endif<br/>

@component('mail::button', ['url' => $mrf_link])
{{ $mrf_name }}
@endcomponent

The iMMAP Security department has been notified of your request and will make a decision at their earliest convenience.

You will be informed of the final decision by email.

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
