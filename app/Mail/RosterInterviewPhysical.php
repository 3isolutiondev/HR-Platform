<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RosterInterviewPhysical extends Mailable
{
    use Queueable, SerializesModels;

    public $profile_name, $interview_date, $timezone, $skype, $hr_manager_email, $hr_manager, $interview_address;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($profile_name, $interview_date, $timezone, $skype, $hr_manager_email, $hr_manager, $interview_address, $replyTo='')
    {
        $this->profile_name = $profile_name;
        $this->interview_date = $interview_date;
        $this->timezone = $timezone;
        $this->skype = $skype;
        $this->hr_manager_email = $hr_manager_email;
        $this->hr_manager = $hr_manager;
        $this->interview_address = $interview_address;
        $this->replyTo($hr_manager_email);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Invitation to Professional Interview')->markdown('mail.interviewInvitationPhysical');
    }
}
