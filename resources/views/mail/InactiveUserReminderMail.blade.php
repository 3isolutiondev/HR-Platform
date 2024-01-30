@component('mail::message')
<h1>Dear {{ $full_name }},</h1>

<br/>
We have noticed that your profile at 3iSolution Careers has been inactive for more than one year. In order to keep your account on the platform, we would like to encourage to update your profile with your latest information, such as skills, areas of expertise and job experience. Moreover, you can have a look at our current job openings and apply to the ones that match your expertise.

In the event of not wanting to keep your profile on 3iSolution Careers, we will proceed with the deletion of your account after 30 days of inaction (profile not updated or not applied to any jobs).

Our Best Wishes,<br>
{{ config('app.name') }}

@endcomponent

