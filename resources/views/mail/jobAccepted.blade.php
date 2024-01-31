{{-- @component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Thank you for the interview.
3iSolution Is delighted to offer you the <b>{{ $job_title }}</b> position.

HR Manager will reach out to you in the coming days in order to send you your contract and HR documentations.

Please sign and return the contract to the following email address : {{ $hr_manager_mail }} at your earliest convenience.

Thank you and best regards,<br>
{{ config('app.name') }}

@endcomponent --}}


@component('mail::message')
<h1>Dear {{ $name }},</h1>
<br/>
Thank you for the interview.

3iSolution Is delighted to offer you the <b>{{ $job_title }}</b> position.

Should you accept, you will be contacted in the coming days to discuss more details and schedule introduction briefings.

Please provide your answer to the following email address : {{ $hr_manager_mail }}.
<br>

Thank you and best regards,

{{ config('app.name') }}
@endcomponent
