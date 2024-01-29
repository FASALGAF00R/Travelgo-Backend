import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema =mongoose.Schema

const Agentschema= new Schema({
    userName:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    phone: {
        type: Number,
        unique:true,

    },

    password :{
        type:String,
        required:true,
    },


    isVerified :{
        type:Boolean,
        default:false
    },

    isBlock:{
        type:Boolean,
        default:true,
    },

    verificationToken:{
        type:String,
    },

    Approval:{type:Boolean,default:false},

    date:{
        type:Date,
        default:Date.now,
    },
    
});



const agent=mongoose.model('agent',Agentschema)
export default agent
