const nodemailer = require('nodemailer');

/**
 * Send an email
 * @param {string} to - recipient email
 * @param {string} subject - email sbject
 * @param {string} html - email HTML body
 */

const sendEmail = async (to, subject, html) => {
    try {
        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // My email address or email address of the company
                pass: process.env.EMAIL_PASS  // My email password or app password
            }
        });

        const mailOptions = {
            from: `"Crochet Store" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html 
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error(`Error sending email: ${err.message}`);
    }
};


module.exports = sendEmail;