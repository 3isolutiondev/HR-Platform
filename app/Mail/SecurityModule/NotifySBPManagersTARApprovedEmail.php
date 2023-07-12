<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\TARRequest;

class NotifySBPManagersTARApprovedEmail extends Mailable
{
    use SerializesModels;

    public $status, $fullName, $tar_name, $link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(TARRequest $tar)
    {
        $this->status = $tar->status;
        $this->fullName = $tar->user->full_name;
        $this->tar_name = $tar->name;
        $this->link =  url('/travel-dashboard?date=null');
        $this->title = "[". ucfirst($tar->status) ." - " . $tar->name .'] International Travel Request';
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('mail.SecurityModule.NotifySBPManagersTARApprovedEmail');
    }
}
