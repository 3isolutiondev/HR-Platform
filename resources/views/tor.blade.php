<html>
    <head>
        {{-- <link href="https://fonts.googleapis.com/css?family=Barlow&display=swap" rel="stylesheet"> --}}
        {{-- <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.core.css"/> --}}
        <link rel="stylesheet" type="text/css" href="{{ resource_path('css/quill.core.css') }}"/>
        <link rel="stylesheet" type="text/css" href="{{ resource_path('css/tor.css') }}"/>
    </head>
    <body>
        <div class="width-100 red-bar"><h1 class="tor-title">{{ $tor->title }}</h1></div>
        <table class="width-100 org-container">
            <tr><td class="width-30 color-red bold">Organization: </td><td class="width-70"><div>{{ $tor->organization }}</div></td></tr>
            <tr><td class="width-30 color-red bold">Mailing Address: </td><td class="width-70"><div>{{ $tor->mailing_address }}</div></td></tr>
            <tr><td class="width-30 color-red bold">Program Title: </td><td class="width-70"><div>{{ $tor->program_title }}</div></td></tr>
            <tr><td class="width-30 color-red bold">Country / Region: </td><td class="width-70"><div>{{ $tor->duty_station. ' - ' .$tor->country->name }}</div></td></tr>
            <tr><td class="width-30 color-red bold">Type: </td><td class="width-70"><div>{{ $tor->duration->name }}</div></td></tr>
        </table>
        <div class="red-bar no-text width-100 margin-bottom-5"></div>

        @foreach($tor->sub_sections as $section)
            {{-- <p class="width-100"> --}}
                <h3 class="width-100 sub-section color-red">{{ $section->sub_section }}</h3>
                <div class="ql-container"><div class="ql-editor">{!! $section->sub_section_content !!}</div></div>
            {{-- </p> --}}
        @endforeach
    </body>
</html>
