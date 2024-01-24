import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const Schema =mongoose.Schema

const Userschema= new Schema({
    userName:{ type:String,  required:true,},
 
    email:{  type:String,  required:true },

    password :{ type:String,  required:true,},

    ConfirmPassword :{ type:String,},

    isVerified :{type:Boolean, default:false},

    verificationToken:{type:String},

    isBlock:{type:String,default:true},

    isGoogle:{type:Boolean,default:false},

    date:{ type:Date, default:Date.now }

})

Userschema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
  });
  


 export const user=mongoose.model('user',Userschema)

