<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class RemoveAccountHiddenFailedMail extends Mailable
{
    use SerializesModels;

    public $oldUserData;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $oldUserData)
    {
        $this->oldUserData = $oldUserData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Remove Account Failed for Hidden User - ' . env('APP_NAME'))->markdown('mail.RemoveAccountHiddenFailedMail');
    }
}
