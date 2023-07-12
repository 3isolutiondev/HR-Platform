@component('mail::message')
<h1>Dear {{ $profile_name }},</h1>

CONGRATULATIONS!
<br/>

We would like to invite you for a professional interview on :<br/>
<b>{{ $interview_date.", ".$timezone }}</b> time.

During the call, you will be in speaking to

<b>iMMAP HR Manager, {{ $hr_manager }}</b>.

Should the interview be completed satisfactory, iMMAP will check your references in the following weeks. The references you entered in your registration form on the iMMAP Careers site will be contacted by iMMAP.

After that process, iMMAP will inform you whether you are officially part of our roster.

<b>iMMAP HR Manager’s skype: {{ $skype }}</b>

Please confirm the scheduled interview to this email address:
<br/>
{{ $hr_manager_email }}

Address : <br/>
{{ $interview_address }}

@if($commentText)
<p>
    <b>Additional Comments</b><br>
    <i>{!!$commentText!!}</i>
</p>
@endif

Regards,<br>
{{ config('app.name') }}

@endcomponent



