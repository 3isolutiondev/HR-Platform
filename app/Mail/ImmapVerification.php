<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

class ImmapVerification extends Mailable
{
    use Queueable, SerializesModels;

    public $name, $verification_link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $user_id)
    {
        $temporarySignedURL = URL::temporarySignedRoute('verification.verify_immap_address', Carbon::now()->addMinutes(60), ['id' => $user_id]);
        $temporarySignedURL = str_replace("api/","", $temporarySignedURL);
        $this->name = $name;
        $this->verification_link = url($temporarySignedURL);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.immapVerification');
    }
}
