<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SkypeInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $roster_process, $profile_name, $skype_date, $skype_timezone, $skype_id, $hr_manager,$roster_step, $under_sbp_program;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($roster_process, $profile_name, $skype_date, $skype_timezone, $skype_id, $hr_manager, $roster_step, bool $under_sbp_program, $replyTo='')
    {
        $this->roster_process = $roster_process;
        $this->profile_name = $profile_name;
        $this->skype_date = $skype_date;
        $this->skype_timezone = $skype_timezone;
        $this->skype_id = $skype_id;
        $this->hr_manager = $hr_manager;
        $this->roster_step = $roster_step;
        $this->under_sbp_program = $under_sbp_program;
        $this->replyTo($hr_manager->immap_email);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if($this->roster_step->slug == '3-heads-questions' && $this->under_sbp_program){
            return $this->subject('iMMAP '.$this->roster_process.' - Pre-interview invitation')->markdown('mail.skypeInvitation');
        }
        return $this->subject('Application to the '.$this->roster_process)->markdown('mail.skypeInvitation');
    }
}
