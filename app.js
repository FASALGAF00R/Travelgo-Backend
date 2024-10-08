// backend entry point
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
const { connect } = mongoose;
import env from 'dotenv';

env.config()



const app=express()

app.use(cookieParser());
app.use(cors({
   origin: "http://localhost:5173" ,
   methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
   credentials: true,
}))


app.use(express.json())

const port =3001

connect(process.env.DATABASE_URL)
.then(()=>{
   console.log("connected to the database")
})
.catch((err)=>{console.log(`connection error ${err}`)})


//  routes
import userRoutes from './Routes/userRoutes.js'
import agentRoute from './Routes/agentRoutes.js';
import adminRoute from './Routes/adminRoutes.js';



app.use('/',userRoutes)
app.use('/agent',agentRoute)
app.use('/admin',adminRoute)



app.listen(port,()=>{console.log('port running on 3001')})


