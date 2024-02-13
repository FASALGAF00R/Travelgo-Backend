import agent from '../Models/Agentmodel.js'
import crypto from 'crypto'
import { sendVerificationEmail } from '../Util/emailService.js';
import { createSecretToken } from '../Util/SecretToken.js';
import bcrypt from 'bcrypt'


const verificationToken = crypto.randomBytes(20).toString('hex');


export const AgentSignup = async (req, res) => {
    try {
        const { userName, email, phone, password } = req.body
        const Agent = await agent.findOne({ email: email })
        console.log(Agent);

        if (Agent) {
            return res.json({ message: "user already exisits" })
        } else {
            const hashpass = await bcrypt.hash(password, 10)
            const newagent = new agent({
                userName: userName,
                email: email,
                phone: phone,
                password: hashpass
            })
            newagent.verificationToken = verificationToken;
            newagent.save();
            const Expirationtime = 3;
            const Expirationdate = new Date();
            Expirationdate.setMinutes(Expirationdate.getMinutes() + Expirationtime);
            const URL = `${process.env.AGENT_BASE_URL}/verify/${newagent.verificationToken}?expires=${Expirationdate.toISOString()}`;
            sendVerificationEmail(newagent,URL); 
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
        if (!Agent) {
            return res.json({ message: "user not found" });
        }
        const auth = await bcrypt.compare(password, Agent.password);
        if (!auth) {
            return res.json({ message: "password incorrect" })
        }

        if (Agent.Approval == false) {
            const token = createSecretToken(Agent._id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            return res.status(201).json({ message: "Agent logged in successfully", success: true, Agent, token });
        } else {
            return res.status(200).json({ message: "permission required" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Agentgoogle = async (req, res) => {
    try {
        const { id, name, email, phone } = req.body.data
        const Findagent = await agent.findOne({ email: email })
        console.log(Findagent, "ffffffffff");
        if (Findagent) {
            if (Findagent.Approval == true) {
                return res.json({ message: "user need permission by admin" })
            } else {
                return res.json({ data: Findagent })
            }


        } else {
            const hashpass = await bcrypt.hash(id, 10)
            console.log(hashpass);
            const Googleagent = new agent({
                userName: name,
                email: email,
                password: hashpass,
            })
            Googleagent.isVerified = true
            await Googleagent.save()
            if (Googleagent) {
                const token = createSecretToken(Googleagent._id);
                console.log(token, "yyyyy");
                res.cookie("token", token, {
                    withCredentials: true,
                    httpOnly: false,
                })
                res.status(201).json({ message: "Agent logged succesfulluy", success: true, token, data: Googleagent })

            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}