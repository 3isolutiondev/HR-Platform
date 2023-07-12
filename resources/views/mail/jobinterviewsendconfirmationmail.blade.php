@component('mail::message')
<h1>Dear {{ $manager }},</h1>

The candidate has received this email - 
<br/>

<i>
<br/>
Congratulations, your profile was selected as a match for <br/>
the <b>{{ $job_title }}</b> position.
</i>
<i>
We would like to invite you for Skype interview on :<br/>
<b>{{ $interview_date.", ".$timezone }}</b> time.

Skype: <b>{{ $skype_id }}</b>
</i>
<i>
Please confirm the scheduled interview to this email address: <br/>
{{ $hr_immap_email }}
</i>
<i>
Thank you and best regards,<br>
{{ config('app.name') }}

</i>
@endcomponent