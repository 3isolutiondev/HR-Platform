<style>
    /*!
 * Quill Editor v1.3.7
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */.ql-container{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;height:100%;margin:0;position:relative}.ql-container.ql-disabled .ql-tooltip{visibility:hidden}.ql-container.ql-disabled .ql-editor ul[data-checked]>li::before{pointer-events:none}.ql-clipboard{left:-100000px;height:1px;overflow-y:hidden;position:absolute;top:50%}.ql-clipboard p{margin:0;padding:0}.ql-editor{box-sizing:border-box;line-height:1.42;height:100%;outline:0;overflow-y:auto;padding:12px 15px;tab-size:4;-moz-tab-size:4;text-align:left;white-space:pre-wrap;word-wrap:break-word}.ql-editor>*{cursor:text}.ql-editor blockquote,.ql-editor h1,.ql-editor h2,.ql-editor h3,.ql-editor h4,.ql-editor h5,.ql-editor h6,.ql-editor ol,.ql-editor p,.ql-editor pre,.ql-editor ul{margin:0;padding:0;counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol,.ql-editor ul{padding-left:1.5em}.ql-editor ol>li,.ql-editor ul>li{list-style-type:none}.ql-editor ul>li::before{content:'\2022'}.ql-editor ul[data-checked=false],.ql-editor ul[data-checked=true]{pointer-events:none}.ql-editor ul[data-checked=false]>li *,.ql-editor ul[data-checked=true]>li *{pointer-events:all}.ql-editor ul[data-checked=false]>li::before,.ql-editor ul[data-checked=true]>li::before{color:#777;cursor:pointer;pointer-events:all}.ql-editor ul[data-checked=true]>li::before{content:'\2611'}.ql-editor ul[data-checked=false]>li::before{content:'\2610'}.ql-editor li::before{display:inline-block;white-space:nowrap;width:1.2em}.ql-editor li:not(.ql-direction-rtl)::before{margin-left:-1.5em;margin-right:.3em;text-align:right}.ql-editor li.ql-direction-rtl::before{margin-left:.3em;margin-right:-1.5em}.ql-editor ol li:not(.ql-direction-rtl),.ql-editor ul li:not(.ql-direction-rtl){padding-left:1.5em}.ql-editor ol li.ql-direction-rtl,.ql-editor ul li.ql-direction-rtl{padding-right:1.5em}.ql-editor ol li{counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;counter-increment:list-0}.ql-editor ol li:before{content:counter(list-0,decimal) '. '}.ql-editor ol li.ql-indent-1{counter-increment:list-1}.ql-editor ol li.ql-indent-1:before{content:counter(list-1,lower-alpha) '. '}.ql-editor ol li.ql-indent-1{counter-reset:list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-2{counter-increment:list-2}.ql-editor ol li.ql-indent-2:before{content:counter(list-2,lower-roman) '. '}.ql-editor ol li.ql-indent-2{counter-reset:list-3 list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-3{counter-increment:list-3}.ql-editor ol li.ql-indent-3:before{content:counter(list-3,decimal) '. '}.ql-editor ol li.ql-indent-3{counter-reset:list-4 list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-4{counter-increment:list-4}.ql-editor ol li.ql-indent-4:before{content:counter(list-4,lower-alpha) '. '}.ql-editor ol li.ql-indent-4{counter-reset:list-5 list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-5{counter-increment:list-5}.ql-editor ol li.ql-indent-5:before{content:counter(list-5,lower-roman) '. '}.ql-editor ol li.ql-indent-5{counter-reset:list-6 list-7 list-8 list-9}.ql-editor ol li.ql-indent-6{counter-increment:list-6}.ql-editor ol li.ql-indent-6:before{content:counter(list-6,decimal) '. '}.ql-editor ol li.ql-indent-6{counter-reset:list-7 list-8 list-9}.ql-editor ol li.ql-indent-7{counter-increment:list-7}.ql-editor ol li.ql-indent-7:before{content:counter(list-7,lower-alpha) '. '}.ql-editor ol li.ql-indent-7{counter-reset:list-8 list-9}.ql-editor ol li.ql-indent-8{counter-increment:list-8}.ql-editor ol li.ql-indent-8:before{content:counter(list-8,lower-roman) '. '}.ql-editor ol li.ql-indent-8{counter-reset:list-9}.ql-editor ol li.ql-indent-9{counter-increment:list-9}.ql-editor ol li.ql-indent-9:before{content:counter(list-9,decimal) '. '}.ql-editor .ql-indent-1:not(.ql-direction-rtl){padding-left:3em}.ql-editor li.ql-indent-1:not(.ql-direction-rtl){padding-left:4.5em}.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right{padding-right:3em}.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right{padding-right:4.5em}.ql-editor .ql-indent-2:not(.ql-direction-rtl){padding-left:6em}.ql-editor li.ql-indent-2:not(.ql-direction-rtl){padding-left:7.5em}.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right{padding-right:6em}.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right{padding-right:7.5em}.ql-editor .ql-indent-3:not(.ql-direction-rtl){padding-left:9em}.ql-editor li.ql-indent-3:not(.ql-direction-rtl){padding-left:10.5em}.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right{padding-right:9em}.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right{padding-right:10.5em}.ql-editor .ql-indent-4:not(.ql-direction-rtl){padding-left:12em}.ql-editor li.ql-indent-4:not(.ql-direction-rtl){padding-left:13.5em}.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right{padding-right:12em}.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right{padding-right:13.5em}.ql-editor .ql-indent-5:not(.ql-direction-rtl){padding-left:15em}.ql-editor li.ql-indent-5:not(.ql-direction-rtl){padding-left:16.5em}.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right{padding-right:15em}.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right{padding-right:16.5em}.ql-editor .ql-indent-6:not(.ql-direction-rtl){padding-left:18em}.ql-editor li.ql-indent-6:not(.ql-direction-rtl){padding-left:19.5em}.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right{padding-right:18em}.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right{padding-right:19.5em}.ql-editor .ql-indent-7:not(.ql-direction-rtl){padding-left:21em}.ql-editor li.ql-indent-7:not(.ql-direction-rtl){padding-left:22.5em}.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right{padding-right:21em}.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right{padding-right:22.5em}.ql-editor .ql-indent-8:not(.ql-direction-rtl){padding-left:24em}.ql-editor li.ql-indent-8:not(.ql-direction-rtl){padding-left:25.5em}.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right{padding-right:24em}.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right{padding-right:25.5em}.ql-editor .ql-indent-9:not(.ql-direction-rtl){padding-left:27em}.ql-editor li.ql-indent-9:not(.ql-direction-rtl){padding-left:28.5em}.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right{padding-right:27em}.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right{padding-right:28.5em}.ql-editor .ql-video{display:block;max-width:100%}.ql-editor .ql-video.ql-align-center{margin:0 auto}.ql-editor .ql-video.ql-align-right{margin:0 0 0 auto}.ql-editor .ql-bg-black{background-color:#000}.ql-editor .ql-bg-red{background-color:#e60000}.ql-editor .ql-bg-orange{background-color:#f90}.ql-editor .ql-bg-yellow{background-color:#ff0}.ql-editor .ql-bg-green{background-color:#008a00}.ql-editor .ql-bg-blue{background-color:#06c}.ql-editor .ql-bg-purple{background-color:#93f}.ql-editor .ql-color-white{color:#fff}.ql-editor .ql-color-red{color:#e60000}.ql-editor .ql-color-orange{color:#f90}.ql-editor .ql-color-yellow{color:#ff0}.ql-editor .ql-color-green{color:#008a00}.ql-editor .ql-color-blue{color:#06c}.ql-editor .ql-color-purple{color:#93f}.ql-editor .ql-font-serif{font-family:Georgia,Times New Roman,serif}.ql-editor .ql-font-monospace{font-family:Monaco,Courier New,monospace}.ql-editor .ql-size-small{font-size:.75em}.ql-editor .ql-size-large{font-size:1.5em}.ql-editor .ql-size-huge{font-size:2.5em}.ql-editor .ql-direction-rtl{direction:rtl;text-align:inherit}.ql-editor .ql-align-center{text-align:center}.ql-editor .ql-align-justify{text-align:justify}.ql-editor .ql-align-right{text-align:right}.ql-editor.ql-blank::before{color:rgba(0,0,0,.6);content:attr(data-placeholder);font-style:italic;left:15px;pointer-events:none;position:absolute;right:15px}
/*# sourceMappingURL=quill.core.min.css.map */
    .tor-title{
        color: white;
        font-weight: bold;
        width: 100%;
        display: block;
        text-align: center;
        padding: 0;
        margin:0;
        font-size: 11pt;
    }
    .col-3 {
        width: 29%;
        display: inline-block;
    }
    .col-7 {
        width: 70%;
        display: inline-block;
    }
    .color-red{ color: #be2126; }
    .bold{ font-weight: bold; }
    .red-bar {padding: 4px; background: #be2126;}
    .no-text {height: 3.5mm;}
    .org-container{ margin-top: 5px; margin-bottom: 5px;}
    .width-100{ width: 100%; clear: both; }
    .width-70{width: 70%}
    .width-30{width: 30%}
    .margin-top-5{ margin-top: 6mm}
    .margin-bottom-5{ margin-bottom: 5mm}
    .sub-section{
        font-size: 10pt;
        margin:0;
        padding: 0;
    }
    .ql-container, .ql-editor{height: auto; page-break-inside: always; page-break-after: always; page-break-before: always;}
    p{ margin-bottom: 2mm; margin-top: 2mm;}
    .ql-editor ul { margin-top: -1mm; padding-top: 0;}
    /* li.ql-indent-1{margin-left: 4.5mm;} */
    /* .ql-container .ql-editor ul li {page-break-inside: always;} */
    /* .footer{text-align: center; width: 20%; height: 50px;} */
    /* .footer{ margin-left: -20%; width: 80mm; position: relative; display: block;} */
    .footer-container{ text-align: center; width: 100%; display: block; position: relative;}
    .footer-container p{font-weight: bold; margin-bottom: 0; margin-top: 1mm;}
</style>
{{-- <page backtop="30mm" backbottom="14mm" backleft="10mm" backright="10mm" style="font-size: 11pt;"> --}}
<page backtop="38.1mm" backbottom="25.4mm" backleft="25.4mm" backright="25.4mm" style="font-size: 10pt;">
    <page_header class="margin-top-5">
        <table class="width-100">
        <tr><td class="width-100" style="text-align: center;">@if(file_exists($logo))<img src="{{ $logo }}" width="95" height="84"/>@endif</td></tr>
        </table>
    </page_header>
    <page_footer>
        <table class="footer-container">
            <tr><td class="width-100" style="text-align: center;">
                <p>RRB / ITC</p>
                <p>1300 Pennsylvania Avenue NW, Suite 470</p>
                <p>Washington, DC 20004 USA</p>
                <p>Telephone: +1 (202) 999-4245</p>
                <p>www.immap.org</p>
            </td></tr>
        </table>
    </page_footer>
    <div class="width-100 red-bar"><h1 class="tor-title">{{ $tor->title }}</h1></div>
    <table class="width-100 org-container">
        <tr><td class="width-30 color-red bold">Organization: </td><td class="width-70"><div>{{ $tor->organization }}</div></td></tr>
        <tr><td class="width-30 color-red bold">Mailing Address: </td><td class="width-70"><div>{{ $tor->mailing_address }}</div></td></tr>
        <tr><td class="width-30 color-red bold">Program Title: </td><td class="width-70"><div>{{ $tor->program_title }}</div></td></tr>
        <tr><td class="width-30 color-red bold">Country / Region: </td><td class="width-70"><div>{{ $tor->duty_station. ' - ' .$tor->country->name }}</div></td></tr>
        <tr><td class="width-30 color-red bold">Duration: </td><td class="width-70"><div>{{ $tor->duration->name }}</div></td></tr>
    </table>
    <div class="red-bar no-text width-100 margin-bottom-5"></div>

    @foreach($tor->sub_sections as $section)
        {{-- <p class="width-100"> --}}
            <h3 class="width-100 sub-section color-red">{{ $section->sub_section }}</h3>
            <div class="width-100 ql-container"><div class="width-100 ql-editor">{!! $section->sub_section_content !!}</div></div>
        {{-- </p> --}}
    @endforeach
</page>
{{--

--}}
