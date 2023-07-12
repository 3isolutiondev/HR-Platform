<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\MRFRequest;


class NotifyIMMAPerCheckInMRFEmail extends Mailable
{
    use SerializesModels;

    public $mrf_name, $mrf_type, $immaper, $travel_page;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(MRFRequest $mrf)
    {
        $this->mrf_name = $mrf->name;
        $this->mrf_type = $mrf->transportation_type;
        $this->immaper = $mrf->user->full_name;
        $this->travel_page = url('/dom/'. $mrf->id .'/View');
    }
    
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = 'Checked In Domestic ';
        $subject .= ($this->mrf_type == 'air-travel') ? ' Air ' : ' Ground ';
        $subject .= 'Travel ['.$this->mrf_name.']';

        return $this->subject($subject)->markdown('mail.SecurityModule.NotifyIMMAPerCheckInMRFEmail');
    }
}
