<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @if(env('APP_ENV') == 'staging')
        <meta name="robots" content="noindex">
        <meta name="googlebot" content="noindex">
    @endif
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ env('APP_NAME') }}</title>

    <link rel="shortcut icon" type="image/png" href="{{ asset('images/favicon.png') }}"/>
    <style>@import url('https://fonts.googleapis.com/css?family=Barlow+Condensed:300,500|Barlow:400,400i,700&display=swap');</style>
    <style type="text/css">#first-loading>svg{animation:2s linear infinite svg-animation;max-width:30px;position:absolute;left:48%;top:40%}@keyframes svg-animation{0%{transform:rotateZ(0)}100%{transform:rotateZ(360deg)}}#first-loading>svg>circle{animation:1.4s ease-in-out infinite both circle-animation;display:block;fill:transparent;stroke:#be2126;stroke-linecap:round;stroke-dasharray:283;stroke-dashoffset:280;stroke-width:8px;transform-origin:50% 50%}@keyframes circle-animation{0%,25%{stroke-dashoffset:280;transform:rotate(0)}50%,75%{stroke-dashoffset:75;transform:rotate(45deg)}100%{stroke-dashoffset:280;transform:rotate(360deg)}}</style>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-155978569-1"></script>
    <script>
        const analyticCookie = document.cookie.split(';').find(c => c.includes('iMMAPCareersCookieConsentAnalytic'));
        if(analyticCookie) {
            if(analyticCookie.split('=')[1] && analyticCookie.split('=')[1].includes('true')) {
                window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-155978569-1');
            }
        }
    </script>
</head>
<body>
    <div id="app">
        <div id="first-loading">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45"/>
            </svg>
        </div>
    </div>

    @if (env('APP_ENV') == 'production' || env('APP_ENV') == "staging")
        <script src="{{ mix('js/prod/app.js') }}" defer></script>
    @else
        <script src="{{ mix('js/dev/app.js') }}"></script>
    @endif
</body>
</html>
