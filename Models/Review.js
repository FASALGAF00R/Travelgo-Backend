import mongoose from 'mongoose'

const Schema = mongoose.Schema

const reviewSchema = new Schema({
        date: {type: Date,default: Date.now, },
        userName: {type: String},
        content: { type: String},
        rating: {type: Number},
        userid: { type: String},
        packageid: { type: String},
        agentId: {type: String}},
    {timestamps: true});

export const Review = mongoose.model("Review", reviewSchema);
