<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ResetPasswordResend extends Notification
{
    use Queueable;

    public $token;
    public static $createUrlCallback;
    public $email;

    /**
     * Create a new notification instance.
     *
     * @param string $token
     * @param string $email
     * @return void
     */
    public function __construct(string $token, string $email)
    {
        $this->token = $token;
        $this->email = $email;
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

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $resetUrl = call_user_func(static::$createUrlCallback, $notifiable, $this->token);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.resend.key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from'    => config('mail.from.address'),
            'to'      => $this->email,
            'subject' => 'Reset Password Anda',
            'html'    => '<p>Silakan klik link berikut untuk mereset password Anda: <a href="' . $resetUrl . '">Reset Password</a></p><p>Link ini akan kedaluwarsa dalam ' . config('auth.passwords.users.expire') . ' menit.</p>',
        ]);

        if ($response->failed()) {
            Log::error('Resend API email failed:', ['status' => $response->status(), 'response' => $response->json()]); // <-- Gunakan Log tanpa '\'
        }

        return (new MailMessage)
                    ->subject('Reset Password Anda')
                    ->line('Silakan klik tombol di bawah untuk mereset password Anda.')
                    ->action('Reset Password', $resetUrl)
                    ->line('Link ini akan kedaluwarsa dalam ' . config('auth.passwords.users.expire') . ' menit.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  object  $notifiable
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    /**
     * Set a callback that should be used to create the password reset URL.
     *
     * @param  \Closure  $callback
     * @return void
     */
    public static function createUrlUsing(\Closure $callback)
    {
        static::$createUrlCallback = $callback;
    }
}