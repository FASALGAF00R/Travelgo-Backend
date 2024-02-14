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
    
} from '../Controllers/Usercontroller.js'
import { upload } from '../Middlewares/Multer.js';
import {userVerification,refreshTokenHandler} from '../Middlewares/AuthMiddleware.js'
const userRoute = express.Router();

// user routes
userRoute.post('/signup', loadSignup)
userRoute.post('/login', loadLogin)
userRoute.post('/verify/:token', verifyEmail)
userRoute.post('/googlelogin', googlelogin)
userRoute.post('/forgotpass',Forgotpassword)
userRoute.get('/otpverify/:otp', userotpverify)
userRoute.put('/newpass',Createnewpass)
userRoute.post('/profile',userVerification,upload.single('profilepic'),updateprofile)
userRoute.post('/resetpass',Resetpassword)
userRoute.post('/refreshtoken', refreshTokenHandler);










export default userRoute
