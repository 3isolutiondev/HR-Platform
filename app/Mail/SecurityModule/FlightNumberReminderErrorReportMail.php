<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;

class FlightNumberReminderErrorReportMail extends Mailable
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
        return $this->subject("[Error] Flight Number Reminder Script Report - " . env('APP_NAME'))->markdown('mail.SecurityModule.FlightNumberReminderErrorReportMail');

    }
}
