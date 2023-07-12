@component('mail::message')
<h1>Dear {{ $manager }},</h1>
The candidate has received this email
<br/>
<b>{{$name}}</b>
<br/><br/>
<i>
Based on your profile on iMMAP Careers, we would like to encourage you to apply for the {{ $roster_title }}
</i>
@component('mail::button', ['url' => $roster_url])
<i>Apply</i>
@endcomponent

<i>
Thank you and best regards,
<br>
{{ config('app.name') }}

@component('mail::subcopy')
<i>
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => 'Apply',
        'actionURL' => $roster_url,
    ]
)
</i>
@endcomponent
@endcomponent
