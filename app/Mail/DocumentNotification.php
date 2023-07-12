<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

use Illuminate\Support\Facades\DB;
class DocumentNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user, $document, $file, $emailtemplate, $nbcc, $nameoffile, $download_url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $document, $nbcc, $template) {
        $this->user = $user;
        $this->document = $document;
        $this->file = $document['media_id'].'/'.$document['file_name'];
        $this->emailtemplate = $template;
        $this->nbcc = $nbcc;
        $this->nameoffile = $document['name'];
        $this->download_url = $document['download_url'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        $file = DB::table('media')->where('id', $this->document['media_id'])->first();
        $filename = $this->document['media_id'] . '/' . $file->file_name;
        $location = storage_path("app/public/".$filename);
        // $location = storage_path("app/public/$this->file");

        if($this->emailtemplate=='country') {

            return $this->subject('New iMMAP Policy : '.$this->document['name'])
                ->bcc($this->nbcc)
                ->markdown('mail.document')->attach($location);

        } else {
            return $this->subject('New iMMAP Policy : '.$this->document['name'])
                ->markdown('mail.document')->attach($location);
        }



    }
}
