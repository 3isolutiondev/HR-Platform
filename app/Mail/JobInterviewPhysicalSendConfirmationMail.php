<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobInterviewPhysicalSendConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $job_title, $name, $interview_date, $timezone, $skype_id, $hr_immap_email, $address, $manager;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($job_title, $name, $interview_date, $timezone, $skype_id, $hr_immap_email, 
        $address, $manager)
    {
        $this->job_title = $job_title;
        $this->name = $name;
        $this->interview_date = $interview_date;
        $this->timezone = $timezone;
        $this->skype_id = $skype_id;
        $this->hr_immap_email = $hr_immap_email;
        $this->address = $address;
        $this->manager = $manager;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Confirmation e-mail")->markdown('mail.jobinterviewphysicalsendconfirmationmail');
    }
}
