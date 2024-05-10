import mongoose from "mongoose";
const Schema = mongoose.Schema

const Packageschema = new Schema({
    agentid:{type:String},
    State:{ type: String},
    Destrictname: { type: String},
    Image: [{ type: String}],
    category: { type: String},
    details: { type: String},
    activites: [{ type: String}],
    amount: { type: Number},
    perDAy:{ type: String},
    isBlock: { type: Boolean,default: true},    
},
{timestamps: true  })


 export const Package=mongoose.model('Package',Packageschema)