@component('mail::message')
<h1>Dear Colleagues</h1>

Please be informed that the new iMMAP’s <b>{{ $document['name'] }}</b> is now available on 3iSolution Careers.

@component('mail::button', ['url'=>$document['download_url']])
{{ $document['name'] }}
@endcomponent

Please take time to read it and make sure you respect it.

If you have any questions, please feel free to reach out to iMMAP HR Director (cleroy@organization.org).

Thank you and best regards,<br>
{{ config('app.name') }}

@endcomponent
