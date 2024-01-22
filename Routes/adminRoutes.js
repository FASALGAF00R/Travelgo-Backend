import express from 'express'
import { 
Adminlogin,
Userlisting,
Blockuser,
Agentlisting,
Blockagent
 } from "../Controllers/Admincontroller.js";

const adminRoute=express.Router()
adminRoute.post('/login',Adminlogin)
adminRoute.get('/users',Userlisting)
adminRoute.get('/agents',Agentlisting)
adminRoute.put('/blockuser',Blockuser)
adminRoute.put('/blockagent',Blockagent)
export  default adminRoute