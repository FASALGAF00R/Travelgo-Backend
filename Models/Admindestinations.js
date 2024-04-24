import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
    State: { type: String },
    Destrictname: { type: String },
    isBlock:{type:Boolean,default:true},
 } )

export const destination=mongoose.model('destination',DestinationSchema)