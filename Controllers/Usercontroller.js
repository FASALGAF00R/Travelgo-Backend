import { user } from '../Models/Usermodel.js'
import { createSecretToken } from '../Util/SecretToken.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from '../Util/emailService.js'




const verificationToken = crypto.randomBytes(20).toString('hex');



//  user signup
export const loadSignup = async (req, res) => {
    try {
        const{userName,email,password}=req.body
        const User = await user.findOne({ email: req.body.email })
        if (User) {
            return res.status(400).json({ message: "user already exisist !" })
        } else {
           const hashedPassword = await bcrypt.hash(password, 10);
            const newuser = new user({userName,email,password:hashedPassword})
            newuser.verificationToken = verificationToken;
            newuser.save();
            sendVerificationEmail(newuser);
            res.status(201).json({ message: 'User signed up successfully. Please check your email for verification.', success: true, newuser  })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'internal server  error please try again later'})
    }
}



// user email verification

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const Data = await user.findOne({ verificationToken: token });
        if (Data) {
            Data.isVerified = true;
            Data.verificationToken = undefined;
            await Data.save();

            res.json({ message: 'Email verification successful.', Data });
        } else {
            res.status(404).json({ message: 'Invalid or expired verification token.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// user login

export const loadLogin = async (req, res) => {

    try {
        const { email, password } = req.body
        console.log(req.body);
        const Data = await user.findOne({ email: email })
        if (!Data) {
            return res.json({ message: "user  not found" })
        }
        const auth = await bcrypt.compare(password, Data.password);

        if (!auth) {
            return res.json({ message: "incorrect password" })
        }


        if (Data && auth && Data.isBlock == true) {

            const token = createSecretToken(Data._id,Data.userName);
            res.status(200).json({ message: "User logged succesfulluy", success: true, Data, token })

        } else {
            return res.json({ message: "blocked by admin" })

        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });

    }


}

// google login 

export const googlelogin = async (req, res) => {
    try {
        const { id, name, email } = req.body.data
        const Finduser = await user.findOne({ email: email })
        if (Finduser) {
            if (Finduser.isBlock == false) {
                return res.json({ message: "user is blocked by admin" })
            } else {
                return res.json({data:Finduser})
            }
        } else {
            
                const Googleuser = new user({
                    userName: name,
                    email: email,
                    password: id,
                })
                Googleuser.isVerified = true,
                    await Googleuser.save()
                if (Googleuser) {
                    const token = createSecretToken(Googleuser._id);
                    res.cookie("token", token, {
                        withCredentials: true,
                        httpOnly: false,
                    })
                    res.status(201).json({ message: "User logged succesfulluy", success: true, token, data:Googleuser })
                }
            
        }


    } catch (error) {
        console.log(error)
    }
}





