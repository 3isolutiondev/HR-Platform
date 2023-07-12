<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\MRFRequest;

class NotifySBPManagersMRFApprovedEmail extends Mailable
{
    use SerializesModels;

    public $status, $fullName, $mrf_name, $mrf_type, $link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(MRFRequest $mrf)
    {
        $this->status = $mrf->status;
        $this->fullName = $mrf->user->full_name;
        $this->mrf_name = $mrf->name;
        $this->mrf_type = $mrf->transportation_type;
        $this->link =  url('/travel-dashboard?date=null');

        $subject = "[". ucfirst($mrf->status) ." - " . $mrf->name .'] Domestic ';
        $subject .= ($this->mrf_type == 'air-travel') ? ' Air ' : ' Ground ';
        $subject .= "Travel Request";
        $this->title = $subject;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('mail.SecurityModule.NotifySBPManagersMRFApprovedEmail');
    }
}
