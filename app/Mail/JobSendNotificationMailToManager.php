<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobSendNotificationMailToManager extends Mailable
{
    use Queueable, SerializesModels;

    public $immaper, $job_title, $job_url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($job, $user)
    {
        $this->immaper = $user['full_name'];
        $this->job_title = $job->title;
        $this->job_url = url('jobs/'.$job->id.'/applicants');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->job_title.' - Recruitment')->markdown('mail.JobSendNotificationMailToManager');
    }
}
