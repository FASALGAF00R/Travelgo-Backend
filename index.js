// backend entry point
import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
const { connect, connection } = mongoose;
import env from 'dotenv';

env.config()
const app=express()
import cookieParser from "cookie-parser";


app.use(cookieParser());
app.use(cors())
app.use(json())


app.use(
  cors({
    origin: ["http://localhost:3000"],
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


// user routes
import userRoutes from './Routes/userRoutes.js'

app.use('/',userRoutes)



app.listen(port,()=>{console.log('port runnin on 3000')})


