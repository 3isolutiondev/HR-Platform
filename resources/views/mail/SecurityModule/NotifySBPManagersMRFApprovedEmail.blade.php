@component('mail::message')
<h1 style="font-size: 19px;font-weight: bold;">Dear Surge Manager,</h1>

<br/>
The domestic @if($mrf_type == 'air-travel') air @else ground @endif travel request {{ $mrf_name }} from {{ $fullName }}  has been approved. Please find the travel details at the Travel Dashboard.<br/>
@component('mail::button', ['url' => $link])
Travel Dashboard
@endcomponent

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
