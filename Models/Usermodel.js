import mongoose from 'mongoose'



const Schema =mongoose.Schema

const Userschema= new Schema({
    userName:{ type:String},
    email:{  type:String },
    password :{ type:String},
    isVerified :{type:Boolean, default:false},
    verificationToken:{type:String},
    isBlock:{type:Boolean,default:true},
    Otp:{type:String},
    date:{ type:Date, default:Date.now }

})

 export const user=mongoose.model('user',Userschema)

