@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Your domestic @if($mrf_type == 'air-travel') air @else ground @endif travel request {{ $mrf_name }} @if($status == "revision") needs revision. Please see the security officer's comments on your request and resubmit once revised. @elseif($status == "approved") has been approved. @else has been disapproved. Please see the security officer's comments on your request. @endif<br/>
@component('mail::button', ['url' => $link])
{{ $mrf_name }}
@endcomponent
@if($status == "approved")

<b>Kindly find attached your travel request approval. This authorization is to be considered as a security clearance only. </b>

<b>Your travel is confirmed only once approved in Unanet with your request. You are required to attach this authorization as a supporting document in Unanet. This applies for travel requiring financial reimbursement and not for leave.</b>

@if ($advisor)
Should your travel be cancelled or postponed for any reason, please inform: {{ $advisor->full_name }}  <a href="mailto:{{ $advisor->immap_email}}">{{ $advisor->immap_email}}</a>

@else
Should your travel be cancelled or postponed for any reason, please inform: <a href="mailto:globalsecurity@organization.org">globalsecurity@organization.org</a>

@endif

@endif

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
