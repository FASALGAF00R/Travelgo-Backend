// emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // configure your email transport
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});


const sendVerificationEmail = (user) => {
    console.log("email sending area");
  const verificationLink = `http://localhost:5173/verify/${user.verificationToken}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: user.email,
    subject: 'TravelGO verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendVerificationEmail,
};

