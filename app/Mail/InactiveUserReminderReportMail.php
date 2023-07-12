<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class InactiveUserReminderReportMail extends Mailable
{
    public $users;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Array $users = [])
    {
        $this->users = $users;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Inactive User Reminder Script Report - " . env('APP_NAME'))->markdown('mail.InactiveUserReminderReportMail');
    }
}
