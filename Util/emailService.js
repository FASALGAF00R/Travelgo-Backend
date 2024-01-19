// emailService.js
import nodemailer from 'nodemailer'
import env from 'dotenv'
env.config()

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }

});



export const sendVerificationEmail = (user,url) => {
  const verificationLinkuser = `http://localhost:5173/verify/${user.verificationToken}`;
  if (url) {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'TravelGO verification',
      text: `Click the following link to verify your email: ${url}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } else {

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'TravelGO verification',
      text: `Click the following link to verify your email: ${verificationLinkuser}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
}



