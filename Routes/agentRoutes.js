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
    BlockActivity,
    Packageadd,
    Getcategory,
    Takeactivity,
    Checkingagent,
    Blockplaces,
    Getstates,
    Listpackages,
    Blockpackagess,
    Listbookings
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
agentRoute.get('/getstates',userVerification,Getstates)
agentRoute.put('/Blockplace/:id',userVerification,Blockplaces)
agentRoute.put('/updateplace/:id',userVerification,upload.single('image'),UpdatePlace)
agentRoute.post('/addactivity',userVerification,Agentactivities)
agentRoute.get('/activities',userVerification,Getactivities)
agentRoute.put('/updateactivity/:id',userVerification,UpdateActivity)
agentRoute.post('/addpackage',userVerification,upload.array('images',5),Packageadd)
agentRoute.get('/getcategories',userVerification,Getcategory)
agentRoute.get('/getactivites',userVerification,Takeactivity)
agentRoute.get('/listpackages',userVerification,Listpackages)
agentRoute.put('/blockpackages/:id',userVerification,Blockpackagess)
agentRoute.get('/checkingagent/:data',userVerification,Checkingagent)
agentRoute.put('/blockactivity/:id',userVerification,BlockActivity)
agentRoute.get('/listbookings',userVerification,Listbookings)

export default agentRoute
