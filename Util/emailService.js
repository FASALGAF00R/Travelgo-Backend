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

export const sendVerificationEmail = (newuser,newagent) => {
  const Expirationdate = new Date();
  Expirationdate.setMinutes(Expirationdate.getMinutes() + Expirationtime);

  const expirationTimeString = Expirationdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const expirationISOString = Expirationdate.toISOString();

  
  
  if (newagent) {
    console.log("done",);
    const URL = `${process.env.AGENT_BASE_URL}/verify/${newagent.verificationToken}?expires=${Expirationdate.toISOString()}`;

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: newagent.email,
      subject: 'TravelGO Agent verification',
      text: `Click the following link to verify Agent: ${URL}\n\n` + `This link will expire on: ${expirationTimeString}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent for agent : ' + info.response);
      }
    });
    
    
  }else {
    const verificationLinkuser = `${process.env.USER_BASE_URL}verify/${newuser.verificationToken}?expires=${expirationISOString}`;
    console.log("pop");
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: newuser.email,
      subject: 'TravelGO verification',
      text: `Click the following link to verify user email: ${verificationLinkuser}\n\n` +
        `This link will expire on: ${expirationTimeString}`
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







