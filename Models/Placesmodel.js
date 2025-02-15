
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    agentid:{type:String},
    State:{ type: String },
    Destrictname: { type: String },
    Description: { type: String },
    Image: { type: String },
    isBlock: { type: Boolean,default: true}
},
    {timestamps: true  })

export const Place=mongoose.model('places',PlaceSchema)


