@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
There is an error while sending Surge Alert Notification for <b>{{ $job->title }} [{{ $sbpRosterName}}]</b>.

@component('mail::button', ['url' => url("/jobs/" . $job->id)])
View the job details
@endcomponent

## Report (Total: {{ count($affectedEmails) }})
### List of the affected email list:
@foreach ($affectedEmails as $email)
 - {{ $email.'  ' }}
@endforeach

<br/>
Best regards,
<br/>
{{ config('app.name') }}

@endcomponent
