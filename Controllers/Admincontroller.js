import agent from '../Models/Agentmodel.js';
import { category } from '../Models/Categorymodel.js';
import { user } from "../Models/Usermodel.js";
import mongoose from "mongoose";  
import bcrypt from "bcrypt"
import env from 'dotenv';
env.config()





export const Adminlogin = async (req, res) => {
    try {
      const { email, password } = req.body;      
      const hash =await bcrypt.hash(password,10)
      const Pass = await  bcrypt.compare(password,process.env.ADMIN_PASS)
      if ( email === process.env.ADMIN_EMAIL && Pass ) {
        return res.json({ message: 'it is admin', status: true });
      } else {
        console.log("not");
        return res.json({ message: "not admin", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error", success: false });
    }
  };
  
  export const Userlisting = async (req,res)=>{

    try {
        const User = await user.find({})
        return res.json({success:true,User})
        
    } catch (error) {
        console.log(error);
    }
  }


  export const Agentlisting = async (req,res)=>{

    try {
        const Agent = await agent.find({})
        return res.json({success:true,Agent})
        
    } catch (error) {
        console.log(error);
    }
  }


  export const Blockagent = async (req, res) => {
    try {
        const id  = req.body._id; 
        console.log(id, "params");

        const objectId = new mongoose.Types.ObjectId(id);

        const Agent = await agent.findOne({ _id: objectId });
    
    console.log(Agent,'0OOOOO');
        if (Agent.isBlock == "true") {
    console.log('0OOO9999OO');

          const newData = await agent.updateOne(
            { _id: objectId },
            { $set: { isBlock: false } }
          );
          res.json({
            newData,
            status: true,
            alert: "agent Blocked",
          });
        } else {
          const newData = await agent.updateOne(
            { _id: objectId },
            { $set: { isBlock: true } }
          );
          res.json({
            newData,
            status: true,
            alert: "Unblocked agent",
          });
        }
    } catch (error) {
      res.status(500).json({ alert: "Internal Server Error" });    }
};






  export const Blockuser = async (req, res) => {
    try {
        const id  = req.body._id; 
        console.log(id, "params");

        const objectId = new mongoose.Types.ObjectId(id);

        const User = await user.findOne({ _id: id });
    
    console.log(User,'0OOOOO');
        if (User.isBlock ==true) {
    console.log('0OOO9999OO');

          const newData = await user.updateOne(
            { _id: objectId },
            { $set: { isBlock: false } }
          );
          res.json({
            newData,
            status: true,
            alert: "User Blocked",
          });
        } else {
          const newData = await user.updateOne(
            { _id: objectId },
            { $set: { isBlock: true } }
          );
          res.json({
            newData,
            status: true,
            alert: "Unblocked User",
          });
        }
    } catch (error) {
      res.status(500).json({ alert: "Internal Server Error" });    }
};


export const  agentapprovallisting =async(req,res)=>{
  try {
    const Agent = await agent.find({})
    return res.json({success:true,Agent})
    
} catch (error) {
    console.log(error);
}
}

export const agentreject= async (req,res)=>{

try {
  const id = req.body._id
  const Agent = await agent.findOne({ _id: id });

    if(agent){
      const newAgent = await agent.updateOne(
        { _id: id },
        { $set: { Approval: !Agent.Approval } }
      );
  
      res.status(200).json({
        newAgent,
        status: true,
        alert: "Done.",
      });
    }else{
      res.json({
        newAgent,
        status: false,
        alert: "user not found",
      });
    }
  


} catch (error) {
  res.status(500).json({ alert: "Internal Server Error" });    }

}

export const Addcatgeory= async (req,res)=>{
  try {
      const { Name } = req.body;
      console.log(Name,"pop");
      const newCategory = new category({ 
        Name: Name
      });
      console.log(newCategory,"0");
      newCategory.save();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });    

  }
}
