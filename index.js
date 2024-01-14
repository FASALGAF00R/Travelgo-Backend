// backend entry point

const express = require ('express')
const cors = require('cors')
const mongoose = require ('mongoose')
require("dotenv").config();
const app=express()

app.use(cors())
app.use(express.urlencoded());

app.use(express.json())


app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)
  
const port =3000

mongoose.connect('mongodb://localhost:27017/travelgo')
const db=mongoose.connection

db.once('open',()=>{
    console.log("database connected succesfully")
})


// user routes
const userRoutes= require('./Routes/userRoutes')
app.use('/',userRoutes)




app.listen(port,()=>{console.log('port runnin on 3000')})


