<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReferenceCheckMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reference_name, $profile_name, $reference_check_link, $organization, $code, $filePath, $title;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($reference_name, $profile_name, $profile_id, $reference_questions_id, string $replyTo = '', $organization, $code, $filePath, $type='roster', $title)
    {
        $this->reference_name = $reference_name;
        $this->profile_name = $type != 'job' ? explode(' ', $profile_name)[0] : $profile_name;
        $this->organization = $organization;
        $this->filePath = $filePath;
        $this->title = $type != 'job' ? 'member of our roster' : $title;
        $this->reference_check_link = url("/reference-checks/type/".$type."/recruitment/".$profile_id.'/reference/'.$reference_questions_id.'?ref='.$code);
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
        return $this->attach($this->filePath)->subject('Reference Check for '. $this->profile_name)->markdown('mail.ReferenceCheckInvitation');
    }
}
