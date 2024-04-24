import agent from '../Models/Agentmodel.js';
import { category } from '../Models/Categorymodel.js';
import { user } from "../Models/Usermodel.js";
import {destination} from '../Models/Admindestinations.js'
import { createSecretToken } from '../Util/SecretToken.js'
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import env from 'dotenv';
env.config()


export const Adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const  accesToken = createSecretToken();
      res.status(200).json({ message: "admin logged succesfully", success: true, accesToken })
    } else {
      return res.json({ message: "not admin", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const Userlisting = async (req, res) => {

  try {
    const User = await user.find({})
    return res.json({ success: true, User })

  } catch (error) {
    console.log(error);
  }
}


export const Agentlisting = async (req, res) => {
  try {
    const Agent = await agent.find({})
    return res.json({ success: true, Agent })

  } catch (error) {
    console.log(error);
  }
}


export const Blockagent = async (req, res) => {
  try {
    const id = req.body._id;;
    const Agent = await agent.findById(id);
    if (Agent.isBlock === true) {
      const newData = await agent.updateOne(
        { _id: id },
        { $set: { isBlock: false } }
      );
      res.json({
        status: false,
        message: "agent Blocked",
      });
    } else {
      const newData = await agent.updateOne(
        { _id: id },
        { $set: { isBlock: true } }
      );
      res.json({
        status: true,
        message: "Unblocked agent",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};






export const Blockuser = async (req, res) => {
  try {
    const id = req.body._id;
    console.log(id, "params");

    const objectId = new mongoose.Types.ObjectId(id);

    const User = await user.findOne({ _id: id });

    console.log(User, '0OOOOO');
    if (User.isBlock == true) {
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
    res.status(500).json({ alert: "Internal Server Error" });
  }
};


export const agentapprovallisting = async (req, res) => {
  try {
    const Agent = await agent.find({})
    return res.json({ success: true, Agent })

  } catch (error) {
    console.log(error);
  }
}



export const agentaccept = async (req, res) => {

  try {

    const { _id, option } = req.body
    console.log(option, "opooo");
    const Agent = await agent.findById(_id);

    if (Agent && option === 'Accept') {
      const newAgent = await agent.updateOne(
        { _id },
        { $set: { isActive: option } }
      );

      res.status(200).json({
        newAgent,
        status: true,
        message: option
      });
    } else {
      const newAgent = await agent.updateOne(
        { _id },
        { $set: { isActive: option } }
      );

      res.status(200).json({
        newAgent,
        status: false,
        message: option
      });

    }


  } catch (error) {
    res.status(500).json({ alert: "Internal Server Error" });
  }

}






export const Addcatgeory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new category({
      Name: categoryName
    });
    newCategory.save();
    return res.status(200).json({ success: true, newCategory })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });

  }
}

export const getcatgeory = async (req, res) => {
  try {
    const Category = await category.find({})
    return res.json({ success: true, Category })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}




export const Blockcategory = async (req, res) => {
  try {
    const id = req.body._id;
    console.log(id, "paramsnnnhh");


    const Cat = await category.findOne({ _id: id });

    console.log(Cat, '0OOOOO');
    if (Cat.isBlock == true) {
      console.log('0OOO9999OO');

      const newData = await category.updateOne(
        { _id: id },
        { $set: { isBlock: false } }
      );
      res.json({
        newData,
        status: true,
        alert: "category Blocked",
      });
    } else {
      const newData = await category.updateOne(
        { _id: id },
        { $set: { isBlock: true } }
      );
      res.json({
        newData,
        status: true,
        alert: "Unblocked category",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};





export const Editcategory = async (req, res) => {
  const id = req.params.id;
  const newcategory=req.body.editedcat;
  try {
    const Foundcategory = await category.findByIdAndUpdate(id, { $set: {Name:newcategory} });
    if (!Foundcategory) {
        return res.status(400).json({ message: "Activity not found" });
    } else {
        await foundActivity.updateOne({ Name: newcategory });
        return res.status(201).json({ message: 'Updated Successfully ',success: true });
    }
    

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });

  }

}



export const admindestinations = async (req, res) => {
  try {
      console.log("haa");
      const { Destrictname, State } = req.body
      const Placedata = new destination({
         State: State,
         Destrictname: Destrictname,
      })
      const Savedplace = await Placedata.save()
      return res.status(200).json({ succes: true, place: Savedplace })
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });

  }

}