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

// Add the expiration time to the current minutes
Expirationdate.setMinutes(Expirationdate.getMinutes() + Expirationtime);

// Check if the new minutes exceed 60, and adjust the hours accordingly
if (Expirationdate.getMinutes() >= 60) {
  Expirationdate.setHours(Expirationdate.getHours() + 1);
  Expirationdate.setMinutes(Expirationdate.getMinutes() - 60);
}


export const sendVerificationEmail = (user, URL) => {

  const verificationLinkuser = `${process.env.USER_BASE_URL}verify/${user.verificationToken}?expires=${Expirationdate.toISOString()}`;


  if (URL) {
    console.log("done");
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'TravelGO Agent verification',
      text: `Click the following link to verify Agent: ${URL}\n\n` + `This link will expire on: ${Expirationdate.toLocaleString()}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent for agent : ' + info.response);
      }
    });


  }else {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'TravelGO verification',
      text: `Click the following link to verify user email: ${verificationLinkuser}\n\n` +
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



