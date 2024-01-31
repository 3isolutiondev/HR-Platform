<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class IMTestInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $profile_name, $im_test_submit_date, $im_test_timezone, $im_test_link, $im_test_id;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($profile_name, $im_test_submit_date, $im_test_timezone, $im_test_id, string $replyTo = '')
    {
        $this->profile_name = $profile_name;
        $this->im_test_submit_date = $im_test_submit_date;
        $this->im_test_timezone = $im_test_timezone;
        $this->im_test_link = url('/im-test/'.$im_test_id);
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
        return $this->subject('Invitation to the 3iSolution Information Management Test')->markdown('mail.IMTestInvitation');
    }
}
