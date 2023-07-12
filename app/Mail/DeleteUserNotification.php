<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeleteUserNotification extends Mailable
{
    use SerializesModels;

    public $name, $registrationUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name)
    {
        $this->name = $name;
        $this->registrationUrl = env('APP_URL') . '/register';
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Account Deletion on iMMAP Careers')->markdown('mail.deleteUserNotification');
    }
}
