<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Sendmailtemplate extends Mailable
{
    use Queueable, SerializesModels;

    public $content, $data, $ke;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data, $ke)
    {
        $this->content = $data['body'];
        $this->data = $data;
        $this->ke = $ke;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
            $cc=Array();
            $nbcc=Array();

            if(!empty($this->data['cc'])) {
                foreach($this->data['cc'] as $dccx) {
                    array_push($cc,$dccx);
                }
            }

            if(!empty($this->data['bcc'])) {
                foreach($this->data['bcc'] as $databcc) {
                    array_push($nbcc, $databcc);
                }
            }

            if(count($cc)>0 && count($nbcc)>0) {

                return $this->subject($this->data['subject'])
                    ->cc($cc)
                    ->bcc($nbcc)
                    ->markdown('mail.Sendmail');

            } else if(count($cc)>0) {

                return $this->subject($this->data['subject'])
                    ->cc($cc)
                    ->markdown('mail.Sendmail');

            } else if(count($nbcc)>0) {

                return $this->subject($this->data['subject'])
                    ->bcc($nbcc)
                    ->markdown('mail.Sendmail');

            } else {
                return $this->subject($this->data['subject'])
                    ->markdown('mail.Sendmail');
            }

    }
}
