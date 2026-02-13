const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendNotificationEmail = async (to, subject, text, html) => {
    try {
        if (!process.env.EMAIL_USER) {
            console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
            return;
        }

        const info = await transporter.sendMail({
            from: `"MediLink Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log('Message sent: %s', info.messageId);
    } catch (err) {
        logger.error('Email Delivery Failed:', err);
    }
};
