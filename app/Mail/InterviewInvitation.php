<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InterviewInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $job_title, $name, $interview_date, $timezone, $skype_id, $hr_immap_email, $commentText;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($job_title, $name, $interview_date, $timezone, $skype_id, $hr_immap_email, $commentText= '')
    {
        $this->job_title = $job_title;
        $this->name = $name;
        $this->interview_date = $interview_date;
        $this->timezone = $timezone;
        $this->skype_id = $skype_id;
        $this->hr_immap_email = $hr_immap_email;
        $this->replyTo($hr_immap_email);
        $this->commentText = $commentText;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->job_title." - Interview invitation")->markdown('mail.interviewInvitation');
    }
}
