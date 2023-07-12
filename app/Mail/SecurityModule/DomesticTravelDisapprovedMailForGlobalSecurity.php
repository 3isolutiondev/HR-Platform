<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\SecurityModule\MRFRequest;

/**
 * Email Notification for Global Security Advisor when domestic (mrf) request disapproved
*/
class DomesticTravelDisapprovedMailForGlobalSecurity extends Mailable
{
    use SerializesModels;

    public $securityOfficer, $mrf_name, $mrf_type, $immaper, $security_page, $replyTo;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(MRFRequest $mrf, string $replyTo = '')
    {
        $this->mrf_name = $mrf->name;
        $this->mrf_type = $mrf->transportation_type;
        $this->immaper = $mrf->user->full_name;
        $this->securityOfficer = $mrf->revisions()->orderBy('id','desc')->first()->last_edit_user->full_name;
        $this->security_page = url('/dom/'. $mrf->id .'/security/view');
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
        $subject = "Domestic ";
        $subject .= ($this->mrf_type == 'air-travel') ? ' Air ' : ' Ground ';
        $subject .= 'Travel Request Disapproved ['.$this->mrf_name.']';

        return $this->subject($subject)->markdown('mail.SecurityModule.DomesticTravelDisapprovedMailForGlobalSecurity');
    }
}
