@php
    $btnExists = strpos($content, "[profile_btn]");
    if ($btnExists !== false) {
        $content_parts = explode("[profile_btn]", $content);
    }
@endphp
@component('mail::message')
@if($btnExists !== false)
    {!! $content_parts[0] !!}
    @component('mail::button', ['url'=> secure_url('profile')])
    Profile
    @endcomponent
    {!! $content_parts[1] !!}
    @component('mail::subcopy')
    If you’re having trouble clicking the "Profile" button, copy and paste the URL below into your web browser: {!! secure_url('profile') !!}
    @endcomponent
@endif
@if($btnExists === false)
{!! $content !!}
@endif
@endcomponent
