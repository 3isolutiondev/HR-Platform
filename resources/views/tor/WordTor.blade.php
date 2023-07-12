<html>
    <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.core.css"/>

        <style>
            @import url('https://fonts.googleapis.com/css?family=Barlow&display=swap');
            body {
                font-family: 'Barlow', sans-serif !important;
            }
        </style>
    </head>
    <body>

        <div class="width-100 red-bar"><h1 class="tor-title" style="color: white;font-weight: bold;width: 100%;display: block;background-color: #be2126;text-align: center; vertical-align:top;padding: 0;margin: 0;font-size: 14pt;">{{ $tor->title }}</h1></div>
        <table class="width-100 org-container">
            <tr><td class="width-30 color-red bold" style="color: #be2126; font-weight: bold;">Organization: </td><td class="width-70"><div>{{ $tor->organization }}</div></td></tr>
            <tr><td class="width-30 color-red bold" style="color: #be2126; font-weight: bold;">Mailing Address: </td><td class="width-70"><div>{{ $tor->mailing_address }}</div></td></tr>
            <tr><td class="width-30 color-red bold" style="color: #be2126; font-weight: bold;">Program Title: </td><td class="width-70"><div>{{ $tor->program_title }}</div></td></tr>
            <tr><td class="width-30 color-red bold" style="color: #be2126; font-weight: bold;">Country / Region: </td><td class="width-70"><div>{{ $tor->duty_station. $tor->country ? ' - ' .$tor->country->name : '' }}</div></td></tr>
            <tr><td class="width-30 color-red bold" style="color: #be2126; font-weight: bold;">Duration: </td><td class="width-70"><div>{{ $tor->duration->name }}</div></td></tr>
            @if(!empty($tor->cluster) && !is_null($tor->cluster))
            <tr><td class="width-30 color-red bold" style="color: #be2126; font-weight: bold;">Cluster: </td><td class="width-70"><div>{{ $tor->cluster }}</div></td></tr>
            @endif
        </table>
        <div class="red-bar no-text width-100 margin-bottom-4" style="color: #be2126; font-weight: bold;padding: 4px; background: #be2126;">...</div>
        @foreach($tor->sub_sections as $section)
            <h3 class="width-100 sub-section color-red">{{ $section->sub_section }}</h3>
            <div class="ql-container">
                <div class="ql-editor">
                    {!! $section->sub_section_content !!}
                </div>
            </div><br/><br/>
        @endforeach
    </body>
</html>
