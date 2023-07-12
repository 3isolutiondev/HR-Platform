@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Your international travel request {{ $tar_name }} has been successfully  @if($submit_status == "submitted") submitted. @else resubmitted. @endif<br/>

@component('mail::button', ['url' => $tar_link])
{{ $tar_name }}
@endcomponent

The iMMAP Security department has been notified of your request and will make a decision at their earliest convenience.

You will be informed of the final decision by email.<br>

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
