
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    Destrictname: { type: String },
    Description: { type: String },
    Image: { type: String }},
    {timestamps: true  })

export const Place=mongoose.model('places',PlaceSchema)


