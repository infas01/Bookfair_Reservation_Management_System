const nodemailer = require('nodemailer');

function createTransport() {
  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST is not configured for notification-service');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

const transporter = createTransport();
const fromAddress =
  process.env.MAIL_FROM || 'Colombo Bookfair <infas1002@gmail.com>';

module.exports = {
  transporter,
  fromAddress,
};
