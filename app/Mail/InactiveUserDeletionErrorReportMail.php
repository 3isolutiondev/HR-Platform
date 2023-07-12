<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class InactiveUserDeletionErrorReportMail extends Mailable
{
    public $users;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(array $users = [])
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
        return $this->subject("[Error] Delete Inactive Profile Script Report - " . env('APP_NAME'))->markdown('mail.InactiveUserDeletionErrorReportMail');
    }
}
