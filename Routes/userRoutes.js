import express from 'express'

import {
    loadSignup,
    loadLogin,
    verifyEmail,
    googlelogin,

} from '../Controllers/Usercontroller.js'
import { protect } from '../Middlewares/AuthMiddleware.js'
const userRoute = express.Router();

// user routes
userRoute.post('/signup', loadSignup)
userRoute.post('/login', loadLogin)
userRoute.post('/verify/:token', verifyEmail)
userRoute.post('/googlelogin', googlelogin)




// agentroutes



export default userRoute
