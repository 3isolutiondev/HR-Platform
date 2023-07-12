<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReferenceCheckReceptionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reference_name, $profile_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($reference_name, $profile_name, string $replyTo = '')
    {
        $this->reference_name = $reference_name;
        $this->profile_name = $profile_name;
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
        return $this->subject('Reference Check Received for '. $this->profile_name)->markdown('mail.ReferenceCheckInvitationReception');
    }
}
