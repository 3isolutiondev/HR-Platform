@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
We have received a request to permanently delete your iMMAP Careers account and all information associated with it.

@if($hiddenConfirmationMail)
Please note that due to data protection and privacy laws, we will retain your data for a period no longer than five years. During this period, you can restore your account and its associated data if you register with the same email address. After this period, we will proceed with the permanent deletion of your account and its data.
@else
Please note that we will proceed with the permanent deletion of your account and all its associated data. You will not be able to restore your account nor retrieve your data after the deletion.
@endif

If you are sure that you want to delete the account linked to the email address **{{ $email }}**, then click on the 'Remove my account' button.
<br/>

@component('mail::button', ['url' => $removeUrl])
Remove my account
@endcomponent

The above link is valid during 1 hour. After this period, you will need to request another link from your profile page: <a href="https://careers.immap.org/profile">{{ config('app.name') }}</a>.

If you decide to start using iMMAP Careers in the future, you will have the option to register your account with this email address again.

Ignore this message if you decided to continue using iMMAP Careers.

Our Best Wishes,<br>
{{ config('app.name') }}

@component('mail::subcopy')
@lang(
    "If you are having trouble clicking the \":actionText\" button, then you can copy and paste the following link\n".
    "into your web browser: [:actionURL](:actionURL) \n".
    "\nNote: The above link is valid during 1 hour. After this period, you will need to request another link from your profile page: [:recreateText](:recreateURL)",
    [
        'actionText' => 'Remove my account',
        'actionURL' => $removeUrl,
        'recreateText' => config('app.name'),
        'recreateURL' => env('APP_URL') . '/profile'
    ]
)
@endcomponent
@endcomponent
