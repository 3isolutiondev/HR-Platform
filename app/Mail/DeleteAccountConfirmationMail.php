<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeleteAccountConfirmationMail extends Mailable
{
    use SerializesModels;

    public $name, $email, $token, $hiddenConfirmationMail, $removeUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, string $email, string $token, bool $hiddenConfirmationMail = false)
    {
        $this->name = $name;
        $this->email = $email;
        $this->token = $token;
        $this->hiddenConfirmationMail = $hiddenConfirmationMail;
        $this->removeUrl = url('/remove-my-account/'.$token);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Delete Account Request')->markdown('mail.deleteAccountRequestConfirmation');
    }
}
