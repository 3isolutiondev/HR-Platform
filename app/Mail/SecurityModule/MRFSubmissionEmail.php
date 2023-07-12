<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\SecurityModule\MRFRequest;

class MRFSubmissionEmail extends Mailable
{
    use SerializesModels;

    public $submit_status, $name, $mrf_name, $mrf_type, $mrf_link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $submit_status, User $user, MRFRequest $mrf)
    {
        $this->submit_status = $submit_status;
        $this->name = $user->full_name;
        $this->mrf_name = $mrf->name;
        $this->mrf_type = $mrf->transportation_type;
        $this->mrf_link = url('dom/'.$mrf->id.'/view');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = '[' . ucfirst($this->submit_status) . ' - ' . $this->mrf_name . '] Domestic ';
        $subject .= ($this->mrf_type == 'air-travel') ? ' Air ' : ' Ground ';
        $subject .= "Travel Request";

        return $this->subject($subject)->markdown('mail.SecurityModule.MRFSubmissionEmail');
    }
}
