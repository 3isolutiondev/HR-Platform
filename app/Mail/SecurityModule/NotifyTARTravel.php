<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\TARRequest;

class NotifyTARTravel extends Mailable
{
    use SerializesModels;

    public $tar, $fullName, $immapEmail;
    public $theme = "notifytartravel";

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(TARRequest $tar)
    {
        $this->tar = $tar;
        $this->fullName = $tar->user->full_name;
        $this->immapEmail = $tar->user->profile->immap_email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('International Travel Notification ['.$this->fullName.' - '.$this->immapEmail.']')->markdown('mail.SecurityModule.NotifyTARTravel');
    }
}
