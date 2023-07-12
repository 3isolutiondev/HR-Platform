<html>
    <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" type="text/css" href="{{ resource_path('css/quill.core.css') }}"/>
        <link rel="stylesheet" type="text/css" href="{{ resource_path('css/tor.css') }}"/>
        <style>

        </style>
    </head>
    <body>

        <div class="width-100 red-bar"><h1 class="tor-title">{{ $tor->title }}</h1></div>
        <table class="width-100 org-container">
            <tr><td class="width-30 color-red bold">Organization: </td><td class="width-70"><div>{{ $tor->organization }}</div></td></tr>
            <tr><td class="width-30 color-red bold">Mailing Address: </td><td class="width-70"><div>{{ $tor->mailing_address }}</div></td></tr>
            <tr><td class="width-30 color-red bold">Program Title: </td><td class="width-70"><div>{{ $tor->program_title }}</div></td></tr>
            @if(!empty($tor->country) && !is_null($tor->country) && !empty($tor->duty_station) && !is_null($tor->duty_station))
                 <tr><td class="width-30 color-red bold">Country / Region: </td><td class="width-70"><div>{{ $tor->duty_station. ' - ' .$tor->country->name }}</div></td></tr>
            @endif
            <tr><td class="width-30 color-red bold">Duration: </td><td class="width-70"><div>{{ $tor->duration->name }}</div></td></tr>
            @if(!empty($tor->cluster) && !is_null($tor->cluster))
                 <tr><td class="width-30 color-red bold">Cluster: </td><td class="width-70"><div>{{ $tor->cluster }}</div></td></tr>
            @endif
        </table>
        <div class="red-bar no-text width-100 margin-bottom-4"></div>
        @foreach($tor->sub_sections as $section)
            <h3 class="width-100 sub-section color-red">{{ $section->sub_section }}</h3>
            <div class="ql-container">
                <div class="ql-editor">
                    {!! $section->sub_section_content !!}
                </div>
            </div>
        @endforeach
    </body>
</html>
