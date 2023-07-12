<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class DeleteHiddenUserReportMail extends Mailable
{
    use SerializesModels;

    public $users, $usersCount;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(array $users)
    {
        $this->users = $users;
        $this->usersCount = count($users);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Delete Hidden User Report Script - " . env('APP_NAME'))->markdown('mail.DeleteHiddenUserReportMail');
    }
}
