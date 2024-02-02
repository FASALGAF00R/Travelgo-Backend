import express from 'express'
import {
    loadSignup,
    loadLogin,
    verifyEmail,
    googlelogin,

} from '../Controllers/Usercontroller.js'
import {userVerification} from '../Middlewares/AuthMiddleware.js'

const userRoute = express.Router();

// user routes
userRoute.post('/signup', loadSignup)
userRoute.post('/login', loadLogin)
userRoute.post('/verify/:token', verifyEmail)
userRoute.post('/googlelogin', googlelogin)








export default userRoute
