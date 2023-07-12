@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
We hope your travel has gone smoothly.<br/>

Please use the link below <b>to confirm check-in</b> once you have arrived at your destination.

@component('mail::button', ['url' => $link])
{{ $trip_name }}
@endcomponent

If you did not travel for any reason, please inform security at: <a href="mailto:globalsecurity@organization.org">globalsecurity@organization.org</a>

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
