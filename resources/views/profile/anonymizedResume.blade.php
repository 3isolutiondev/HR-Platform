<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <link rel="stylesheet" media="all" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/css/bootstrap.min.css" />

        <style>
            /* vietnamese */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHqv4kjgoGqM7E3p-ks6Fostz0rdom9.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
            }
            /* latin-ext */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHqv4kjgoGqM7E3p-ks6Vostz0rdom9.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            /* latin */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHqv4kjgoGqM7E3p-ks51ostz0rdg.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            /* vietnamese */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHpv4kjgoGqM7E_A8s5ynghnQci.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
            }
            /* latin-ext */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHpv4kjgoGqM7E_Ass5ynghnQci.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            /* latin */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHpv4kjgoGqM7E_DMs5ynghnQ.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            /* vietnamese */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHqv4kjgoGqM7E3t-4s6Fostz0rdom9.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
            }
            /* latin-ext */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHqv4kjgoGqM7E3t-4s6Vostz0rdom9.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            /* latin */
            @font-face {
                font-family: 'Barlow';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/barlow/v5/7cHqv4kjgoGqM7E3t-4s51ostz0rdg.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            body { font-family: 'Barlow', sans-serif !important; }
            body * {word-break: break-word !important;}
            .left-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 33.333333%;
                height: 100%;
                background: #f0efef;
                z-index: -1;
            }
            .left-column{
                width: 33.333333% !important;
            }
            .right-column{ width: calc(100% -  33.333333%); }
            .detail-container { width: 100% !important; display: flex; position: relative; flex: 33.333333% 1;}
            .text-center{ text-align: center; }
            .text-right{ text-align: right; }
            .margin-left-xs{ margin-left: 8px;}
            .margin-left-sm{ margin-left: 16px;}
            .margin-right-xs{ margin-right: 8px;}
            .margin-right-sm{ margin-right: 16px;}
            .margin-right-md{ margin-right: 32px;}
            .margin-bottom-xs{ margin-bottom: 8px;}
            .margin-bottom-sm{ margin-bottom: 16px;}
            .margin-bottom-md{ margin-bottom: 24px;}
            .margin-bottom-lg{ margin-bottom: 32px;}
            .margin-top-xs{ margin-top: 8px;}
            .margin-top-sm{ margin-top: 16px;}
            .margin-top-md{ margin-top: 24px;}
            .margin-top-lg{ margin-top: 32px;}
            .light-grey-color{ color: #d7d7d7 !important; }
            .grey-color{ color: #787878 !important; }
            .white-color{ color: white !important; }
            .immap-color{ color: #be2126 !important; }
            .current-link{ text-decoration: none; }
            .border-bottom-immap{ border-bottom: 1px solid #be2126; padding-bottom: 8px;}
            .float-right{ float: right !important; }
            .display-block{ display: block !important; }
            .pre-line{ white-space: pre-line; }
            .bold{ font-weight: bold !important; }
            /* .avatar{ border-radius: 50%; border: 2px solid #be2126; float: right; } */
            @page {
                size: a4;
                margin: 26px;
            }
            .identity { padding-bottom: 26px; border-bottom: 2px solid #636d71; background: #fff; display: flex; flex: 1 1; }
            .identity-left { width: calc(100% - 156px); padding-left: 26px;}
            .identity-right { width: 156px: text-align: 'right';}
            .font-light { font-weight: 300; }
            .font-regular { font-weight: 400;}
            .font-bold { font-weight: 700; }
            .text-immap-primary { color: #be2126; }
            .text-immap-secondary { color: #636d71; }
            .text-dark-grey{ color: #a7a9ac; }
            .text-light-grey{ color: #f0efef; }
            .text-darker-grey{ color: #414142 !important; }
            .bg-light-grey { background: #f0efef; }
            .bg-primary, .line-primary { background: #be2126 !important; }
            .bg-dark-grey, .line-dark-grey { background: #a7a9ac; }
            .text-name { font-size: 20px; }
            .text-title { font-size: 32px; }
            .text-size-md { font-size: 1.15rem;}
            .text-uppercase { text-transform: uppercase; }
            .column-padding { padding: 26px; }
            .line-dark-grey { height: 1px; display: block; vertical-align: middle; }
            .line-primary { width: 60px; height: 3px; position: absolute; top: -1px; left: 0; }
            .line-container { width: 256px; display: block; position: relative; margin-top: 1px; margin-bottom: 13px; }
            .fullwidth { width: 100% !important; }
            .flag{ width: 24px;}
            .text-contact{ width: 230px; display: inline-block; vertical-align: middle; text-decoration: none !important; overflow: hidden;}
            .box{ padding: 6px; }
            .line-height-contact{ line-height: 1; }
        </style>
    </head>
    <body>
        <div class="left-bg"></div>
        <div class="identity">
            <div class="identity-left">

                {{-- Job ID --}}
                @php
                    if (!empty($profile->profile_id)) {
                        $profileId = $profile->profile_id;
                    } else {
                        $presentJob = $profile->p11_employment_records()->where('untilNow', 1)->first();
                        if (!empty($presentJob)) {
                            $profileId = $presentJob->profile_id;
                        } else {
                            $presentJob = $profile->p11_employment_records()->orderBy('to', 'desc')->first();
                            if (!empty($presentJob)) {
                                $profileId = $presentJob->profile_id;
                            }
                        }
                    }
                @endphp
                @if(!empty($profileId))
                    <a class="current-link" href='{{$profileLink}}'><h4 class="font-light text-name text-immap-secondary">ID: {{ $profileId }}</h4></a> 
                @endif

                {{-- Job Title --}}
                @php
                    $isImmaper = ($profile->verified_immaper == 1 && $profile->is_immaper == 1 && (date('Y-m-d') <= date($profile->end_of_current_contract)) && (date('Y-m-d') >= date($profile->start_of_current_contract)) ) ? true : false;
                    $jobTitle = '';
                    if ($isImmaper && !empty($profile->job_title)) {
                        $jobTitle = $profile->job_title;
                    } else {
                        $presentJob = $profile->p11_employment_records()->where('untilNow', 1)->first();
                        if (!empty($presentJob)) {
                            $jobTitle = $presentJob->job_title;
                        } else {
                            $presentJob = $profile->p11_employment_records()->orderBy('to', 'desc')->first();
                            if (!empty($presentJob)) {
                                $jobTitle = $presentJob->job_title;
                            }
                        }
                    }
                @endphp
                @if(!empty($jobTitle))
                    <h4 class="text-immap-primary margin-top-md font-bold">{{ $jobTitle }}</h4>
                @endif
            </div>
        </div>
        <div class="detail-container">
            <div class="left-column column-padding">
                {{-- Nationality --}}
                @if(!empty($profile->present_nationalities))
                    @if(count($profile->present_nationalities))
                        @include('profile.section-title', ['fullwidth' => false, 'title' => 'Nationality'])
                        @foreach($profile->present_nationalities as $key => $nationality)
                            <div class="text-darker-grey @if((count($profile->present_nationalities) == ($key + 1))) margin-bottom-md @else margin-bottom-sm @endif">
                                <img src="{{ 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/' . $nationality->country_code . '.svg' }}" class="margin-right-sm flag"/>{{ $nationality->nationality }}
                            </div>
                        @endforeach
                        <div class="margin-bottom-md"></div>
                    @endif
                @endif

                {{-- Education --}}
                @php
                    $educationUniversities = [];
                    $presentEducation = $profile->p11_education_universities()->where('untilNow', 1)->first();
                    if (!empty($presentEducation)) {
                        $educationUniversities = $profile->p11_education_universities()->where('untilNow', 0)->orderBy('attended_to', 'desc')->get();
                        if (!empty($educationUniversities)) {
                            $educationUniversities->prepend($presentEducation);
                            $educationUniversities = $educationUniversities->all();
                        } else {
                            $educationUniversities = [$presentEducation];
                        }
                    } else {
                        $educationUniversities = $profile->p11_education_universities()->orderBy('attended_to', 'desc')->get();
                    }
                @endphp
                @if(!empty($educationUniversities))
                    @if(count($educationUniversities))
                        @include('profile.section-title', ['fullwidth' => false, 'title' => 'Education'])
                        @foreach($educationUniversities as $education)
                            <div class="font-bold text-secondary text-size-md">{{ $education->degree }}</div>
                            <div class="font-bold text-secondary text-size-md margin-bottom-sm"><span class="text-immap-primary text-size-md">{{ $education->degree_level->name . ', ' }}</span>{{ $education->name }}</div>
                            <div style="height: 1px; width: 24px;" class="bg-secondary"></div>
                            <div class="text-darker-grey margin-bottom-md">{{ date('Y', strtotime($education->attended_from)) }} - {{ date('Y', strtotime($education->attended_to)) }}</div>
                        @endforeach
                    @endif
                @endif


            </div>
            <div class="right-column column-padding" style="padding-right: 0;">
                {{-- Area of Expertise / Field of work --}}
                @if(!empty($profile->field_of_works))
                    @if(count($profile->field_of_works))
                        @include('profile.section-title', ['fullwidth' => true, 'title' => 'Area of Expertise'])
                        <div class="box bg-light-grey margin-bottom-lg margin-top-lg">
                            @foreach($profile->field_of_works as $key => $field)
                                <span class="text-darker-grey">{{ $field->field }}@if($key+1 !== count($profile->field_of_works)), @endif</span>
                            @endforeach
                        </div>
                    @endif
                @endif
                {{-- Experience --}}
                @include('profile.section-title', ['fullwidth' => true, 'title' => 'Experience', 'marginBottom' => 'margin-bottom-md'])
                <div class="margin-bottom-lg">
                    @php
                        $employmentRecords = [];
                        $presentEmployment = $profile->p11_employment_records()->where('untilNow', 1)->first();
                        if (!empty($presentEmployment)) {
                            $employmentRecords = $profile->p11_employment_records()->where('untilNow', 0)->orderBy('to', 'desc')->get();
                            if (!empty($employmentRecords)) {
                                $employmentRecords->prepend($presentEmployment);
                                $employmentRecords = $employmentRecords->all();
                            } else {
                                $employmentRecords = [$presentEmployment];
                            }
                        } else {
                            $employmentRecords = $profile->p11_employment_records()->orderBy('to', 'desc')->get();
                        }
                    @endphp
                    @foreach($employmentRecords as $employmentRecord)
                        <h4 class="font-bold text-darker-grey margin-top-sm margin-bottom-xs text-uppercase">{{ $employmentRecord->job_title }}</h4>
                        <div class="margin-bottom-xs" style="display: block;">
                            <h5 class="text-darker-grey font-bold" style="display: inline-block; max-width: 70%;">{{ $employmentRecord->employer_name}} | {{ $employmentRecord->country->name }}</h5>
                            <div class="font-light text-uppercase text-right" style="font-size: 1.15rem; display: inline-block; float: right; max-width: 30%;">
                                {{ date('M Y', strtotime($employmentRecord->from)) }} -
                                @if($employmentRecord->untilNow == 1)
                                    NOW
                                @else
                                    {{ date('M Y', strtotime($employmentRecord->to)) }}
                                @endif
                            </div>
                        </div>
                        <div class="pre-line text-dark-grey font-light margin-bottom-md"  style="line-height: 1.25">{{ $employmentRecord->job_description }}</div>
                    @endforeach
                </div>
                {{-- Skills --}}
                @if(!empty($profile->p11_skills))
                    @if(count($profile->p11_skills))
                        @include('profile.section-title', ['fullwidth' => true, 'title' => 'Skills'])
                        <div class="margin-bottom-lg">
                            <div class="container-fluid">
                                @foreach($profile->p11_skills as $key => $p11Skill)
                                    @if($key % 3 == 0)
                                        <div class="row margin-bottom-xs">
                                    @endif
                                        <div class="col-4" style="{{ ($key % 3 == 0) ? 'padding-left: 0' : '' }}">{{ $p11Skill->skill->skill }}</div>
                                    @if(($key + 1) % 3 == 0 && $key !== 0 || (($key + 1) == count($profile->p11_skills) && ($key + 1) % 3 !== 0))
                                        </div>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                    @endif
                @endif
                {{-- Language --}}
                @if(!empty($profile->p11_languages))
                    @if(count($profile->p11_languages))
                        @include('profile.section-title', ['fullwidth' => true, 'title' => 'Language'])
                        <div class="box bg-light-grey margin-bottom-lg margin-top-lg">
                            @foreach($profile->p11_languages as $key => $p11Language)
                                @php
                                    $language = ($p11Language->is_mother_tongue == 1) ? $p11Language->language->name . ' (Mother Tongue)' : $p11Language->language->name;
                                    if (($key + 1) !== count($profile->p11_languages)) {
                                        $language = $language . ', ';
                                    }
                                @endphp
                                <span class="text-darker-grey">{{ $language }}</span>
                            @endforeach
                        </div>
                    @endif
                @endif
            </div>
        </div>
    </body>
</html>