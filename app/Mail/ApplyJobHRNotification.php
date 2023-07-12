<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplyJobHRNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $hr_manager_name, $job_title, $user_name, $profile_id, $profile_link, $user_email, $tor_id, $tor_link;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($hr_manager_name, $job_title, $user_name, $profile_id, $user_email, $tor_id)
    {
        $this->hr_manager_name = $hr_manager_name;
        $this->job_title = $job_title;
        $this->user_name = $user_name;
        $this->profile_id = $profile_id;
        $this->profile_link = url('profile/'.$profile_id);
        $this->user_email = $user_email;
        $this->tor_link = url('tor/'.$tor_id.'/edit');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Apply Job HR Notification')->markdown('mail.applyJobHRNotification');
    }
}
