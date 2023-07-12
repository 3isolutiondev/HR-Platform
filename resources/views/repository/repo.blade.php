<html>
    <head>
        <meta charset="UTF-8" />
        {{-- <link href="https://fonts.googleapis.com/css?family=Barlow&display=swap" rel="stylesheet"> --}}
        <!--{{-- <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.core.css"/> --}}-->
        <link rel="stylesheet" type="text/css" href="{{ resource_path('css/quill.core.css') }}"/>
        <link rel="stylesheet" type="text/css" href="{{ resource_path('css/tor.css') }}"/>
        <style>

        </style>
    </head>
    <body>
        
        @foreach($content as $section)
        {{-- <p class="width-100"> --}}
            {{-- <div> --}}
                <h3 class="width-100 sub-section color-red">{{ $section['sub_section'] }}</h3>
                <div class="ql-container">
                    <div class="ql-editor">
                        {!! $section['sub_section_content'] !!}
                    </div>
                </div>
                {{-- </div> --}}
                {{-- </p> --}}
            @endforeach
            
            <!--</div></div>-->
    </body>
</html>