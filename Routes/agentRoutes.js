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
    UpdateActivity
} from '../Controllers/Agentcontroller.js'
import { upload } from '../Middlewares/Multer.js';
const agentRoute =express.Router()

// agent routes
agentRoute.post('/login',AgentLogin)
agentRoute.post('/agentsignup',AgentSignup)
agentRoute.get('/verify/:token',Agentverify)
agentRoute.post('/googlelogin',Agentgoogle)
agentRoute.post('/places',upload.single('image'),Agentplaces)
agentRoute.get('/getplaces',Getplaces)
agentRoute.put('/updateplace/:id',upload.single('image'),UpdatePlace)
agentRoute.post('/addactivity',Agentactivities)
agentRoute.get('/activities',Getactivities)
agentRoute.put('/updateactivity/:id',UpdateActivity)

export default agentRoute
