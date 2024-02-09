// backend entry point
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
const { connect, connection } = mongoose;
import env from 'dotenv';
import path from 'path'



env.config()
const app=express()

app.use(cookieParser());
 app.use(cors({
    origin: "http://localhost:5173" ,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  }))


app.use(express.json())

const port =3000

connect('mongodb://localhost:27017/travelgo')
const db=connection

db.once('open',()=>{
    console.log("database connected succesfully")
})


//  routes
import userRoutes from './Routes/userRoutes.js'
import agentRoute from './Routes/agentRoutes.js';
import adminRoute from './Routes/adminRoutes.js';





app.use('/',userRoutes)
app.use('/agent',agentRoute)
app.use('/admin',adminRoute)



app.listen(port,()=>{console.log('port runnin on 3000')})


