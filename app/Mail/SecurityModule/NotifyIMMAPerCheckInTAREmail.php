<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\TARRequest;

class NotifyIMMAPerCheckInTAREmail extends Mailable
{  
    use SerializesModels;

    public $tar_name, $immaper, $travel_page;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(TARRequest $tar)
    {
        $this->tar_name = $tar->name;
        $this->immaper = $tar->user->full_name;
        $this->travel_page = url('/int/'. $tar->id .'/view');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Checked in International Travel ['.$this->tar_name.']')->markdown('mail.SecurityModule.NotifyIMMAPerCheckInTAREmail');
    }
}
