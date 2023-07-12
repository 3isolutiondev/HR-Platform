@component('mail::message')
<h1>Dear {{ $name }},</h1>

<br/>
Your account at iMMAP Careers has been deleted.

We hope you decide to come back soon and enjoy our pool of jobs within the humanitarian and development sectors.
<br/>

@component('mail::button', ['url' => $registrationUrl])
Reopen Account
@endcomponent

Our Best Wishes,<br>
{{ config('app.name') }}

@endcomponent
