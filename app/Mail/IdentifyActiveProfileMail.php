<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class IdentifyActiveProfileMail extends Mailable
{
    use SerializesModels;

    public $affectedUsers;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($affectedUsers)
    {
        $this->affectedUsers = $affectedUsers;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Profile Track Status Script Report - " . env('APP_NAME'))->markdown('mail.ProfileTrackStatusMail');
    }
}
