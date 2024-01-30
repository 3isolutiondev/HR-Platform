@component('mail::message')
<h1>Dear {{ $full_name }},</h1>

<br/>
We have noticed that your profile at 3iSolution Careers has not been completed yet. In order to offer the best jobs within the humanitarian and development sectors, we ask you to complete and submit it within the next 30 days.

In the event of not completing your profile within the next 30 days, we will proceed with the deletion of your account.

Our Best Wishes,<br>
{{ config('app.name') }}

@endcomponent

