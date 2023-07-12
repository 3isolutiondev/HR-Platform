@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
The Job Applicants to Roster Recruitment Campaign script run successfully. Please see the list of duplicate applicant between job recruitment and roster recruitment below.

## Duplication Report on Both Recruitment

Job: {{ $job->title . " [ID: ".$job->id."]" }} <br/>
Roster: {{ $roster->name . " [ID: ".$roster->id."]" }} <br/>
Total Duplication: {{ count($applicantData) }}

<table id="duplicateReport">
    <thead>
        <tr><th>Profile ID</th><th>Name</th><th>Job Status</th><th>Roster Step</th></tr>
    </thead>
    <tbody>
        @foreach ($applicantData as $applicant)
        <tr><td>{{ $applicant->profileId }}</td><td>{{ $applicant->fullname }}</td><td>{{ $applicant->jobStatus }}</td><td>{{ $applicant->rosterStep }}</td></tr>
        @endforeach
    </tbody>
</table>

<br/>

## Rejected on Both Recruitment Report

Job: {{ $job->title . " [ID: ".$job->id."]" }} <br/>
Roster: {{ $roster->name . " [ID: ".$roster->id."]" }} <br/>
Total Duplication: {{ count($rejectedOnBoth) }}

<table id="duplicateReport">
    <thead>
        <tr><th>Profile ID</th><th>Name</th><th>Job Status</th><th>Roster Step</th></tr>
    </thead>
    <tbody>
        @foreach ($rejectedOnBoth as $applicant)
        <tr><td>{{ $applicant->profileId }}</td><td>{{ $applicant->fullname }}</td><td>{{ $applicant->jobStatus }}</td><td>{{ $applicant->rosterStep }}</td></tr>
        @endforeach
    </tbody>
</table>

<br/>


Thank you,<br>
{{ config('app.name') }}

@endcomponent
