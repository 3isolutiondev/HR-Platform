@component('mail::message')
<h1>Dear {{ $profile_name }},</h1>

CONGRATULATIONS!
<br/>

You applied to be part of the {{ $roster_process_name }} and we would like to invite you for a online interview on :
<br/>

<b>{{ $interview_date.", ".$timezone }}</b> time.

During the call, you will be in speaking with:

<b>{{ $hr_job_title }}, {{ $hr_manager }}</b>.
<br/>

Should the interview be completed satisfactory, iMMAP will check the references based on the contacts you entered in your profile on iMMAP Careers.

After this process, you will be informed whether you are officially part of the {{ $roster_process_name }}.

You will receive an online meeting invite where you will be able to confirm the scheduled interview.<br/>

@if($commentText)
<p>
    <b>Additional Comments</b><br>
    <i>{!!$commentText!!}</i>
</p>
@endif

<br/>
{{ $hr_manager_email }}

Thank you and best regards,
<br>

{{ config('app.name') }}

@endcomponent

