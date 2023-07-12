<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CompletedProfileRosterSendInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $name, $roster_id, $roster_title, $roster_url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $roster_id, $roster_title, string $replyTo = '')
    {
        $this->name = $name;
        $this->roster_id = $roster_id;
        $this->roster_title = $roster_title;
        $this->roster_url = url('/profile?roster='.$roster_id.'&invitation=true');
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
        return $this->subject("iMMAP Roster Invitation")->markdown('mail.completedprofilerostersendinvitation');
    }
}
