
@component('mail::message')
<h1>Dear {{ $name }},</h1>
<br/>
We appreciate your interest in iMMAP and the time you have invested in applying for the {{ $job_title }} opening.

We ended up moving forward with another candidate, but we would like to thank you for talking to our team and giving us the opportunity to learn about your skills and accomplishments.

We are frequently advertising more positions and we encourage you to regularly check on iMMAP Careers for new opportunities to work together.

We wish you good luck with your job search and professional future endeavors.
<br>

Thank you and best regards,

{{ config('app.name') }}
@endcomponent
