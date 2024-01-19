import agent from '../Models/Agentmodel.js'
import crypto from 'crypto'
import { sendVerificationEmail } from '../Util/emailService.js';
import { createSecretToken } from '../Util/SecretToken.js';

const verificationToken = crypto.randomBytes(20).toString('hex');
console.log(verificationToken, "tokkkkennnnnn");

export const AgentSignup = async (req, res) => {
    try {
        const Agent = await agent.findOne({ email: req.body.email })
        console.log(Agent, "back");
        if (Agent) {
            return res.json({ message: "user already exisist !" })
        } else {
            const newagent = new agent({
                userName: req.body.userName,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            })
            newagent.verificationToken = verificationToken;
            console.log(newagent,"mmmmmmmmmmmmm");
            newagent.save();
            
              const url =`${process.env.AGENT_BASE_URL}/verify/${newagent.verificationToken}`
            sendVerificationEmail(newagent,url);
            const token = createSecretToken(newagent._id);
            res.cookie('tokken', token, {
                withCredentials: true,
                httpOnly: false,
            });
            res.status(201).json({ message: 'User signed up successfully. Please check your email for verification.', success: true, newagent })
        }
    } catch (error) {
        console.error(error);
    }
}

export const Agentverify = async (req, res) => {
    
    try {
        const  {token}  = req.params;
        const Data = await agent.findOne({ verificationToken: token  })
        if (Data) {
            Data.isVerified = true;
            Data.verificationToken = undefined;
            await Data.save();
            return res.status(200).json({ message: "verified", success: true })
        } else {
            return res.json({ message: 'error token', success: false })
        }
    } catch (error) {
        console.log(error);
    }
}

