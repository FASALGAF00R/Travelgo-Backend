import { user } from '../Models/Usermodel.js'
import { createSecretToken } from '../Util/SecretToken.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from '../Util/emailService.js'
import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'
import { handleUpload } from '../Util/Cloudinary.js'
import agent from '../Models/Agentmodel.js'
import { Place } from '../Models/Placesmodel.js'




const verificationToken = crypto.randomBytes(20).toString('hex');



//  user signup
export const loadSignup = async (req, res) => {
    try {
        const { userName, email, password } = req.body
        const User = await user.findOne({ email: req.body.email })
        if (User) {
            return res.json({ success: false, message: "user already exisist !" })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newuser = new user({ userName, email, password: hashedPassword })
            newuser.verificationToken = verificationToken;
            newuser.save();
            sendVerificationEmail(newuser);
            res.status(201).json({ message: 'User signed up successfully. Please check your email for verification.', success: true, newuser })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'internal server  error please try again later' })
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
        const Data = await user.findOne({ email: email })
        if (!Data) {
            return res.json({ message: "user  not found" })
        }
        const auth = await bcrypt.compare(password, Data.password);
        if (!auth) {
            return res.json({ message: "incorrect password" })
        }

        if (Data && auth && Data.isBlock == true) {
            const { accesToken, Refreshtoken } = createSecretToken(Data._id, Data.userName, Data.email);
            res.status(200).json({ message: "User logged succesfulluy", success: true, Data, accesToken, Refreshtoken })
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
                return res.json({ data: Finduser })
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
                res.status(201).json({ message: "User logged succesfulluy", success: true, token, data: Googleuser })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


// forgotpass
export const Forgotpassword = async (req, res) => {
    try {
        const { email, role } = req.body
        const Data = await user.findOne({ email })
        const Agentdata = await agent.findOne({ email })
        if (Data === null) {
            return res.json({ message: 'user not registered' })
        }

        if (Agentdata === null) {
            return res.json({ message: 'user not registered' })
        }

        if (Data && role === 'user') {
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            const userdata = await user.updateOne({ email: Data.email }, { $set: { Otp: otp } })
            let result = await user.findOne({ email: Data.email });

            // ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            });
            console.log(process.env.MAIL_PASS, ".................");
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: result.email,
                subject: 'otp verification for forgot password',
                text: `Pls confirm your otp ${result.Otp}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("errooor");
                    console.error(error);
                } else {
                    console.log('Email sent  : ' + info.response);
                    console.log("iuiuiui");
                    return res.status(200).json({
                        success: true,
                        message: "OTP sent successfully",
                        userdata

                    });
                }

            });
        } else {
            console.log("hu");
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            const Agent = await agent.updateOne({ email: Agentdata.email }, { $set: { Otp: otp } })

            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            });
            console.log(process.env.MAIL_PASS, ".................");
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: Agentdata.email,
                subject: 'otp verification for forgot password',
                text: `Pls confirm your Resend otp ${otp}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("errooor");
                    console.error(error);
                } else {
                    console.log('Email sent  : ' + info.response);
                    console.log("iuiuiui");
                    return res.status(200).json({
                        success: true,
                        message: "OTP sent successfully",


                    });
                }

            })
        }

        //    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// userotpverficaton

export const userotpverify = async (req, res) => {
    try {
        const otp = req.query.otp;
        const Role = req.query.role;
        if (Role === "agent") {
            const findAgentotp = await agent.findOne({ Otp: otp })
            if (findAgentotp.Otp === otp) {
                return res.json({ success: true, message: "verified" })
            } else {
                return res.json({ success: false, message: "invalid otp" })
            }

        } else {
            const findotp = await user.findOne({ Otp: otp })
            if (findotp.Otp === otp) {
                return res.json({ success: true, message: "verified" })
            } else {
                return res.json({ success: false, message: "invalid otp" })
            }

        }
    } catch (error) {
        console.error("Error while checking for user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });

    }
}




// newpassword
export const Createnewpass = async (req, res) => {
    try {
        const { password, email, role } = req.body

        const hashpass = await bcrypt.hash(password, 10)
        if (role === 'user') {

            const userdata = await user.updateOne({ email: email }, { $set: { password: hashpass } })
            if (userdata) {
                return res.status(200).json({ message: 'password updated', success: true })
            } else {
                return res.status(200).json({ message: 'User not found!', success: false })

            }
        } else {
            const agentdata = await agent.updateOne({ email: email }, { $set: { password: hashpass } })
            if (agentdata) {
                return res.status(200).json({ message: 'password updated', success: true })
            } else {
                return res.status(200).json({ message: 'User not found!', success: false })

            }
        }
    } catch (error) {
        console.error("Error while creating newpassword:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}



// userprofile image

export const updateprofile = async (req, res) => {
    try {
        console.log(req.body, 'how are you?');
        const { userId } = req.body
        const Image = req.file.path;
        console.log(userId, '--------------------');

        const Cloudstore = await handleUpload(Image, "profilepic")
        const url = Cloudstore.url
        const newData = await user.updateOne({ _id: userId }, { $set: { image: url } })
        console.log(Cloudstore, 'oooooooooooooooooo');
        res.status(200).json({ success: true, newData: url });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });

    }
}

// changing password

export const Resetpassword = async (req, res) => {
    console.log("ioioioioioioioioio");
    try {
        const { email, formData } = req.body;
        console.log(formData, ":::::::::::::::::::::::");
        const { password, newPassword } = formData;
        const User = await user.findOne({ email: email });
        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }
        const Passwordconfirm = await bcrypt.compare(password, User.password)
        console.log(Passwordconfirm, ".....");
        if (Passwordconfirm) {
            const hashpassnew = await bcrypt.hash(newPassword, 10)
            const Userdata = await user.updateOne({ email: email }, { $set: { password: hashpassnew } });
            User.image = formData.image
            await User.save()
            return res.status(200).json({ success: true, message: "Password updated" });
        } else {
            return res.json({ success: false, message: "Current password incorrect" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// viewing image
export const getimage = async (req, res) => {
    console.log("ethiii");
    try {
        const Id = req.params.id;
        console.log(Id, 'lklklklklklklklklklk');
        const Img = await user.findById({ _id: Id });
        console.log(Img, 'pppppppppppppppppppp');
        console.log(Img.image, "opopopopoo");
        return res.json({ message: "Image send", image: Img.image });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}



export const Resendotp = async (req, res) => {
    try {

        const { Data, role } = req.body;
        if (role === 'user') {
            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            const userdata = await user.findOneAndUpdate({ email: Data }, { $set: { Otp: otp } })
            console.log(userdata);


            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            });
            console.log(process.env.MAIL_PASS, ".................");
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: userdata.email,
                subject: 'Resend otp',
                text: `Pls confirm your otp ${otp}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("errooor");
                    console.error(error);
                } else {
                    console.log('Email sent  : ' + info.response);
                    console.log("iuiuiui");
                    return res.status(200).json({
                        success: true,
                        message: "OTP sent successfully for resend",
                    });
                }

            });


        } else {
            console.log("lklkl");

            let otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            const Agentdata = await agent.findOneAndUpdate({ email: Data }, { $set: { Otp: otp } })
            await Agentdata.save();


            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            });
            console.log(process.env.MAIL_PASS, ".................");
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: Agentdata.email,
                subject: 'Resend otp',
                text: `Pls confirm your Resendotp ${otp}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("errooor");
                    console.error(error);
                } else {
                    console.log('Email sent  : ' + info.response);
                    console.log("iuiuiui");
                    return res.status(200).json({
                        success: true,
                        message: "OTP sent successfully for resend",
                    });
                }

            });

        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }


}



export const listplaces = async (req, res) => {
    try {
        const District = await Place.find({})
        const total = District.length
        const page =req.query.page || 1
        const limit = req.query.limit || 10
        const skip = (page - 1) * limit
        console.log(limit,page,"00");
        const places = await Place.find({}).limit(limit).skip(skip)
        const totalPages = Math.ceil(total / limit)
        return res.status(200).json({
            places,
            total,
            totalPages        
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const Searchplace = async (req, res) => {
    try {
        const { Data } = req.body;
        const District = await Place.find({Destrictname:{$regex:new RegExp (Data,'i')}})
        return res.status(200).json(District);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });

    }


}


export const Checkinguser = async (req, res) => {
    try {
       const {data} =req.params
       const User = await user.findById(data)
      if(User.isBlock===false){
        return res.json({success:false})
       }else{
        return res.json({success:true})
       }
    } catch (error) {
        return res.status(500).json("Server error")
    }
}

