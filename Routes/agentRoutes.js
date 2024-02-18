import express from 'express'

import { 
    AgentSignup ,
    Agentverify,
    AgentLogin,
    Agentgoogle,
    Agentplaces,
    Getplaces,
    UpdatePlace
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
agentRoute.put('/updateplace/:id',UpdatePlace)

export default agentRoute
