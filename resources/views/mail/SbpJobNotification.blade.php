@component('mail::message')
<h1>Dear members of the iMMAP {{ $sbpRosterName }},</h1>

<br/>
The iMMAP Global Surge Team is currently looking for an <b>{{ $job->title }}</b> for a Surge deployment to <b>{{ $tor->organization }}@if(!empty($cluster) && !is_null($cluster))/{{ $cluster}}@endif, in {{ $country }}</b>, through our <b>Standby Partnership Programme</b>.

The position is @if($country == "Home Based")<b>{{ $country }}</b>@else based in <b>{{ $dutyStation }}, {{ $country }}</b>@endif. The position is for <b>{{ $duration }}</b>, starting as soon as possible.

The TORs with its direct link below outlining the key requirements, duties, and tasks for your reference only.

iMMAP's Global Surge Team is contacting you to check whether you are interested and available for this assignment.

The Partner Organization has asked us to nominate suitable candidates as soon as possible. iMMAP will nominate the most suitable candidate/candidates that best match the job profile, to the requesting Organization. Most often a request has also been sent to other Organizations, which means that the candidate/candidates iMMAP nominates will also compete with other nominees in the final selection process from other Organizations. It is the requesting Organization which selects the most suitable candidate for the assignment, iMMAP cannot influence the outcome.

This request has been sent to <b>{{ $acceptedMemberCount }} candidates</b> of the iMMAP Surge Roster. Expressing your interest to iMMAP's Global Surge Team does not automatically entail that you will be nominated and/or selected for this deployment.

If you are interested in this deployment kindly ensure that:


<li>Your profile and CV on iMMAP Career are up-to-date, including your current location and;</li>

<li>You confirm the earliest date you can depart if selected for the assignment on iMMAP Careers.</li>


Please let us know as soon as possible, but no later than <b>{{ $closingDate }}</b>, 5pm Geneva time, if you are interested in this assignment. Please express your interest by clicking here:

@component('mail::button', ['url' => url('/jobs/'.$job->id)])
Open Surge Alert
@endcomponent

If you are not interested or not available for this assignment, please discard this message.

You are receiving this message as you are a member of the iMMAP Global Surge Roster. Please do not forward this email.

<br/>
Best regards,
<br/>
Global Surge Team

@endcomponent
