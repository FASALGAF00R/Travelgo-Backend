import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Activityschema = new Schema({
  agentid:{type:String},
  Activity : { type: String},
  isBlock:{ type: Boolean,default: true}

},
  { timestamps: true }
);

 export const Activity = mongoose.model('activity',Activityschema)