<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CompletedProfileJobSendInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $name, $job_id, $job_title, $job_url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $job_id, $job_title, string $replyTo = '')
    {
        $this->name = $name;
        $this->job_id = $job_id;
        $this->job_title = $job_title;
        $this->job_url = url('/jobs/'.$job_id);
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
        return $this->subject("iMMAP Job Invitation - ".$this->job_title)->markdown('mail.completedprofilejobsendinvitation');
    }
}
