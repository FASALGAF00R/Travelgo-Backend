import express from 'express'
import { 
Adminlogin,
Userlisting,
Blockuser,
Agentlisting,
Blockagent,
agentapprovallisting,
agentaccept,
Addcatgeory,
getcatgeory,
Blockcategory,
Editcategory,
admindestinations
 } from "../Controllers/Admincontroller.js";
 import {userVerification} from '../Middlewares/AuthMiddleware.js'

const adminRoute=express.Router()
adminRoute.post('/login',Adminlogin)
adminRoute.get('/users',userVerification,Userlisting)
adminRoute.get('/agents',userVerification,Agentlisting)
adminRoute.put('/blockuser',userVerification,Blockuser)
adminRoute.put('/blockagent',userVerification,Blockagent)
adminRoute.get('/agentapproval',userVerification,agentapprovallisting)
adminRoute.put('/accept',userVerification,agentaccept)
adminRoute.post('/catgeory',userVerification,Addcatgeory)
adminRoute.get('/getcatgeory',userVerification,getcatgeory)
adminRoute.put('/blockcat',userVerification,Blockcategory)
adminRoute.put('/editcat/:id',userVerification,Editcategory)
adminRoute.post('/destination',userVerification,admindestinations)


export  default adminRoute