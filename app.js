// backend entry point
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();




const app=express()

app.use(cookieParser());
app.use(cors({
   origin:process.env.USER_FRONTEND_URL,
   methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
   credentials: true,
   allowedHeaders: ['Content-Type', 'Authorization'] 
}))


app.use(express.json())



mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("Connected to the database"))
.catch(err => console.error(`Connection error: ${err}`));

console.log("fdhkjbgfjhbgfjdbjgb");

console.log( {
   mongo: process.env.DATABASE_URL,
   user:process.env.USER_FRONTEND_URL

}



);


//  routes
import userRoutes from './Routes/userRoutes.js'
import agentRoute from './Routes/agentRoutes.js';
import adminRoute from './Routes/adminRoutes.js';



app.use('/',userRoutes)
app.use('/agent',agentRoute)
app.use('/admin',adminRoute)



app.listen(process.env.PORT,()=>{console.log('port running on 3001')})


