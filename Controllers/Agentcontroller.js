import agent from '../Models/Agentmodel.js'
import { Place } from '../Models/Placesmodel.js';
import { Package } from '../Models/Packages.js';
import { category } from '../Models/Categorymodel.js';
import { Booking } from '../Models/Booking.js';
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

            sendVerificationEmail(null, newagent,);
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

        if (Agent.isActive == 'Accepted') {
            const accesToken = createSecretToken(Agent._id);
            return res.status(200).json({ message: "Agent logged in successfully", success: true, Agent, accesToken });
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
        const { Destrictname, description, State, agentid } = req.body
        console.log(agentid, "agentid");
        const image = req.file.path;
        const Cloudstore = await handleUpload(image, "profilepic")
        const url = Cloudstore.url
        const Placedata = new Place({
            agentid: agentid,
            State: State,
            Destrictname: Destrictname,
            Description: description,
            Image: url
        })
        const Savedplace = await Placedata.save()

        return res.status(200).json({ succes: true, place: Savedplace })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });

    }

}

// for states and districts
export const Getstates = async (req, res) => {
    try {
        const States = await Place.find({ isBlock: false });
        console.log(States);
        return res.status(200).json({ success: true, States });
    } catch (error) {
        return res.status(500).json("Server error")
    }
}





export const Getplaces = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const placelist = await Place.find().skip(startIndex).limit(parseInt(limit));
        const totalPlacesCount = await Place.find();
        return res.status(200).json({
            succes: true,
            totalPlaces: totalPlacesCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalPlacesCount / parseInt(limit)),
            placelist
        });
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
        if (!foundPlace) {
            return res.status(400).json({ message: "Place not found" });
        }
        return res.status(200).json(foundPlace);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const Blockplaces = async (req, res) => {
    try {
        const { id } = req.params;
        const Places = await Place.findOne({ _id: id });
        if (Places.isBlock === true) {
            const newData = await Place.updateOne(
                { _id: id },
                { $set: { isBlock: false } }
            );
            res.json({
                newData,
                status: true,
                alert: "places Blocked",
            });

            if (!Places) {
                return res.status(400).json({ message: "places not found" })
            }
        } else {
            const newData = await Place.updateOne(
                { _id: id },
                { $set: { isBlock: true } }
            );
            res.json({
                newData,
                status: true,
                alert: "Unblocked places",
            });
        }


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}









export const Agentactivities = async (req, res) => {
    try {
        const Data = req.body.data;
        const agentid = req.body.id
        const Activitydata = new Activity({
            agentid: agentid,
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


export const BlockActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const Act = await Activity.findOne({ _id: id });
        if (Act.isBlock == true) {
            const newData = await Activity.updateOne(
                { _id: id },
                { $set: { isBlock: false } }
            );
            res.json({
                newData,
                status: true,
                alert: "activity Blocked",
            });

            if (!Act) {
                return res.status(400).json({ message: "Activity not found" })
            }
        } else {
            const newData = await Activity.updateOne(
                { _id: id },
                { $set: { isBlock: true } }
            );
            res.json({
                newData,
                status: true,
                alert: "Unblocked activity",
            });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}




export const Packageadd = async (req, res) => {
    try {
        const { State,
            Destrictname,
            image,
            category,
            description,
            activities,
            amount,
            perDAy,
            id } = req.body
        console.log(perDAy, "oggggggggo");
        // const Image = req.file.path;
        // console.log(Image,"IMAGES");
        // const Cloudstore = await handleUpload(Image, "profilepic")

        const Packagedata = new Package({
            agentid:id,
            State: State,
            Destrictname: Destrictname,
            Image: image,
            category: category,
            details: description,
            activites: activities,
            amount: amount,
            perDAy:perDAy
        })
        await Packagedata.save()

        console.log(Packagedata, "Packagedata");
        return res.status(200).json({ succes: true, Packagedata })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const Getcategory = async (req, res) => {
    try {
        const Categories = await category.find({ isBlock: true });
        return res.status(200).json({ success: true, Categories });
    } catch (error) {
        return res.status(500).json("Server error")
    }
}


export const Takeactivity = async (req, res) => {
    try {
        const Activities = await Activity.find({ isBlock: true });
        return res.status(200).json({ succes: true, Activities });
    } catch (error) {
        return res.status(500).json("Server error")
    }
}



export const Checkingagent = async (req, res) => {
    try {
        const { data } = req.params
        const Agent = await agent.findById(data)
        if (Agent.isBlock === false) {
            return res.json({ success: false, message: 'blocked by admin' })
        } else {
            return res.json({ success: true })
        }
    } catch (error) {
        console.log("bug");
        return res.status(500).json("Server error")
    }
}


export const Listpackages = async (req, res) => {
    try {
        const pack = await Package.find();
        console.log(pack, "pppppppppppppppp");
        return res.status(200).json({ pack });
    } catch (error) {
        return res.status(500).json("Server error")
    }
}



export const Blockpackagess = async (req, res) => {
    try {
        const { id } = req.params;
        const Packages = await Package.findOne({ _id: id });
        if (Packages.isBlock === true) {
            const newData = await Package.updateOne(
                { _id: id },
                { $set: { isBlock: false } }
            );
            res.json({
                newData,
                status: true,
                alert: "packages Blocked",
            });

            if (!Packages) {
                return res.status(400).json({ message: "Packages not found" })
            }
        } else {
            const newData = await Package.updateOne(
                { _id: id },
                { $set: { isBlock: true } }
            );
            res.json({
                newData,
                status: true,
                alert: "Unblocked Packages",
            });
        }

    } catch (error) {
        return res.status(500).json("Server error")
    }
}


export const Listbookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})        
        return res.json({ message: "fetched all bookings", bookings })
    } catch (error) {
        return res.status(500).json("Server error")
    }
}
