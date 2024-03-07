import express from 'express'
import {
    loadSignup,
    loadLogin,
    verifyEmail,
    googlelogin,
    Forgotpassword,
    userotpverify,
    Createnewpass,
    updateprofile,
    Resetpassword,
    getimage,
    Resendotp,
    listplaces,
    Searchplace,
    Checkinguser
} from '../Controllers/Usercontroller.js'
import { upload } from '../Middlewares/Multer.js';
import {userVerification,refreshTokenHandler} from '../Middlewares/AuthMiddleware.js'
const userRoute = express.Router();

// user routes
userRoute.post('/signup', loadSignup)
userRoute.post('/login',loadLogin)
userRoute.post('/verify/:token',userVerification, verifyEmail)
userRoute.post('/googlelogin', googlelogin)
userRoute.post('/forgotpass',userVerification,Forgotpassword)
userRoute.get('/otpverify',userVerification, userotpverify)
userRoute.post('/otpresend',userVerification,Resendotp)
userRoute.put('/newpass',userVerification,Createnewpass)
userRoute.post('/profile',userVerification,upload.single('profilepic'),updateprofile)
userRoute.post('/resetpass',userVerification,Resetpassword)
userRoute.post('/refreshtoken', refreshTokenHandler);
userRoute.get('/user/:id',userVerification,getimage)
userRoute.get('/getplaces',userVerification, listplaces)
userRoute.post('/searchplaces',userVerification, Searchplace)
userRoute.get('/checkinguser/:data',userVerification,Checkinguser)











export default userRoute
