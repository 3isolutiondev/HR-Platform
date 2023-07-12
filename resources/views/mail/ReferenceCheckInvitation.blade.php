@component('mail::message')
<h1>Dear {{ $reference_name }},</h1>

<br/>
iMMAP contacted you to conduct a reference check for {{ $profile_name }}, who previously worked with you in {{ $organization }}.

iMMAP is an international not-for-profit organization that provides information management services to humanitarian and development organizations.

iMMAP currently on the process to recruit {{ $profile_name }} as a {{$title}}. {{ $profile_name }} listed you as a relevant reference and mentioned that you may provide some valuable insight into their experience working in your organization.

Please help us by filling the file in the attachment of this email and submitting the file to our system by pressing <b>Submit Reference Check </b> button below.

@component('mail::button', ['url' => $reference_check_link])
Submit Reference Check
@endcomponent

Thank you and We appreciate you taking the time to complete this reference check.</br>

Best Regards,</br>

iMMAP Careers

@component('mail::subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => 'Reference Check Link',
        'actionURL' => $reference_check_link,
    ]
)
@endcomponent
@endcomponent

