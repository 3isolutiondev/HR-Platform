@component('mail::message')
<h1>Dear {{ $profile_name }},</h1>

iMMAP is pleased to inform you that your profile has been selected to participate in the {{ $roster_process_name }} selection process, and we would like to invite you for an introductory call on:
<br/>

<b>{{ $interview_date.", ".$timezone }}</b> time.

During the call, you will speak with a member of the Global Surge Team, to discuss several topics and express your motivation to join our roster. This call should take around 10-15min.
<br/>


You will receive an online meeting invite where you will be able to confirm the scheduled interview.<br/>

@if($commentText)
<p>
    <b>Additional Comments</b><br>
    <i>{!!$commentText!!}</i>
</p>
@endif

<br/>

Thank you and best regards,
<br>

{{ config('app.name') }}

@endcomponent

