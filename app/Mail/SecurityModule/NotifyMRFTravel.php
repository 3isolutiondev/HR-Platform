<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\MRFRequest;

class NotifyMRFTravel extends Mailable
{
    use SerializesModels;

    public $mrf, $mrf_type, $fullName, $immapEmail;
    public $theme = "notifymrftravel";
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(MRFRequest $mrf)
    {
        $this->mrf = $mrf;
        $this->mrf_type = $mrf->transportation_type;
        $this->fullName = $mrf->user->full_name;
        $this->immapEmail = $mrf->user->profile->immap_email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "Domestic ";
        $subject .= ($this->mrf_type == 'air-travel') ? ' Air ' : ' Ground ';
        $subject .= "Travel Notification [$this->fullName - $this->immapEmail]";

        return $this->subject($subject)->markdown('mail.SecurityModule.NotifyMRFTravel');
    }
}
