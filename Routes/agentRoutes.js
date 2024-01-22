import express from 'express'

import { 
    AgentSignup ,
    Agentverify,
    AgentLogin
} from '../Controllers/Agentcontroller.js'

const agentRoute =express.Router()

// agent routes
agentRoute.post('/login',AgentLogin)
agentRoute.post('/agentsignup',AgentSignup)
agentRoute.get('/verify/:token',Agentverify)
export default agentRoute
