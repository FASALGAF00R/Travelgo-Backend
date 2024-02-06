import express from 'express'
import {
    loadSignup,
    loadLogin,
    verifyEmail,
    googlelogin,
    Forgotpassword,
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
// userRoute.post('/refreshtoken',userVerification,refreshTokenHandler)








export default userRoute
