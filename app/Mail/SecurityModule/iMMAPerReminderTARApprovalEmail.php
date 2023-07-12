<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\TARRequest;

/**
 * International Travel (tar) request Approval Process Email notification for iMMAPer
 * > Approved, Disapproved, Need Revision
*/
class iMMAPerReminderTARApprovalEmail extends Mailable
{
    use SerializesModels;

    public $status, $name, $tar_name, $link, $replyTo, $pdf_attachement;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, TARRequest $tar, string $replyTo = '', $pdf)
    {
        $this->status = $tar->status;
        $this->name = $name;
        $this->tar_name = $tar->name;
        $this->pdf_attachement = $pdf;
        $this->link = $tar->status == "revision" ? url('/int/' . $tar->id . '/edit') : url('/int/' . $tar->id . '/view');
        $this->title = $tar->status == "revision" ? "[Needs Revision - " . $tar->name .'] International Travel Request' :  "[". ucfirst($tar->status) ." - " . $tar->name .'] International Travel Request';
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
        return $this->subject($this->title)->attach($this->pdf_attachement)->markdown('mail.SecurityModule.iMMAPerReminderTARApprovalEmail');
    }
}
