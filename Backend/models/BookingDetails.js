const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const BookingDetailsSchema = new Schema(
  {
    bookingId: ObjectId,
    customerId: String,
    roomId: String,
    bookingStatus: String,
    noOfBeds: Number,
    noOfDays: Number,
    checkInDate: Date,
    checkOutDate: Date,
    status: { type: String, default: "Booked" },
    bedsBooked: Number,
  },
  { timestamps: true }
);

const BookingDetailsModel = mongoose.model(
  "BookingHistory",
  BookingDetailsSchema
);

module.exports = { BookingDetailsModel };
