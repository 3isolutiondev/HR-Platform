<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RosterAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $profile_name, $hr_manager_email, $roster_process;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($profile_name, $hr_manager_email, $roster_process)
    {
        $this->profile_name = $profile_name;
        $this->hr_manager_email = $hr_manager_email;
        $this->roster_process = $roster_process;
        $this->replyTo($hr_manager_email);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Congratulations You're Now a Member of the ".$this->roster_process)->markdown('mail.RosterAccepted');
    }
}
