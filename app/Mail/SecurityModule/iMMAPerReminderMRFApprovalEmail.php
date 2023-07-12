<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\MRFRequest;

/**
 * Domestic (mrf) request Approval Process Email notification for iMMAPer
 * > Approved, Disapproved, Need Revision
*/
class iMMAPerReminderMRFApprovalEmail extends Mailable
{
    use SerializesModels;

    public $status, $name, $mrf_name, $mrf_type, $link, $replyTo, $advisor, $pdf_attachement;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, MRFRequest $mrf, string $replyTo = '', object $advisor = null, $pdf)
    {
        $this->status = $mrf->status;
        $this->name = $name;
        $this->mrf_name = $mrf->name;
        $this->mrf_type = $mrf->transportation_type;
        $this->advisor = $advisor;
        $this->pdf_attachement = $pdf;
        $this->link = $mrf->status == "revision" ? url('/dom/' . $mrf->id . '/edit') : url('/dom/' . $mrf->id . '/view');

        if (!empty($replyTo)) {
            $this->replyTo($replyTo);
        }

        $subject = "";
        if ($mrf->status == "revision") { 
            $subject .= "[Needs Revision - " . $mrf->name .'] Domestic ';
        } else {
            $subject .= "[". ucfirst($mrf->status) ." - " . $mrf->name .'] Domestic ';
        }
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
        return $this->subject($this->title)->attach($this->pdf_attachement)->markdown('mail.SecurityModule.iMMAPerReminderMRFApprovalEmail');
    }
}
