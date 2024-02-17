
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    Placename: { type: String },
    Description: { type: String },
    Image: { type: String },

}, { timeStamp:true })

export const place=mongoose.model('places',PlaceSchema)


