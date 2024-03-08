import express from 'express'

import { 
    AgentSignup ,
    Agentverify,
    AgentLogin,
    Agentgoogle,
    Agentplaces,
    Getplaces,
    UpdatePlace,
    Agentactivities,
    Getactivities,
    UpdateActivity,
    Packageadd,
    Getcategory,
    Takeactivity,
    Checkingagent
} from '../Controllers/Agentcontroller.js'
import { upload } from '../Middlewares/Multer.js';
import {userVerification,refreshTokenHandler} from '../Middlewares/AuthMiddleware.js'

const agentRoute =express.Router()

// agent routes
agentRoute.post('/login',AgentLogin)
agentRoute.post('/agentsignup',AgentSignup)
agentRoute.get('/verify/:token',Agentverify)
agentRoute.post('/googlelogin',Agentgoogle)
agentRoute.post('/places',userVerification,upload.single('image'),Agentplaces)
agentRoute.get('/getplaces',userVerification,Getplaces)
agentRoute.put('/updateplace/:id',userVerification,upload.single('image'),UpdatePlace)
agentRoute.post('/addactivity',userVerification,Agentactivities)
agentRoute.get('/activities',userVerification,Getactivities)
agentRoute.put('/updateactivity/:id',userVerification,UpdateActivity)
agentRoute.post('/addpackage',userVerification,upload.single('image'),Packageadd)
agentRoute.get('/getcategories',userVerification,Getcategory)
agentRoute.get('/getactivites',userVerification,Takeactivity)
agentRoute.get('/checkingagent/:data',userVerification,Checkingagent)

export default agentRoute
