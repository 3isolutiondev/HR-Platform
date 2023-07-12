<?php

namespace App\Mail;

use App\Models\Job;
use App\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $job, $profile, $url, $jobUrl, $slot;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Job $job, Profile $profile, string $replyTo = '')
    {
        $this->job = $job;
        $this->profile = $profile;
        $this->url = config('app.url');
        $this->slot = config('app.name');
        $this->jobUrl = url('/jobs/'.$job->id);
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
        return $this->subject("iMMAP Job Invitation - ".$this->job->title)->markdown('mail.invitation');
    }
}
