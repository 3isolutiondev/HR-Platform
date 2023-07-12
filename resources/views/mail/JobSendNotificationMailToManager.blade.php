
@component('mail::message')
<h1>Dear {{ $immaper }},</h1>
<br/>
You were assigned as a hiring manager for the {{$job_title}} position.
You can now access the recruitment process and start shortlisting candidates.
<br/>
@component('mail::button', ['url' => $job_url])
{{ $job_title.' Job' }}
@endcomponent

Regards,<br>
{{ config('app.name') }}

@component('mail::subcopy')

@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => $job_title,
        'actionURL' => $job_url,
    ]
)

@endcomponent
@endcomponent