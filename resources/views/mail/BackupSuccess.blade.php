@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Backup Script run successfully. Please see the details below.

## Report
- Database Size: {{ $dbSize }}
- Backup Size: {{ $backupSize }}

Thank you,<br>
{{ config('app.name') }}

@endcomponent
