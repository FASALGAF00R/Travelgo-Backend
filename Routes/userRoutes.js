const express=require('express')
const userRoute=express.Router()
const usercontroller=require('../Controllers/Usercontroller')
const { userVerification } = require('../Middlewares/AuthMiddleware')



userRoute.post('/signup',usercontroller.loadSignup)
userRoute.post('/login',usercontroller.loadLogin)
// userRoute.post('/verify',userVerification)
userRoute.post('/verify/:token',usercontroller.verifyEmail )


module.exports=userRoute

