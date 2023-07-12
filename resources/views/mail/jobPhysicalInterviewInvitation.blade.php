@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Congratulations, your profile was selected as a match for <br/>
the <b>{{ $job_title }}</b> position.

We would like to invite you for an interview on :<br/>
<b>{{ $interview_date.", ".$timezone }}</b> time.

At our office located at: <br/>
<b>{{ $address }}</b>

Please confirm the scheduled interview to this email address: <br/>
{{ $hr_immap_email }}

@if($commentText)
<p>
    <b>Additional Comments</b><br>
    <i>{!!$commentText!!}</i>
</p>
@endif

Thank you and best regards,<br>
{{ config('app.name') }}

@endcomponent

