{{-- @component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Your profile presents qualities which might interest iMMAP.

We would like to encourage you to apply for {{ $job_title }}

@component('mail::button', ['url' => $job_url])
Apply
@endcomponent

Thank you and best regards,<br>
{{ config('app.name') }}

@component('mail::subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => 'Apply',
        'actionURL' => $job_url,
    ]
)
@endcomponent
@endcomponent --}}


@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Based on your profile on 3iSolution Careers, we would like to encourage you to apply for the {{ $job_title }}

@component('mail::button', ['url' => $job_url])
Apply
@endcomponent

Thank you and best regards,
<br>

{{ config('app.name') }}

@component('mail::subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => 'Apply',
        'actionURL' => $job_url,
    ]
)
@endcomponent
@endcomponent

