import agent from '../Models/Agentmodel.js'
import crypto from 'crypto'
import { sendVerificationEmail } from '../Util/emailService.js';
import { createSecretToken } from '../Util/SecretToken.js';
import bcrypt from 'bcrypt'
const verificationToken = crypto.randomBytes(20).toString('hex');


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

export const AgentLogin = async(req,res)=>{
    console.log("llllllllllllll");
    try {
        const { email, password } = req.body
       
        if (!email || !password) {
            return res.json({ message: "All fields are required " })
        }

        const Agent = await agent.findOne({ email :email})
        console.log(Agent, "datagggggggggggggggg");
        if (!Agent) {
            return res.json({ message: "email or password is incorrect" })
        }
        const auth = await bcrypt.compare(password, Agent.password);
        if (auth) {
            return res.json({ message: "incorrect password" })
        }
        console.log("7");

        if (Agent) {
            const token = createSecretToken(Agent._id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            })
            res.status(201).json({ message: "Agent logged succesfulluy", success: true, Agent, token })
        }
    } catch (error) {
        console.log(error);
    }
}
