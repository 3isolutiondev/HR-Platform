<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplicantRosterRejected extends Mailable
{
    use SerializesModels;

    public $applicant_name, $roster_name;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($applicant_name, $roster_name)
    {
        $this->applicant_name = $applicant_name;
        $this->roster_name = $roster_name;
        $this->title = 'Thank you to join iMMAP ' . $roster_name . ' Selection Process';
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('mail.ApplicantRosterRejected');
    }
}
