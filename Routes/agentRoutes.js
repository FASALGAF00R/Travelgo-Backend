import express from 'express'

import { 
    AgentSignup ,
    Agentverify
} from '../Controllers/Agentcontroller.js'

const agentRoute =express.Router()

// agent routes
agentRoute.post('/agentsignup',AgentSignup)
agentRoute.get('/verify/:token',Agentverify)
export default agentRoute
