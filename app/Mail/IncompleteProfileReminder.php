<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class IncompleteProfileReminder extends Mailable
{
    use SerializesModels;

    public $full_name;

    /**
     * Create a new message instance.
     * @param $full_name is string containing full name of the user
     *
     * @return void
     */
    public function __construct(string $full_name)
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
        return $this->subject("[Action Required] Your account will be removed in four weeks")->markdown('mail.incompleteProfileReminder');
    }
}
