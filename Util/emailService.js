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


const Expirationtime = 3;
const Expirationdate = new Date();
Expirationdate.setMinutes(Expirationdate.getMinutes() + Expirationtime);


export const sendVerificationEmail = (user,url) => {
  const verificationLinkuser = `${process.env.USER_BASE_URL}verify/${user.verificationToken}?expires=${Expirationdate.toISOString()}`;


  if (url) {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'TravelGO verification',
      emailtext : `Click the following link to verify your email: ${url}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent for agent : ' + info.response);
      }
    });
  } else {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'TravelGO verification',
      text: `Click the following link to verify your email: ${verificationLinkuser}\n\n` +
      `This link will expire on: ${Expirationdate.toLocaleString()}`
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



