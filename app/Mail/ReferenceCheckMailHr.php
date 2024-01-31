<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReferenceCheckMailHr extends Mailable
{
    use Queueable, SerializesModels;

    public $username, $profile_name, $reference_name, $title;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($username, $reference_name, $profile_name, $title)
    {
        $this->username = $username;
        $this->profile_name = $profile_name;
        $this->reference_name = $reference_name;
        $this->title = $title;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('3iSolution Reference Check Received for '.$this->title.' - '.$this->profile_name.' by '.$this->reference_name)->markdown('mail.ReferenceCheckInvitationReceptionForHr');
    }
}
