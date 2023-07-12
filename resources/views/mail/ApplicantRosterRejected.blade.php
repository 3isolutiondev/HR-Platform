@component('mail::message')
<h1>Dear {{ $applicant_name }},</h1>

Thank you for applying for our {{ $roster_name }}.
<br/>

After carefully reviewing your qualifications, we are sorry to inform you that we will not retain your profile to be a part of our {{ $roster_name }}.
<br/>

We appreciate your interest in our Surge Program, and the time it took to apply with us.
<br/>

We seek for different profiles within various humanitarian sectors to join our Surge Roster. Profiles such as Information Managers, GIS, Data Analysts, Data Visualization Experts, etc. As you acquire more experience in any of these roles, we invite you to apply again to the Surge Program for our review and evaluation.
<br/>

Once again, thank you for considering us. We wish you success in your career pursuit.

Sincerely,<br>
{{ config('app.name') }}

@endcomponent

