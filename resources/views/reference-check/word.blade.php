<html>
    <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.core.css"/>

        <style>
            @import url('https://fonts.googleapis.com/css?family=Barlow&display=swap');
            body {
                font-family: 'Barlow', sans-serif !important;
            }
            table {
                border-collapse: collapse;
            }
            td {
                border: solid 1px black;
                padding:5px;
                font-size: 14px;
            }
            
            .width-40 {
                width: 40%;
            }
            .width-50 {
                width: 50%;
            }
            .option {
                padding-right: 40px;
                padding-bottom: 5px;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="width-100"><h1 class="tor-title" style="font-weight: bold;width: 100%;display: block;text-align: center; vertical-align:top;padding: 0;margin-bottom: 20;font-size: 14pt;">CONFIDENTIAL REFERENCE CHECK</h1></div>
        <table class="width-100 org-container">
            <tr><td class="width-50 color-red bold" style="color:#000000">Name Of Candidate: </td><td class="width-40"><div>{{$user->full_name}}</div></td></tr>
            @if($type !== 'job')
            <tr><td class="width-50 color-red bold" style="color:#000000">Applied Position: </td><td class="width-40"><div>{{$roster_process->name}}</div></td></tr>
            @else
            <tr><td class="width-50 color-red bold" style="color:#000000">Applied Position: </td><td class="width-40"><div>{{$job->title}}</div></td></tr>
            @endif
            <tr><td class="width-50 color-red bold" style="color:#000000">Name of referee: </td><td class="width-40"><div>{{$reference->full_name}}</div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Current referee’s position: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Current referee’s organization: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Referee’s position when s/he met the candidate: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Referee’s organization when s/he met the candidate: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Candidate’s position when s/he met the referee: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Dates you have known candidate: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Working relationship to candidate: </td><td class="width-40"><div>
                <span class="option">Supervisor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Friend&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Colleague&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Employee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Other (please specify)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div></td>
            </tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Rate his/her level of performance with your organization: </td><td class="width-40"><div>
                <span class="option">Excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Very Good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Personal strengths: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Areas which need improvement/development: </td><td class="width-40"><div></div></td></tr> 
            <tr><td class="width-50 color-red bold" style="color:#000000">Mode of separation from your organization: </td><td class="width-40"><div>
                <span class="option">Resignation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Termination&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Dismissal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Post abolishment (lay-off)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Other (please specify)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">Project finalized (End of contract)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div></td></tr> 
            <tr><td class="width-50 color-red bold" style="color:#000000">Do you believe s/he upholds the principles of non-discrimination and gender equality? </td><td class="width-40"><div>
                <span class="option">Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">How well did s/he get along with colleagues, managers and clients with respect to resolving interpersonal conflicts in the workplace and working with a diverse workforce?: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Describe his ability to prioritize work and how is s/he in handling tight deadlines, problem-solving and competing priorities: </td><td class="width-40"><div></div></td></tr>
            
            <tr><td class="width-50 color-red bold" style="color:#000000">How independently does s/he work and what is his/her ability to handle multiple tasks simultaneously?: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">What style of supervision have you found to be most effective and how well does s/he receive feedback?: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">How effectively does s/he manage relationships with government officials and other partners?: </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Describe her/his ability to conceptualize, plan and execute ideas, as well as impart knowledge and teach skills?  : </td><td class="width-40"><div></div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Are you aware of any transgressions of your PSEA policy, Code of Conduct or Prevention from human trafficking policy by him/her?: </td><td class="width-40"><div>
                <span class="option">Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Temperament: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Analytical skills: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Negotiation skills: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Confidentiality: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Dependability: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Integrity: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Leadership: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Commitment: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Drive for results: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Embracing diversity: </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Teamwork </td><td class="width-40"><div>
                <span class="option">excellent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">very good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">good&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">fair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">poor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Would you re-hire this candidate again if given the opportunity? </td><td class="width-40"><div></div>
                <span class="option">Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </td></tr>
            <tr><td class="width-50 color-red bold" style="color:#000000">Is there anything else that you would like to add or believe that we should know about this candidate? </td><td class="width-40"><div>
                <span class="option">Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;">Comments:</span>
            </div></td></tr>
            <tr>
                @if($type !== 'job')
                <td class="width-50 color-red bold" style="color:#000000"> Would you consider candidate for a {{$roster_process->name}} position?</td>
                @else
                <td class="width-50 color-red bold" style="color:#000000"> Would you consider candidate for a {{$job->title}} position?</td>
                @endif
                <td class="width-40"><div>
                <span class="option">Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="option">No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br/><span style="display: block;margin-top: 5px;font-size:14px">Comments:</span>
            </div></td></tr>
            
        </table>
        <div class="no-text width-100 margin-bottom-4"> 
            <br />
            Thank you very much for your contribution.  Rest assured all the information you have provided will remain confidential. 
        </div>
    </div>
       
    </body>
</html>
