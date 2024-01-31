
@component('mail::message')
<h1>Dear {{ $manager }},</h1>
The candidate has received this email -
<br/><br/>
<i>
Thank you for the interview.

3iSolution Is delighted to offer you the <b>{{ $job_title }}</b> position.
</i>
<i>
Should you accept, you will be contacted in the coming days to discuss more details and schedule introduction briefings.

Please provide your answer to the following email address : {{ $hr_manager_mail }}.
</i>
<i></i>
Thank you and best regards,<br>
{{ config('app.name') }}

</i>
@endcomponent

