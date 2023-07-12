@component('mail::message')
<h1>Dear {{ $profile_name }},</h1>

<br/>
iMMAP is delighted to inform you that your application is moving forward in the iMMAP Roster selection process, and we would like to invite you to take an Information Management test to assess your technical skills.

Please be informed that the test will take <b>4 hours</b> to be completed and only one access to the test is authorized.

Starting from the reception of this email, you have <b>1 week </b> until <b>{{ $im_test_submit_date.', '.$im_test_timezone }} time</b> to click on the link below and complete the test.

Please note that the test includes files' downloads and uploads. Please make sure you have a stable internet connection before taking the test.

Best of luck!

@component('mail::button', ['url' => $im_test_link])
IM Test Link
@endcomponent

Regards,<br>
{{ config('app.name') }}

@component('mail::subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => 'IM Test Link',
        'actionURL' => $im_test_link,
    ]
)
@endcomponent
@endcomponent

