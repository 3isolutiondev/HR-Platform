@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Congratulations, your profile was selected as a match for <br/>
the <b>{{ $job_title }}</b> position.

We would like to invite you for an online interview on:<br/>
<b>{{ $interview_date.", ".$timezone }}</b> time.

You will receive an online meeting invite where you will be able to confirm the scheduled interview.<br/>

@if($commentText)
<p>
    <b>Additional Comments</b><br>
    <i>{!!$commentText!!}</i>
</p>
@endif

Thank you and best regards,<br>
{{ config('app.name') }}

@endcomponent

