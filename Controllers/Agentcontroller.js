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
            return res.json({ message: "agent already exisist !" })
        } else {
            const newagent = new agent({
                userName: req.body.userName,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            })
            newagent.verificationToken = verificationToken;
            newagent.save();

            const url = `${process.env.AGENT_BASE_URL}/verify/${newagent.verificationToken}`
            sendVerificationEmail(newagent, url);
            const token = createSecretToken(newagent._id);
            res.cookie('tokken', token, {
                withCredentials: true,
                httpOnly: false,
            });
            res.status(201).json({ message: 'Agent signed up successfully. Please check your email for verification.', success: true, newagent })
        }
    } catch (error) {
        console.error(error);
    }
}

export const Agentverify = async (req, res) => {

    try {
        const { token } = req.params;
        console.log(token);
        const Data = await agent.findOne({ verificationToken: token })
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

export const AgentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const Agent = await agent.findOne({ email: email });
        console.log(Agent, "agent");
        if (!Agent) {
            return res.json({ message: "user not found" });
        }
        const auth = await bcrypt.compare(password, Agent.password);
        if(!auth){
            return res.json({message:"password incorrect"})
        }

        if (Agent.isBlock === "true" && Agent.Approval == false) {
                  const token = createSecretToken(Agent._id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            return res.status(201).json({ message: "Agent logged in successfully", success: true, Agent, token });
        } else {
            return res.status(200).json({message:"permission required"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

