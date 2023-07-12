
@component('mail::message')
<h1>A {{ $request_type }} request with the following details has been submitted by {{ $requester }}</h1>
<br/>
<b>First Name:</b> {{ $first_name }}
<br>
<b>Last Name:</b> {{ $last_name }}
<br>
<b>Position:</b> {{ $position }}
<br>
<b>Paid From:</b> {{ $paid_from }}
<br>
<b>Cost Center:</b> {{ $cost_center }}
<br>
<b>Project Code:</b> {{ $project_code }}
<br>
<b>Project Task/Activity:</b> {{ $project_task }}
<br>
<b>Contract Start:</b> {{ $contract_start }}
<br>
<b>Contract End:</b> {{ $contract_end }}
<br>
<b>Supervisor:</b> {{ $supervisor }}
<br>
<b>Unanet Approver:</b> {{ $unanet_approver_name }}
<br>
<b>Hosting Agency:</b> {{ $hosting_agency }}
<br>
<b>Duty Station:</b> {{ $duty_station }}
<br>
<b>Home Based:</b> {{ $home_based }}
<br>
<b>Currency:</b> {{ $currency }}
<br>
<b>Monthly Rate:</b> {{ $monthly_rate }}
<br>
@if($housing == 1 || $perdiem == 1 || $phone == 1 || !empty($other) || $not_applicable == 1)
<b>Allowances:</b>
<br/>
@endif
@if($housing == 1)
<span style="margin-left: 1em">- Housing</span>
<br/>
@endif
@if($perdiem == 1)
<span style="margin-left: 1em">- Perdiem</span>
<br/>
@endif
@if($phone == 1)
<span style="margin-left: 1em">- Phone</span>
<br/>
@endif
@if(!empty($other))
<span style="margin-left: 1em">- Other: {{ $other }}</span>
<br/>
@endif
@if($not_applicable == 1)
<span style="margin-left: 1em">- Not Applicable</span>
<br/>
@endif

Thank you and best regards,

iMMAP Careers
@endcomponent
