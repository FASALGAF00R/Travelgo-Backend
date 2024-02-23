import agent from '../Models/Agentmodel.js'
import { Place } from '../Models/Placesmodel.js';
import { Package } from '../Models/Packages.js';
import { category } from '../Models/Categorymodel.js';
import { Activity } from '../Models/Activities.js';
import crypto from 'crypto'
import { sendVerificationEmail } from '../Util/emailService.js';
import { createSecretToken } from '../Util/SecretToken.js';
import { handleUpload } from '../Util/Cloudinary.js'
import bcrypt from 'bcrypt'


const verificationToken = crypto.randomBytes(20).toString('hex');


export const AgentSignup = async (req, res) => {
    try {
        const { userName, email, phone, password } = req.body
        const Agent = await agent.findOne({ email: email })

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
            sendVerificationEmail(newagent, URL);
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


export const Agentplaces = async (req, res) => {
    try {
        const { place, description } = req.body
        const { path: image } = req.file
        console.log(place, description);
        const Placedata = new Place({
            Destrictname: place,
            Description: description,
            Image: image
        })
        const Savedplace = await Placedata.save()

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });

    }

}


export const Getplaces = async (req, res) => {
    try {
        const placelist = await Place.find();
        const placesWithImageUrls = placelist.map(place => {
            return {
                ...place._doc,
                Image: `${req.protocol}://${req.get('host')}/${place.Image}`
            };

        });
        return res.status(200).json(placesWithImageUrls);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const UpdatePlace = async (req, res) => {
    try {
        const id = req.params.id;
        const { Destrictname, description, image } = req.body.Data;
        console.log(Destrictname, description, image, "///");
        const foundPlace = await Place.findByIdAndUpdate(id, { $set: { Destrictname: Destrictname, Description: description } }, { new: true });
        console.log(foundPlace, "pop");
        if (!foundPlace) {
            return res.status(400).json({ message: "Place not found" });
        }
        return res.status(200).json(foundPlace);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const Agentactivities = async (req, res) => {
    try {
        const Data = req.body.form
        const Activitydata = new Activity({
            Activity: Data
        })
        await Activitydata.save()
        return res.status(200).json({ succes: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const Getactivities = async (req, res) => {
    try {
        const Activities = await Activity.find();
        return res.status(200).json(Activities);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}


export const UpdateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { form } = req.body;

        const foundActivity = await Activity.findByIdAndUpdate(id, { $set: { Activity: form } }, { new: true });
        if (!foundActivity) {
            return res.status(400).json({ message: "Activity not found" });
        } else {
            await foundActivity.updateOne({ Activity: form });
            return res.status(201).json({ message: 'Updated Successfully' });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}

export const Packageadd = async (req, res) => {
    try {
        const { placeName,
            category,
            description,
            activities,
            amount } = req.body
        console.log(req.body, "oggggggggo");
        const Image = req.file.path;
        const Cloudstore = await handleUpload(Image, "profilepic")
        const Packagedata = new Package({
            placename: placeName,
            Image:Cloudstore.url,
            category:category,
            details:description ,
            activites:activities ,
            amount:amount,
        })
        await Packagedata.save()
        return res.status(200).json({ succes: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const Getcategory = async (req, res) => {
    try {
        const Categories = await category.find();
        return res.status(200).json({ succes: true, Categories });
    } catch (error) {
        return res.status(500).json("Server error")
    }
}


export const Takeactivity = async (req, res) => {
    try {
        const Activities = await Activity.find();
        return res.status(200).json(Activities);
    } catch (error) {
        return res.status(500).json("Server error")
    }
}
