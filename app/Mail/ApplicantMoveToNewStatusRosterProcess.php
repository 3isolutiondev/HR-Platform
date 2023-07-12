<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplicantMoveToNewStatusRosterProcess extends Mailable
{
    use SerializesModels;

    public  $applicant, $new_status, $roster_name, $link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $applicant, string $new_status, string $roster_name, int $roster_id)
    {
        $this->applicant = $applicant;
        $this->new_status = $new_status;
        $this->roster_name = $roster_name;
        $this->link =  url('/profile?roster=' . $roster_id);
        $this->title = $roster_name . ' Recruitment Updates';
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('mail.ApplicantMoveToNewStatusRosterProcess');
    }
}
