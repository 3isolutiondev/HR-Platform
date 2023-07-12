<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Job;
use App\Models\Roster\RosterProcess;
use App\Console\Commands\MoveToRosterRecruitment\DuplicateReport;

class RosterMoverDuplicateReport extends Mailable
{
    use SerializesModels;

    public $job, $roster, $applicantData, $rejectedOnBoth;

    /**
     * Create a new message instance.
     *
     * @param Job $job
     * @param RosterProcess $roster
     * @param DuplicateReport[] $applicantData
     * @param DuplicateReport[] $rejectedOnBoth
     *
     * @return void
     */
    public function __construct(Job $job, RosterProcess $roster, array $applicantData, array $rejectedOnBoth)
    {
        $this->job = $job;
        $this->roster = $roster;
        $this->applicantData = $applicantData;
        $this->rejectedOnBoth = $rejectedOnBoth;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Job Applicants to Roster Recruitment Campaign Duplication Report - " . env('APP_NAME'))->markdown('mail.RosterMoverDuplicateMail');
    }
}
