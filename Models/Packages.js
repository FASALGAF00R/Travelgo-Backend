import mongoose from "mongoose";
const Schema = mongoose.Schema

const Packageschema = new Schema({
    State:{ type: String},
    Destrictname: { type: String},
    Image: { type: String},
    category: { type: String},
    details: { type: String},
    activites: [{ type: String}],
    amount: { type: Number},
})

 export const Package=mongoose.model('Package',Packageschema)