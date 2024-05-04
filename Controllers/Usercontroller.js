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
import { Package } from '../Models/Packages.js'
import { category } from '../Models/Categorymodel.js';
import { Booking } from '../Models/Booking.js';


import Stripe from 'stripe'
import env from 'dotenv'
env.config()


// token for linkchecking
const verificationToken = crypto.randomBytes(20).toString('hex');



//  user signup
export const loadSignup = async (req, res) => {
    try {
        const { userName, email, password } = req.body
        const User = await user.findOne({ email })
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
            const accesToken = createSecretToken(Data._id, Data.userName, Data.email);
            res.status(200).json({ message: "User logged succesfulluy", success: true, Data, accesToken })
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
        const { data, role } = req.body
        const { email } = data
        console.log(role, email);
        const Data = await user.findOne({ email })
        console.log(Data, "88");
        const Agentdata = await agent.findOne({ email })
        if (Data === null && Agentdata === null) {
            return res.json({ message: ' not registered' })
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
        console.log(password);

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
        return res.json({ message: "Image send", image: Img.image, wallet: Img.wallet });

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
        const District = await Place.find()
        const total = District.length
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const skip = (page - 1) * limit
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
        const District = await Place.find({ Destrictname: Data })
        console.log(District, "lklkkkkkkk");
        return res.status(200).json(District);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const Checkinguser = async (req, res) => {
    try {
        const { data } = req.params
        const User = await user.findById(data)
        if (User.isBlock === false) {
            return res.json({ success: false })
        } else {
            return res.json({ success: true })
        }
    } catch (error) {
        return res.status(500).json("Server error")
    }
}



export const listpackages = async (req, res) => {
    try {
        const { id } = req.params
        const places = await Place.findById(id)
        const fullpackage = await Package.find({ $and: [{ State: places.State }, { Destrictname: places.Destrictname }, { isBlock: true }] })
        console.log(fullpackage, "ooooo");
        return res.json({ fullpackage })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const getpackages = async (req, res) => {
    try {
        const { id } = req.params
        const placespackage = await Package.findById(id)
        return res.json({ placespackage })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const fetchcat = async (req, res) => {
    try {
        const packagescat = await category.find()
        console.log(packagescat, "///////////");
        return res.json({ packagescat })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}





export const listcatpackages = async (req, res) => {
    try {
        const { placeId, categoryname } = req.params
        console.log(placeId, ";;;;;;;;;;;;");
        const placename = await Place.findById({ _id: placeId })
        console.log(placename, "ppppppppppppp");
        const packagesInCategory = await Package.find({ category: categoryname, Destrictname: placename.Destrictname });
        console.log(packagesInCategory, "packagesInCategory");
        return res.json({ packagesInCategory })


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const fetchpaymentreq = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id, "idddddd");
        const stripe = new Stripe(process.env.STRIPE_KEY)
        const Bookpackage = await Package.findById({ _id: id })
        console.log(Bookpackage, "Bookpackage");
        const RentAmount = Bookpackage.amount

        const paymentIntent = await stripe.paymentIntents.create({
            amount: RentAmount * 100,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true
            },
        })
        return res.status(200).send({ success: true, message: "client id passed to client", clientSecret: paymentIntent.client_secret, RentAmount })


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}





export const userbookingdetails = async (req, res) => {
    try {
        const { formData, totalAmount, userId, agentId, packageId } = req.body;

        const { country, state, city, address, contact, paymentDate } = formData;
        const booking = new Booking({
            phone: contact,
            address: {
                state: state,
                city: city,
                country: country,
            },
            agentId: agentId,
            userId: userId,
            packageId: packageId,
            Date: paymentDate,
            Amount: totalAmount,

        });
        console.log(booking, "booking");
        await booking.save();
        res.status(201).json({ message: "Booking saved successfully", status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'internal server  error please try again later' })
    }
}



export const getbookings = async (req, res) => {
    try {
        const bookings = await Booking.find({payment_type:'Wallet'})
        console.log(bookings, "bookings");
        return res.json({ message: "fetched all bookings", bookings })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



// for displaying aall bookins

export const getallbookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
        console.log(bookings, "bookings");
        return res.json({ message: "fetched all bookings", bookings })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}







export const Cancelbooking = async (req, res) => {
    try {
        const { bookingid, userid } = req.body;
        console.log(userid, bookingid, "bookingidbookingidbookingid");
        const findbooking = await Booking.findByIdAndUpdate({ _id: bookingid }, { $set: { isCanceled: true } })
        console.log(findbooking, "findbookingggggggggg");
        if (findbooking) {
            const totalamount = findbooking.Amount
            console.log(totalamount, "totalamount");
            const finduser = await user.findById({ _id: userid })
            console.log(finduser, "finduser");
            if (finduser) {
                finduser.wallet += totalamount;
                await finduser.save();
            }
        } else {
            return res.status(500).json({ message: "not found" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const getwalletamount = async (req, res) => {
    console.log("ethiii");
    try {
        const Id = req.params.id;
        console.log(Id, 'lklklklklklklklklklk');
        const userid = await user.findById({ _id: Id });
        return res.json({ message: "wallet send", wallet: userid.wallet });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export const userbookingwalletdetails = async (req, res) => {
    try {
        const { contact, address, totalAmount, packageId, state, userid, agentid, country, city, paymentDate } = req.body;
        console.log(totalAmount, "totalAmount", packageId, "packageId", totalAmount, "totalAmount", state, "state");

        const userList = await user.findOne({ _id: userid })
        console.log(userList, "ll");
        const wallet = userList.wallet;
        console.log(wallet,"walletwallet");
        if (wallet >= totalAmount) {
            const updateWallet = await user.findByIdAndUpdate(
                { _id: userid },
                { $inc: { wallet: -totalAmount } }
            )
            console.log(updateWallet,"updateWalletyyyyyyyyyyyyy");
            const bookingData = new Booking({
                phone: contact,
                address: {
                    state: state,
                    city: city,
                    country: country,
                },
                agentId: agentid,
                userId: userid,
                packageId: packageId,
                Date: paymentDate,
                Amount: totalAmount,
                payment_type: 'Wallet',

            });

            await bookingData.save();

            res.status(200).json({ success: true, message: "Booking details saved successfully.", updateWallet });
        }else {
            return res.json({ success: false, message: "Wallet Balance is not enough to buy this!",});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error saving booking details." });
    }
}
