<?php

namespace App\Mail\SecurityModule;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CheckInReminderEmail extends Mailable
{
    use SerializesModels;

    public  $name, $trip_type, $link, $trip_id, $trip_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, string $trip_type, int $trip_id, string $trip_name)
    {
        $this->name = $name;
        $this->trip_type = $trip_type;
        $this->trip_id = $trip_id;
        $this->trip_name = $trip_name;
        $this->link = $trip_type == 'DOM' ? url('/dom/' . $trip_id . '/view') : url('/int/' . $trip_id . '/view');
        $this->title = 'Check In Reminder';
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('mail.SecurityModule.CheckInReminderEmail');
    }
}
