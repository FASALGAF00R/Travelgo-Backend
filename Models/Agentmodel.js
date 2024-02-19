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
    date:{type:Date,default:Date.now,}},
    {timestamps: true });

const agent=mongoose.model('agent',Agentschema)
export default agent
