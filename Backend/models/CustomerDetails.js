const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const CustomerDetailsSchema = new Schema(
  {
    customerId: ObjectId,
    customerName: String,
    customerAddress: String,
    customerIdentity: String,
    dateOfBirth: String,
    mobileNumber: String,
  },
  { timestamps: true }
);

const CustomerDetailsModel = mongoose.model(
  "CustomerDetails",
  CustomerDetailsSchema
);

module.exports = { CustomerDetailsModel };
