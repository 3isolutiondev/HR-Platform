<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BackupSuccess extends Mailable
{
    use SerializesModels;

    public $dbSize, $backupSize;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $dbSize, string $backupSize)
    {
        $this->dbSize = $dbSize;
        $this->backupSize = $backupSize;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("[Backup Success] - " . env('APP_NAME'))->markdown('mail.BackupSuccess');
    }
}
