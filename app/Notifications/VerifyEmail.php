<?php

namespace App\Notifications;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;

class VerifyEmail extends VerifyEmailBase
{
    //    use Queueable;

    public $fullName;

    public function __construct($fullName)
    {
        $this->fullName = $fullName;
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        // $prefix = config('frontend.url') . config('frontend.email_verify_url');
        $temporarySignedURL = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            ['id' => $notifiable->getKey()]
        );

        $temporarySignedURL = str_replace("api/email/", "", $temporarySignedURL);
        // I use urlencode to pass a link to my frontend.
        // return $prefix . urlencode($temporarySignedURL);
        return url($temporarySignedURL);
    }

    public function toMail($notifiable)
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage)
            // ->from([ 'name' => 'iMMAP Career', 'address' => config('app.')])
            // ->subject('Verify Email Address')
            // ->greeting('Dear ' . $this->fullName . '!')
            // ->line('Thank you for registering on iMMAP Careers.')
            // ->line('Do not forget to complete your profile through the registration process to be able apply for our job vacancies or the iMMAP Roster.')
            // // ->line('We offer you great opportunity to work with us')
            // ->line(new HtmlString('Please verify your account by clicking on the button below and <b>complete the 11-step profile.</b>'))
            // // ->line('Please verify your account by clicking button below.')
            // ->line('We look forward to working with you soon. ')
            // ->action('Verify Email Address', $url);
            // ->salutation('Best Regards, \r\n '.config('app.name'));


            //new
            ->subject('Verify Email Address')
            ->greeting('Dear ' . $this->fullName . '!')
            ->line('Thank you for joining iMMAP Careers.')
            ->line('We offer great opportunities to join our diverse workforce.')
            ->line('Please verify your account by clicking on the button below.')
            ->action('Verify Email Address', $url)
            ->salutation(config('app.name'));
    }
}
