@component('mail::message')
<h1>Dear {{ $applicant }},</h1>

<br/>
iMMAP Surge team is delighted to inform you that your application is moving forward to {{ $new_status }} in the {{ $roster_name }} selection process.<br/>

You may see your roster selection update by clicking on this button:<br/>

@component('mail::button', ['url' => $link])
{{ $roster_name }}
@endcomponent

Best regards,<br>
{{ config('app.name') }}
@endcomponent