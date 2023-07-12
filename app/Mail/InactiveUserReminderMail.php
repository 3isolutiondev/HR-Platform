<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class InactiveUserReminderMail extends Mailable
{
    public $full_name;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(String $full_name)
    {
        $this->full_name = $full_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("[Action Required] Your account will be removed in four weeks")->markdown('mail.InactiveUserReminderMail');
    }
}
