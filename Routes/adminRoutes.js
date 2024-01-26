import express from 'express'
import { 
Adminlogin,
Userlisting,
Blockuser,
Agentlisting,
Blockagent,
agentapprovallisting,
agentreject
 } from "../Controllers/Admincontroller.js";

const adminRoute=express.Router()
adminRoute.post('/login',Adminlogin)
adminRoute.get('/users',Userlisting)
adminRoute.get('/agents',Agentlisting)
adminRoute.put('/blockuser',Blockuser)
adminRoute.put('/blockagent',Blockagent)
adminRoute.get('/agentapproval',agentapprovallisting)
adminRoute.put('/reject',agentreject)
export  default adminRoute