<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;

class CheckInReminderReportEmail extends Mailable
{
    public $trips;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(array $trips = [])
    {
        $this->trips = $trips;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("[Success] Check In Reminder Script Report - " . env('APP_NAME'))->markdown('mail.SecurityModule.CheckInReminderReportEmail');
    }
}
