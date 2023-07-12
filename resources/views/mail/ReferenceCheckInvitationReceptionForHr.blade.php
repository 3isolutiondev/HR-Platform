@component('mail::message')
<h1>Dear {{ $username }},</h1>

<br/>
A reference checks has been successfully submitted for {{ $profile_name }} regarding the {{$title}} position by {{$reference_name}}.
<br/>

This document is available under Reference Checks step for the {{$title}} recruitment process. <br/>

Best Regards,</br>

iMMAP Careers
@endcomponent