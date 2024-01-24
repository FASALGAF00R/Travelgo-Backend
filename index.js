// backend entry point
import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
const { connect, connection } = mongoose;
import env from 'dotenv';

env.config()
const app=express()


app.use(cookieParser());
app.use(cors())
app.use(json())


app.use(
  cors({
    origin: [process.env.BACKEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)
  
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


