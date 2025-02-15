import mongoose from 'mongoose'

const Schema = mongoose.Schema
const bookingSchema = new Schema(
  {phone: {type: Number},
  address: {address: String,
      city: String,
      state: String,
      country: String,
    },
    Amount:{type: Number},
    agentId: {type: String},
    userId: {type: String},
    packageId: {type: String},
    Date: {type: Date},
    Amount: {type: Number},
    bookingStatus: {type: String,default: "success"},
    isCanceled: {type: Boolean,default: false},
    payment_type: {type: String,default: "stripe"}},
  {timestamps: true,}
);

export const Booking = mongoose.model("Booking", bookingSchema);

