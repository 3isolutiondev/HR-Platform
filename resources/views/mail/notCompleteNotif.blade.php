@component('mail::message')
<h1>Dear User,</h1>

<br/>
Your profile on 3iSolution Careers is still marked as incomplete.<br/>

Do not forget to complete your profile through the registration process to be able apply for our job vacancies or the iMMAP Talent Pool.

Please provide your remaining details on the <b>profile section</b> of 3iSolution Careers: <br/>
@component('mail::button', ['url'=> secure_url('profile')])
Profile
@endcomponent

We look forward to working with you soon.

Thank you and best regards,<br>
{{ config('app.name') }}

@component('mail::subcopy')
If you’re having trouble clicking the "Profile" button, copy and paste the URL below into your web browser: {!! secure_url('profile') !!}
@endcomponent
@endcomponent
