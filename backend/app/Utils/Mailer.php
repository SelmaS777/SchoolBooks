<?php

namespace App\Utils;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    public static function sendMail($to, $subject, $body): bool
    {
        $mail = new PHPMailer(true);

        try {
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            $mail->isSMTP();
            $mail->Host = env('SMTP_SERVER', 'smtp.example.com');
            $mail->SMTPAuth = true;
            $mail->Username = env('SMTP_LOGIN', 'user@example.com');
            $mail->Password = env('SMTP_PASSWORD', 'secret');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = env('SMTP_PORT', 587);

            $mail->setFrom(env('MAIL_FROM_ADDRESS', 'from@example.com'), env('MAIL_FROM_NAME', 'Mailer'));
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = '
    <html lang="">
    <head>
        <style>
            body {
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h1 {
                color: #007bff;
                font-size: 24px;
                margin-bottom: 20px;
            }
            p {
                font-size: 16px;
                line-height: 1.5;
            }
        </style><title></title>
    </head>
    <body>
        <div class="container">
            <h1>' . $subject . '</h1>
            <p>' . $body . '</p>
        </div>
    </body>
    </html>
';
            $mail->send();

            return true;

        } catch (Exception) {
            return false;
        }
    }
}
