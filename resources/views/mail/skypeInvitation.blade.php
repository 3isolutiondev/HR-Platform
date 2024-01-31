@component('mail::message')
<h1>Dear {{ $profile_name }},</h1>
<br/>
3iSolution Is pleased to inform you that your profile has been selected to participate in the iMMAP {{ $roster_process }} selection process, and we would like to invite you for an introductory Skype call on:
<br/>

<b>{{ $skype_date.", ".$skype_timezone }}</b> time,
<br/>

During the call, you will speak with an iMMAP {{ $roster_process }} officer, to discuss several topics and express your motivation to join our roster. This call should take around 10-15min.

<b>iMMAP {{ $roster_process}} Officer skype: {{ $skype_id }} </b>

Regards,
<br>

{{ config('app.name') }}

@endcomponent
