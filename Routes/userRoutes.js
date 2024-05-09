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
    Checkinguser,
    listpackages,
    getpackages,
    fetchcat,
    listcatpackages,
    fetchpaymentreq,
    userbookingdetails,
    getbookings,
    Cancelbooking,
    getwalletamount,
    userbookingwalletdetails,
    getallbookings,
    getaddress
} from '../Controllers/Usercontroller.js'
import { upload } from '../Middlewares/Multer.js';
import {userVerification,refreshTokenHandler} from '../Middlewares/AuthMiddleware.js'
const userRoute = express.Router();

// user routes
userRoute.post('/signup', loadSignup)
userRoute.post('/login',loadLogin)
userRoute.post('/verify/:token', verifyEmail)
userRoute.post('/googlelogin', googlelogin)
userRoute.post('/forgotpass',Forgotpassword)
userRoute.get('/otpverify', userotpverify)
userRoute.post('/otpresend',Resendotp)
userRoute.put('/newpass',Createnewpass)
userRoute.post('/profile',userVerification,upload.single('profilepic'),updateprofile)
userRoute.post('/resetpass',userVerification,Resetpassword)
userRoute.get('/user/:id',userVerification,getimage)
userRoute.get('/getaddress/:id',userVerification,getaddress)
userRoute.get('/getplaces',userVerification, listplaces)
userRoute.post('/searchplaces',userVerification, Searchplace)
userRoute.get('/checkinguser/:data',userVerification,Checkinguser)
userRoute.get('/packages/:id',userVerification, listpackages)
userRoute.get('/packagesdetails/:id',userVerification, getpackages)
userRoute.get('/categories',userVerification,fetchcat)
userRoute.get('/catpackages/:placeId/:categoryname',userVerification, listcatpackages)
userRoute.get('/paymentreq/:id',userVerification,fetchpaymentreq)
userRoute.post('/bookingdata',userVerification,userbookingdetails)
userRoute.get('/fetchbookings',userVerification, getbookings)
userRoute.get('/fetchallbookings',userVerification, getallbookings)
userRoute.put('/cancelbookings',userVerification,Cancelbooking)
userRoute.get('/userwallet/:id',userVerification,getwalletamount)
userRoute.post('/walletpayment',userVerification,userbookingwalletdetails)


userRoute.post('/refreshtoken', refreshTokenHandler);











export default userRoute
