import express from 'express'
import { 
Adminlogin
 } from "../Controllers/Admincontroller.js";

const adminRoute=express.Router()
adminRoute.post('/login',Adminlogin)

export  default adminRoute