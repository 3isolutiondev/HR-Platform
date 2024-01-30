<html>
    <head>
        <meta charset="UTF-8" />

        <style>
        body {
            font-family: 'Barlow', sans-serif !important;

        }
        .title {
            color: white;
            font-weight: bold;
            width: 100%;
            display: block;
            text-align: center;
                vertical-align:top;
            padding: 0;
            margin: 0;
            font-size: 14pt;
                /*height: 4mm;*/
        }
        .sub-title {
            color: white;
            font-weight:normal;
            width: 100%;
            display: block;
            text-align: center;
            vertical-align:top;
            padding: 0;
            margin: 0;
            font-size: 10pt;

        }
        td{
            font-size: 9pt;
            border: none;
            margin: 0px
        }
        .color-red {
            color: #043C6E;
        }
        .red-bar {
            padding: 4px;
            background: #043C6E;
            border: 1px solid #043C6E;
            border-bottom: 0;
        }
        .download-btn {
            padding: 5px;
            color: white;
            background: #043C6E;
            border-radius: 3px;
            margin-top: 15px;
            text-decoration: none;
            margin-bottom: 15px;
        }
        .tr-padding-top {
            padding-top: 5px
        }
        .white-bg {
            color: #043C6E;
            background: white;
            font-size: 12px;

        }
        .inline-display {
            display: inline-block;

        }
        .background-th {
            background-color:#ececec
        }
        .background-th td {
            margin: 0px
            border: none;
        }
        .eachStatusInfo {
            width: 25%;
            font-size: 12px;

        }
        </style>
    </head>
    <body>

        <div class="red-bar"><h1 class="title">Recruitment Report</h1></div>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #043C6E; border-top: 0;">
            <tr style="font-weight:bold;padding-top:5px; padding-bottom: 5px">
                <td style="font-size: 16px;" class="color-red bold">Job Title: </td>
                <td colspan="3"><div style="font-size: 16px;margin-top:5px;margin-bottom: 5px">{{ $job->title }}</div></td>
            </tr>
            <tr class="background-th" style="height: 30px;">
                <td style="width: 20%"; class="color-red bold">Opening Date: </td>
                <td><div>{{ $job->opening_date }}</div></td>
                <td class="color-red bold">Closing Date: </td>
                <td><div>{{ $job->closing_date }}</div></td>
            </tr>
            <tr style="height: 30px;">
                <td class="color-red bold">Duty Station: </td>
                <td><div>{{ $job->tor->duty_station }}</div></td>
                <td class="color-red bold">Country: </td>
                <td><div>{{ $job->country->name }}</div></td>
            </tr>
            <tr class="background-th" style="height: 30px;">
                <td class="color-red bold">Contract Start: </td>
                <td><div>{{ $job->contract_start }}</div></td>
                <td class="color-red bold">Contract End: </td>
                <td><div>{{ $job->contract_end }}</div></td>
            </tr>
            <tr style="height: 30px;">
                <td class="color-red bold">Number of Applicants: </td>
                <td colspan="3"><div>{{ $number_of_applicant }}</div></td>
            </tr>
            @if(!empty($job_manager))
            <tr class="background-th" style="height: 30px;">
                <td class="color-red bold">Hiring Manager: </td>
                <td colspan="3"><div>{{ $job_manager }}</div></td>
            </tr>
            @endif
        </table>
        <br>
        @foreach($reportData as $key => $report)
            @php
                $statusName = ($sbpJob) ? $report['jobStatus']->status_under_sbp_program : $report['jobStatus']->status;
            @endphp
            <div class="red-bar">
                <h5 class="sub-title">List of {{ $statusName }}</h5>
            </div>
            <table style="width: 100%; background-color: #d3bebf; border: 1px solid #043C6E; border-top: 0;">
                <tr style="height: 30px;">
                    <td style="width: 27%;" class="color-red">Number of Applicants ({{ $statusName }}) : {{ $report['total'] }}</td>
                    @if(!empty($report['zippedCVs']))
                    <td style="width: 73%; text-align: right;"><a href="{{ $report['zippedCVs'] }}" class="download-btn" >Download All CVs </a></td>
                    @endif
                </tr>
            </table>
            @foreach($report['listApplicant'] as $key => $applicant)
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #043C6E; border-top: 0;">
                    <tr style="height: 30px;">
                        <td style="width: 15%"; class="color-red bold">Name: </td>
                        <td style="width: 35%";><div>{{ $applicant->full_name }}</div></td>
                        <td style="width: 15%"; class="color-red bold">Diploma: </td>
                        <td style="width: 35%";><div>{{ $applicant->profile->latest_degree }}</div></td>
                    </tr>
                    @php
                        $rowCount = !empty($applicant->cv) ? 1 : 0;
                        if ($report['jobStatus']->is_interview == 1 && !$sbpJob) {
                            $rowCount = $rowCount + 2;
                            if (!empty($applicant->user_interview_files)) {
                                $rowCount = $rowCount + 1;
                            }
                        }
                    @endphp
                    @if(!empty($applicant->cv))
                        <tr class="background-th" style="height: 30px">
                            <td style="width: 15%"; class="color-red bold">Email :</td>
                            <td style="width: 35%"; class="color-red bold">{{ $applicant->email }}</td>
                            <td style="width: 15%"; class="color-red bold">CV :</td>
                            <td style="width: 35%"; class="color-red bold tr-padding-top"><a href="{{ $applicant->cv }}" class="download-btn" >Download CV </a> </td>
                        </tr>
                    @endif
                    @if($report['jobStatus']->is_interview == 1 && !$sbpJob)
                        <tr @if(empty($applicant->cv)) class="background-th" @endif  style="height: 30px;">
                            <td style="width: 15%"; class="color-red bold">Timezone: </td>
                            <td style="width: 35%";><div>{{ $applicant->pivot->timezone }}</div></td>
                            <td style="width: 15%"; class="color-red bold">Interview Date & Time: </td>
                            <td style="width: 35%";><div>{{ $applicant->pivot->interview_date }}</div></td>
                        </tr>
                        @if($applicant->pivot->interview_type !=0)
                        <tr @if(!empty($applicant->cv)) class="background-th" @endif  style="height: 30px;">
                            <td style="width: 15%"; class="color-red bold">Physical Interview ?: </td>
                            <td style="width: 35%";><div>Yes</div></td>
                            <td style="width: 15%";class="color-red bold">Address: </td>
                            <td style="width: 35%";><div>{{ $applicant->pivot->interview_address }}</div></td>
                        </tr>
                        @endif
                        @if($applicant->pivot->interview_type == 0)
                        <tr @if(!empty($applicant->cv)) class="background-th" @endif style="height: 32px">
                            <td style="width: 15%"; class="color-red bold">Skype ID: </td>
                            <td style="width: 85%"; colspan="3"><div>{{ $applicant->pivot->skype_id }}</div></td>
                        </tr>
                        @endif
                        @if(!empty($applicant->user_interview_files))
                            <tr @if(empty($applicant->cv)) class="background-th" @endif style="height: 32px">
                                <td style="width: 15%"; class="color-red bold">Interview Results :</td>
                                <td style="width: 85%"; colspan="3" class="color-red bold tr-padding-top">
                                @foreach($applicant->user_interview_files as $interview_file)
                                    <a href="{{$interview_file->download_url}}" class="download-btn" >Download CV </a>
                                @endforeach
                                </td>
                            </tr>
                        @endif
                    @endif
                    @if(isset($applicant->pivot->final_interview_score))
                            <tr @if(empty($applicant->cv)) class="background-th" @endif style="height: 32px">
                                <td style="width: 15%"; class="color-red bold">Interview Final Score :</td>
                                <td style="width: 40%"; class="color-red bold tr-padding-top">
                                 {{number_format((float)$applicant->pivot->final_interview_score, 2, '.', '')}}/5
                                </td>
                                <td style="width: 45%"; colspan="2" class="color-red bold tr-padding-top">
                                    <a href="{{$applicant->scoring_sheet}}" class="download-btn" >Download scoring sheet </a>
                                </td>
                            </tr>

                    @endif
                </table>
            @endforeach
            <br>
        @endforeach
    </body>
</html>
