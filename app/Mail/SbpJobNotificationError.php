<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Job;

class SbpJobNotificationError extends Mailable
{
    use SerializesModels;

    public $job, $sbpRosterName, $affectedEmails, $batchNumber;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Job $job, string $sbpRosterName = "Surge Roster", array $affectedEmails = [], int $batchNumber = 0)
    {
        $this->job = $job;
        $this->sbpRosterName = $sbpRosterName;
        $this->affectedEmails = $affectedEmails;
        $this->batchNumber = $batchNumber;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "[Error] Sending Surge Alert Notification Error for " . $this->job->title . ' [Batch - ' . ($this->batchNumber + 1) .']';
        return $this->subject($subject)->markdown('mail.SbpJobNotificationError');
    }
}
