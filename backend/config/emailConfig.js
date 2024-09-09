// config/email.config.js

const sgMail = require('@sendgrid/mail');
const smsClient = require('twilio')(process.env.ACC_SID, process.env.AUTH_TOKEN);

// Load SendGrid API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Initialize SendGrid with the API key
sgMail.setApiKey(SENDGRID_API_KEY);

const sendSMS = async (message, number) => {
  smsClient.messages
  .create({
      body: message,
      to: number,
      from: '+447488893475',
  })
  .then((message) => console.log(message.sid));
}

const sendEmail = async (emailData) => {
  const { to, subject, text, html } = emailData;
  try {
    const msg = {
      to, // Recipient email
      from: process.env.SENDGRID_VERIFIED_EMAIL, // Sender email, should be a verified sender on SendGrid
      subject,
      text, // Plain text content
      html, // HTML content
    };

    // Send the email
    const response = await sgMail.send(msg);
    console.log('Email sent successfully', response);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

module.exports = {sendEmail, sendSMS};
