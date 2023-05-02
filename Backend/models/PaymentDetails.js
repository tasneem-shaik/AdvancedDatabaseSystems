const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const PaymentDetailsSchema = new Schema(
  {
    paymentId: ObjectId,
    bookingId: String,
    paymentAmount: String,
    paymentType: String,
    cardNumber: String,
    expiryDate : String,
    cVV:String
  },
  { timestamps: true }
);

const PaymentDetailsModel = mongoose.model(
  "PaymentDetails",
  PaymentDetailsSchema
);

module.exports = { PaymentDetailsModel };
