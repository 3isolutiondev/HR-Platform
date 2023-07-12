@component('mail::message')
<h1>Dear Developer,</h1>

<br/>
There is an error while changing user status to hidden from remove account request.

## Please see old user details here:
- Name: {{ $oldUserData->full_name }}
- Email: {{ $oldUserData->email }}
- User ID: {{ $oldUserData->id }}
- Status: {{ $oldUserData->status }}
- Hidden Date: {{ $oldUserData->hidden_date }}
- Schedule Deletion Date: {{ $oldUserData->schedule_deletion_date }}

Regards,<br>
{{ config('app.name') }}
@endcomponent

