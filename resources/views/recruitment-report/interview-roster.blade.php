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
            color: #be2126;
        }
        .red-bar {
            padding: 4px;
            background: #be2126;
            border: 1px solid #be2126;
            border-bottom: 0;
        }
        .download-btn {
            padding: 5px;
            color: white;
            background: #be2126;
            border-radius: 3px;
            margin-top: 15px;
            text-decoration: none;
            margin-bottom: 15px;
        }
        .tr-padding-top {
            padding-top: 5px
        }
        .white-bg {
            color: #be2126;
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

        <div class="red-bar"><h1 class="title">Scoring sheet</h1></div>
        <table style="width: 100%; border-collapse: collapse; border-top: 0;border: 1px solid #be2126;padding:5px">
            <tr style="font-weight:bold;padding-top:5px; padding-bottom: 5px;">
                <td style="font-size: 14px;" class="color-red bold">Job </td>
                <td ><div style="font-size: 14px;margin-top:5px;margin-bottom: 5px">{{$jobTitle}}</div></td>
            </tr>
            <tr class="background-th" style="font-weight:bold;padding-top:5px; padding-bottom: 5px;">
                <td style="font-size: 14px;" class="color-red bold">Applicant Name </td>
                <td ><div style="font-size: 14px;margin-top:5px;margin-bottom: 5px">{{$applicant->full_name}}</div></td>
            </tr>
            <tr  style="height: 30px;">
                <td style="width: 20%;font-size:13px;"; class="color-red bold">Interview Date: </td>
                <td style="font-size:13px;"><div>{{ $interviewUser->interview_date }}</div></td>
            </tr>
        </table>
        <br>
        @foreach($reportData as $key => $report)
            <table style="width: 100%; background-color: #d3bebf; border: 1px solid #be2126;">
                <tr style="height: 30px;">
                    <td style="width: 90%;font-size:13px;" class="color-red">{{$report["manager"]["manager"]->label}}</td>
                    <td style="width: 10%;font-size:13px;">{{ $report["averageScore"] !== "No Score" ? number_format((float)$report["averageScore"], 2, '.', '')." / 5" : "No Score"}}</td>
                </tr>
            </table>
            
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #be2126; border-top: 0;">
                    @foreach($report["manager"]["score"] as $key2 => $score)
                    <tr style="padding-bottom:15px;height:30px;border-bottom:1px solid grey;">
                        <td style="width: 80%"; class="bold">
                        <p style="padding-top: 10px;padding-bottom:10px">
                            {{$score["interviewQuestion"]->question}}
                            <br />
                            <span class="color-red" style="font-weight: normal;white-space: pre-line"">{!!$score->comment!!}</span>
                        <p>
                        </td>
                        <td style="width: 20%;padding-right:10px";><p>{{$score->score ? number_format((float)$score->score, 2, '.', '').'/5':''}}</p></td>
                    </tr>
                    @endforeach
                    <tr style="padding-bottom:15px;height:30px">
                        <td style="width: 100%"; class="bold">
                            <p style="padding-top: 10px;padding-bottom:10px">
                                Global comment
                                <br />
                                <span class="color-red" style="font-weight: normal;white-space: pre-line"">{!!$report["globalComment"]!!}</span>
                            <p>
                        </td>
                        <td></td>
                    </tr>
                </table>
            @endforeach
            <br>

        <table style="width: 100%; border-collapse: collapse; border: 1px solid #be2126;">
            <tr style="font-weight:bold;padding-top:5px; padding-bottom: 5px">
                <td style="font-size: 16px;width:90%" class="color-red bold">Final score </td>
                <td colspan="3" style="width:10%; border-right: 1px solid #be2126"><div style="width:10%;font-size: 16px;margin-top:5px;margin-bottom: 5px">{{number_format((float)$finalScore, 2, '.', '')}}/5</div></td>
            </tr>
        </table>
    </body>
</html>
