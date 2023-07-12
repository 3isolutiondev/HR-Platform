@component('mail::message')
<h1>Dear {{ $profile->user->full_name }},</h1>

<br/>

Based on your profile on iMMAP Careers, we would like to encourage you to apply for the job : {{ $job->title }}.

@component('mail::button', ['url' => $jobUrl])
<i>Apply</i>
@endcomponent

Regards,<br>
{{ config('app.name') }}

@component('mail::subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => $job->title.' Job',
        'actionURL' => $jobUrl,
    ]
)
@endcomponent
@endcomponent

