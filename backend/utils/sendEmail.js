import nodemailer from 'nodemailer';

export const sendStatusUpdateEmail = async ({
                                                to,
                                                recruiterName,
                                                recruiterEmail,
                                                applicantName,
                                                status
                                            }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const message =
            status === 'accepted'
                ? `Hi ${applicantName},

Congratulations! Your job application has been accepted by ${recruiterName}.

If you have any questions, feel free to reply to this email.

Best regards,
Job Portal Team`
                : `Hi ${applicantName},

Thank you for applying. Unfortunately, your job application has been rejected by ${recruiterName}.

We encourage you to apply for other roles in the future.

Best regards,
Job Portal Team`;

        const mailOptions = {
            from: `"Job Portal" <no-reply@yourdomain.com>`,
            to,
            subject: 'Job Application Status Update',
            text: message,
            replyTo: recruiterEmail
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
