import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured. Skipping email send.');
        return;
    }

    try {
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        });
        console.log('Resend response:', result);
        return result;
    } catch (error) {
        console.error('Resend error:', error);
        throw error;
    }
};

export default sendEmail;
