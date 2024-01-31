<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RosterInterviewInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $profile_name, $interview_date, $timezone, $skype, $hr_manager_email, $hr_manager, $hr_job_title, $roster_process_name, $commentText;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($profile_name, $interview_date, $timezone, $skype, $hr_manager_email, $hr_manager, $hr_job_title, $roster_process, $commentText)
    {
        $this->profile_name = $profile_name;
        $this->interview_date = $interview_date;
        $this->timezone = $timezone;
        $this->skype = $skype;
        $this->hr_manager_email = $hr_manager_email;
        $this->hr_manager = $hr_manager;
        $this->hr_job_title = $hr_job_title;
        $this->roster_process_name = $roster_process->name;
        $this->replyTo($hr_manager_email);
        $this->commentText = $commentText;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if(strpos($this->roster_process_name, 'iMMAP') === false) $this->roster_process_name = '3iSolution '.$this->roster_process_name;
        return $this->subject($this->roster_process_name.' - Interview invitation')->markdown('mail.RosterInterviewInvitation');
    }
}
