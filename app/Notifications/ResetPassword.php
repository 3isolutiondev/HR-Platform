<?php

namespace App\Notifications;

// use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
// use Illuminate\Auth\Notifications\ResetPassword as NotificationResetPassword;
use Illuminate\Support\HtmlString;

class ResetPassword extends Notification
{
    // use Queueable;

    protected $token;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($token)
    {
        // parent::__construct($notifiable);
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    protected function resetUrl($notifiable)
    {
        $temporarySignedURL = URL::temporarySignedRoute(
            'password.reset',
            Carbon::now()->addMinutes(60),
            ['token' => $this->token]
        );

        $temporarySignedURL = str_replace("api/reset-password-form", "reset-password-form", $temporarySignedURL);

        return $temporarySignedURL;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        // dd($notifiable);

        $url = $this->resetUrl($notifiable);

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->greeting('Hello,')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $url)
            ->line(new HtmlString('<p>The above link is valid during 1 hour. After this period, you will need to request another link via the reset password page: <a href="https://careers.immap.org/reset-password">iMMAP Careers</a>.</p>'))
            ->line('If you did not request a password reset, no further action is required.');
        // ->line('Please verify your account by clicking button below.')''
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
