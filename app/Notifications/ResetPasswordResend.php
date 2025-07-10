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
        
        $userName = $notifiable->name;
        $currentDate = date('d F Y');
        $currentYear = date('Y');
        $expiryMinutes = config('auth.passwords.users.expire');
        
        $htmlContent = '
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset Kata Sandi - Antika Studio</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:\'Poppins\',sans-serif;font-size:14px;color:#1e293b;">
            <div style="max-width:680px;margin:0 auto;background-color:#ffffff;">
                <div style="background:linear-gradient(135deg,#2dd4bf,#0d9488);padding:24px 30px;border-bottom-left-radius:40px;border-bottom-right-radius:40px;text-align:left;color:white;">
                    <table width="100%">
                        <tr>
                            <td align="left">
                                <img src="https://res.cloudinary.com/do1oxpnak/image/upload/v1751893797/logo_qmmoal.png" height="38" alt="Antika Studio Logo" />
                            </td>
                            <td align="right" style="font-size:14px;color:#ffffff;">
                                ' . $currentDate . '
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="max-width:600px;margin:40px auto;padding:40px 30px;text-align:center;">
                    <h2 style="margin:0;font-size:22px;font-weight:600;color:#1e293b;">Reset Kata Sandi Anda</h2>
                    <p style="margin-top:18px;color:#1e293b;">Halo ' . $userName . ',</p>
                    <p style="margin-top:16px;font-weight:400;color:#64748b;line-height:1.6;">
                        Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Silakan klik tombol di bawah ini untuk melanjutkan.
                    </p>
                    <div style="margin:30px 0;">
                        <a href="' . $resetUrl . '" target="_blank" style="background:linear-gradient(135deg,#2dd4bf,#0d9488);color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;font-size:16px;">
                            Reset Kata Sandi
                        </a>
                    </div>
                    <p style="font-weight:400;color:#64748b;line-height:1.6;">
                        Tautan ini hanya berlaku selama <strong style="color:#0d9488;">' . $expiryMinutes . ' menit</strong>. Jika Anda tidak merasa meminta ini, Anda bisa mengabaikan email ini dengan aman.
                    </p>
                </div>
                <div style="max-width:480px;margin:40px auto 0;text-align:center;border-top:1px solid #e2e8f0;padding:30px 20px;">
                    <p style="font-size:16px;font-weight:500;margin-top:0;margin-bottom:8px;color:#1e293b;">Antika Studio</p>
                    <p style="margin:0;color:#64748b;">Jl. Intan 1, RT.04/RW.01, Cidokom, Kec. Gn. Sindur, Kabupaten Bogor, Jawa Barat 16330</p>
                    <div style="margin-top:16px;">
                        <a href="https://www.instagram.com/antika.selfphotostudio" target="_blank" style="margin-left:10px;"><img width="28" src="https://res.cloudinary.com/do1oxpnak/image/upload/v1750925333/icons8-instagram-96_jqql1o.png" alt="Instagram" /></a>
                        <a href="https://www.tiktok.com/@antika.selfphotostudio" target="_blank" style="margin-left:10px;"><img width="28" src="https://res.cloudinary.com/do1oxpnak/image/upload/v1750925335/icons8-tiktok-96_wywn6i.png" alt="TikTok" /></a>
                    </div>
                    <p style="margin-top:20px;font-size:12px;color:#64748b;">&copy; ' . $currentYear . ' Antika Studio. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.resend.key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from'    => config('mail.from.address'),
            'to'      => $this->email,
            'subject' => 'Reset Password Anda',
            'html'    => $htmlContent,
        ]);

        if ($response->failed()) {
            Log::error('Resend API email failed:', ['status' => $response->status(), 'response' => $response->json()]); //
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