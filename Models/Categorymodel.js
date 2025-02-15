import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    Name: { type: String },
    isBlock:{type:Boolean,default:true},
 } )

export const category=mongoose.model('category',CategorySchema)
