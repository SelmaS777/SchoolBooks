<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 4px; 
            margin: 20px 0;
        }
        .footer { font-size: 12px; color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You are receiving this email because we received a password reset request for your SchoolBooks account.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Reset Token:</strong> <code style="background-color: #e9ecef; padding: 2px 4px; border-radius: 3px;">{{ $token }}</code></p>
                <p><strong>Email:</strong> {{ $email }}</p>
            </div>
            
            <p>Use the above token and email to reset your password through the API.</p>
            
            <p>If you did not request a password reset, no further action is required.</p>
            
            <div class="footer">
                <p>⏰ This password reset token will expire in 60 minutes.</p>
                <p>If you're having trouble, please contact our support team.</p>
                <p>© {{ date('Y') }} SchoolBooks </p>
            </div>
        </div>
    </div>
</body>
</html>