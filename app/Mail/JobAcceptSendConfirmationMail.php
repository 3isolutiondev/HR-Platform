<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobAcceptSendConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $job_title, $name, $hr_manager_mail, $manager;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($job_title, $name, $hr_manager_mail, $manager)
    {
        $this->job_title = $job_title;
        $this->name = $name;
        $this->hr_manager_mail = $hr_manager_mail;
        $this->manager = $manager;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->job_title." - Confirmation")->markdown('mail.jobacceptsendconfirmationmail');
    }
}
