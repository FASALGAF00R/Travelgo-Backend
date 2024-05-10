import mongoose from 'mongoose'

const Schema = mongoose.Schema

const reviewSchema = new Schema({
        date: {
            type: Date,
            default: Date.now,
        },
        content: {
            type: String,
        },
        rating: {
            type: String,
        },
        userid: {
            type: String,
        },
        packageid: {
            type: String,
        },
        agentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    });

export const Review = mongoose.model("Review", reviewSchema);
