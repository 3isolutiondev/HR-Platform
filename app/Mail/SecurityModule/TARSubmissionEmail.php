<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\SecurityModule\TARRequest;

class TARSubmissionEmail extends Mailable
{
    use SerializesModels;

    public $submit_status, $name, $tar_name, $tar_link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $submit_status, User $user, TARRequest $tar)
    {
        $this->submit_status = $submit_status;
        $this->name = $user->full_name;
        $this->tar_name = $tar->name;
        $this->tar_link = url('int/'.$tar->id.'/view');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('[' . ucfirst($this->submit_status) . ' - ' . $this->tar_name . '] International Travel Request')->markdown('mail.SecurityModule.TARSubmissionEmail');
    }
}
