<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JobRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $job_title, $name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($job_title, $name, string $replyTo = '')
    {
        $this->job_title = $job_title;
        $this->name = $name;
        if (!empty($replyTo)) {
            $this->replyTo($replyTo);
        }
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->job_title." - Recruitment closed")->markdown('mail.jobRejection');
    }
}
