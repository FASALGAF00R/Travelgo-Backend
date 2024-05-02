import mongoose from 'mongoose'

const Schema = mongoose.Schema
const bookingSchema = new Schema(
  {
    phone: {
      type: Number,
    },
    address: {
      address: String,
      city: String,
      state: String,
      country: String,
    },
    Amount: {
      type: Number,
    },
    agentId: {
      type: String,
    },
    userId: {
      type: String,
    },
    packageId: {
        type: String,
      },
    bookingStatus: {
        type: String,
        default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;