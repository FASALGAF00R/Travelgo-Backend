const user = require('../Models/Usermodel')
const {createSecretToken} = require ('../Util/SecretToken')

const bcrypt =require('bcrypt')

const loadSignup = async (req,res)=>{
    console.log("6");
    try{
    const  User=await user.findOne({email:req.body.email})
    if(User){
        return res.json({message:"user already exisist !"})
    }else{
    const newuser = new user ({
        userName : req.body.userName,
        email : req.body.email,
        phone:req.body.phone,
        password:req.body.password
    })
    newuser.save()
    console.log(newuser,"7");

    const token = createSecretToken(newuser._id);
    console.log(token,"lllllllllll");
    res.cookie('tokken',token,{
        withCredentials: true,
        httpOnly: false,
    });
    res.status(201).json({message:'user signed succesfully',success:true,newuser})
    }
}catch(error){
console.error(error);
    }
}


const loadLogin =async (req,res)=>{
try {
    console.log("pppppppppp");
    const{email,password}=req.body
    if(!email || !password){
        return res.json({message:"All fields are required "})
    }

    const Data =await user.findOne({email})
    console.log(Data,"data");
if(!Data){
    return res.json({message:"email or password is incorrect"})
}

const auth =await bcrypt.compare(password,Data.password)
console.log(auth,"ppppadword");
if(!auth){
    return res.json({message:"incorrect password"})
}else{
    console.log("true");
const token =createSecretToken(Data._id);
console.log(token,"login token");
res.cookie("token",token,{
    withCredentials: true,
    httpOnly: false,
})
res.status(201).json({message:"User logged succesfulluy",success:true})
}
} catch (error) {
    console.log(error);
}
}






module.exports={
    loadSignup,
    loadLogin
}