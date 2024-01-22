import agent from '../Models/Agentmodel.js';
import { user } from "../Models/Usermodel.js";
import mongoose from "mongoose";

export const Adminlogin = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (name === process.env.ADMIN_NAME && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
        return res.json({ message: 'it is admin', status: true });
      } else {
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

        const User = await user.findOne({ _id: objectId });
    
    console.log(User,'0OOOOO');
        if (User.isBlock == "true") {
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
