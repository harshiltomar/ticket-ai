import nodemailer from "nodemailer";



export const sendEmail = async (to, subject, text) => {
    try {

        // Create a test account or replace with real credentials.
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


        const info = await transporter.sendMail({
            from: '"Inngest TS',
            to,
            subject,
            text,
        });

        console.log("Message sent:", info.messageId);
    } catch (error) {
        console.log("Error sending email", error);
    }
};