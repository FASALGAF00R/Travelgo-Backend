import mongoose from 'mongoose'

const Schema =mongoose.Schema

const Userschema= new Schema({
    userName:{ type:String},
    email:{  type:String },
    password :{ type:String},
    isVerified :{type:Boolean, default:false},
    verificationToken:{type:String},
    isBlock:{type:Boolean,default:true},
    image:{type:String},
    Otp:{type:String},
    date:{ type:Date, default:Date.now }},
    {timestamps: true })

 export const user=mongoose.model('user',Userschema)

