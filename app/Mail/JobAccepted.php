<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $job_title, $name, $hr_manager_mail;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($job_title, $name, $hr_manager_mail,$replyTo)
    {
        $this->job_title = $job_title;
        $this->name = $name;
        $this->hr_manager_mail = $hr_manager_mail;
        $this->replyTo($hr_manager_mail);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("iMMAP Contract - ".$this->job_title)->markdown('mail.jobAccepted');
    }
}
