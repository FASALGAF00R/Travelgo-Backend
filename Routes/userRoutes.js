import express from 'express'
import {
    loadSignup,
    loadLogin,
    verifyEmail,
    googlelogin,
    Forgotpassword,
    userotpverify,
    Createnewpass
} from '../Controllers/Usercontroller.js'
import {userVerification} from '../Middlewares/AuthMiddleware.js'
// import {refreshTokenHandler} from '../Middlewares/AuthMiddleware.js'
const userRoute = express.Router();

// user routes
userRoute.post('/signup', loadSignup)
userRoute.post('/login', loadLogin)
userRoute.post('/verify/:token', verifyEmail)
userRoute.post('/googlelogin', googlelogin)
userRoute.post('/forgotpass',Forgotpassword)
userRoute.get('/otpverify/:otp', userotpverify)
userRoute.post('/newpass',Createnewpass)

// userRoute.post('/refreshtoken',userVerification,refreshTokenHandler)








export default userRoute
