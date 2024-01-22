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
        required: true,
        unique:true,

    },

    password :{
        type:String,
        required:true,
    },

    
    ConfirmPassword :{
        type:String,

    },

    isVerified :{
        type:Boolean,
        default:false
    },

    isBlock:{
        type:String,
        default:true,
    },

    verificationToken:{
        type:String,
    },

    date:{
        type:Date,
        default:Date.now,
    }

})

Agentschema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
  });
  


const agent=mongoose.model('agent',Agentschema)
export default agent
