const mongoose= require('mongoose')
const bcrypt=require('bcrypt')

const Schema =mongoose.Schema

const Userschema= new Schema({
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

Userschema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
  });
  


const user=mongoose.model('user',Userschema)

module.exports=user