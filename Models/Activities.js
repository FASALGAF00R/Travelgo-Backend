import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Activityschema = new Schema({
  Activity : { type: String}},
  { timestamps: true }
);

 export const Activity = mongoose.model('activity',Activityschema)