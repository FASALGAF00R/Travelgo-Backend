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
    const URL = `${process.env.AGENT_BASE_URL}/verify/${newagent.verificationToken}`;
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: newagent.email,
      subject: 'TravelGO Agent verification',
      html: `
      <div style="background-color: #3498db; padding: 15px; border-radius: 5px;">
        <h2 style="color: #ffffff;">TravelGO Agent Verification</h2>
        <p style="color: #ffffff;">Click the button below to verify your agent account:</p>
        <a href="${URL}" style="background-color: #2980b9; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Agent</a>
        <p style="color: #ffffff;">This link will expire on: ${expirationTimeString}</p>
      </div>
    `
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent for agent : ' + info.response);
      }
    });
    
    
  }else {
    const verificationLinkuser = `${process.env.USER_BASE_URL}verify/${newuser.verificationToken}`;
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: newuser.email,
      subject: 'TravelGO verification',
      html: `
      <div style="background-color: #ff1493; padding: 15px; border-radius: 5px;">
        <h2 style="color: #ffffff;">TravelGO user Verification</h2>
        <p style="color: #ffffff;">Click the button below to verify user account:</p>
        <a href="${verificationLinkuser}" style="background-color: #2980b9; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Agent</a>
        <p style="color: #ffffff;">This link will expire on: ${expirationTimeString}</p>
      </div>
    `
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







