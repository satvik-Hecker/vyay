export const passwordResetEmailTemplate = (resetUrl) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #18181b; color: #ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; margin: 40px auto; background-color: #27272a; border-radius: 16px; overflow: hidden;">
        <tr>
            <td style="padding: 40px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding-bottom: 32px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                                Vyay<span style="color: #a3e635;">.</span>
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 24px; text-align: center;">
                            <div style="display: inline-block; width: 64px; height: 64px; background-color: #a3e635; border-radius: 50%; line-height: 64px; text-align: center;">
                                <span style="font-size: 28px;">🔑</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 16px; text-align: center;">
                            <h2 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">
                                Reset your password
                            </h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 32px; text-align: center;">
                            <p style="margin: 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                                You requested to reset your password. Click the button below to create a new password.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 32px; text-align: center;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #a3e635; color: #18181b; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px;">
                                Reset Password
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 24px; text-align: center;">
                            <p style="margin: 0; font-size: 13px; color: #71717a; line-height: 1.6;">
                                This link expires in <strong style="color: #a1a1aa;">1 hour</strong>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; border-top: 1px solid #3f3f46; padding-top: 24px;">
                            <p style="margin: 0 0 8px; font-size: 13px; color: #71717a;">
                                If you didn't request this, you can safely ignore this email.
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #52525b;">
                                Your password won't change until you create a new one.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};
