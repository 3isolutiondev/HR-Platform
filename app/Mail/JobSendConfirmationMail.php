<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobSendConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name, $job_id, $job_title, $job_url, $manager;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $job_id, $job_title, $manager)
    {
        $this->name = $name;
        $this->job_id = $job_id;
        $this->job_title = $job_title;
        $this->job_url = url('/jobs/'.$job_id);
        $this->manager = $manager;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->name.' '.$this->job_title. " - Confirmation")->markdown('mail.jobsendconfirmationmail');
    }
}
