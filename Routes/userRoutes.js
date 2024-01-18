const express=require('express')
const userRoute=express.Router()
const usercontroller=require('../Controllers/Usercontroller')
const { protect } = require('../Middlewares/AuthMiddleware')



userRoute.post('/signup',usercontroller.loadSignup)
userRoute.post('/login',usercontroller.loadLogin)
// userRoute.post('/verify',userVerification)
userRoute.post('/verify/:token',usercontroller.verifyEmail )
userRoute.post('/googlelogin',usercontroller.googlelogin)


module.exports=userRoute

