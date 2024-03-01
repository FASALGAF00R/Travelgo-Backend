import mongoose from 'mongoose'

const Schema =mongoose.Schema

const Agentschema= new Schema({
    userName:{type:String},
    email:{type:String},
    phone: {type: Number},
    password :{type:String},
    isVerified :{type:Boolean},
    isBlock:{type:Boolean},
    verificationToken:{type:String},
    Approval:{type:Boolean,default:false},
    Otp:{type:String}},
    {timestamps: true });

const agent=mongoose.model('agent',Agentschema)
export default agent
