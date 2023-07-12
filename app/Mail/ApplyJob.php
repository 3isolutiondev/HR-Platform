<?php

namespace App\Mail;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplyJob extends Mailable
{
    use Queueable, SerializesModels;

    public $job, $name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Job $job, $name)
    {
        $this->job = $job;
        $this->name = $name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Application for the '.$this->job->title.' Position')->markdown('mail.applyJob');
    }
}
