const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const PaymentDetailsSchema = new Schema(
  {
    paymentId: ObjectId,
    bookingId: String,
    paymentAmount: String,
    paymentType: String,
    // CardNumber: String,
    // ExpiryDate : String,
    // CVV:String
  },
  { timestamps: true }
);

const PaymentDetailsModel = mongoose.model(
  "PaymentDetails",
  PaymentDetailsSchema
);

module.exports = { PaymentDetailsModel };
