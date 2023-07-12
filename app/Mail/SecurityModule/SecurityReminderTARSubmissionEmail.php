<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\TARRequest;

/**
 * Submitted International (tar) request Email notification for Global Security Advisor
*/
class SecurityReminderTARSubmissionEmail extends Mailable
{
    use SerializesModels;

    public $submit_status, $tar_name, $immaper, $security_page, $replyTo;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $submit_status, TARRequest $tar, string $replyTo = '')
    {
        $this->submit_status = $submit_status;
        $this->tar_name = $tar->name;
        $this->immaper = $tar->user->full_name;
        $this->security_page = url('/int/'. $tar->id .'/security/edit');
        if (!empty($replyTo)) {
            $this->replyTo($replyTo);
        }
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('New International Travel Request Submission ['.ucfirst($this->submit_status).' - '.$this->tar_name.']')->markdown('mail.SecurityModule.SecurityReminderTARSubmissionEmail');
    }
}
