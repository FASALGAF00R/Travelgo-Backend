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
        unique:true
    },

    phone: {
        type: Number,
        required: true,

    },

    password :{
        type:String,
        required:true,
    },

    isVerified :{
        type:Boolean,
        default:false
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
