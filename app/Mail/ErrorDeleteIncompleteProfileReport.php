<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ErrorDeleteIncompleteProfileReport extends Mailable
{
    use SerializesModels;

    public $users;

    /**
     * Create a new message instance.
     * @param $users is Array of User data (containing id, full_name and email)
     *
     * @return void
     */
    public function __construct(array $users)
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
        return $this->subject("[Error] Delete Incomplete Profile Report Script - " . env('APP_NAME'))->markdown('mail.incompleteProfileDeletionErrorReport');
    }
}
