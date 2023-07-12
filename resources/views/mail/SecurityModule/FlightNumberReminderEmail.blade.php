@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
A reminder that you need to complete your TAR by adding your flight number.
<br/>
Please do this before you depart by following this link:

@component('mail::button', ['url' => $link])
{{ $trip_name }}
@endcomponent

If your travel plans change for any reason, please inform security at: <a href="mailto:globalsecurity@organization.org">globalsecurity@organization.org</a>.

Thank you and best regards,<br>
{{ config('securitymodule.emailFooter') }}

@endcomponent
