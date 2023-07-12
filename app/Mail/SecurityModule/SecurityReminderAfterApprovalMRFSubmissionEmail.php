<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\MRFRequest;

/**
 * Submitted Domestic (mrf) request after approval Email notification for Domestic Security Officer
*/
class SecurityReminderAfterApprovalMRFSubmissionEmail extends Mailable
{
    use SerializesModels;

    public $submit_status, $mrf_name, $mrf_type, $country, $immaper, $security_page, $replyTo;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $submit_status, MRFRequest $mrf, string $replyTo = '')
    {
        $this->submit_status = $submit_status;
        $this->mrf_name = $mrf->name;
        $this->mrf_type = $mrf->transportation_type;
        $this->country = $mrf->country->name;
        $this->immaper = $mrf->user->full_name;
        $this->security_page = url('/dom/'. $mrf->id .'/security/edit');
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
        $subject = 'Domestic ';
        $subject .= ($this->mrf_type == 'air-travel') ? ' Air ' : ' Ground ';
        $subject .= 'Travel Request Resubmission after approval ['.ucfirst($this->submit_status).' - '.$this->mrf_name.']';

        return $this->subject($subject)->markdown('mail.SecurityModule.SecurityReminderAfterApprovalMRFSubmissionEmail');
    }
}
