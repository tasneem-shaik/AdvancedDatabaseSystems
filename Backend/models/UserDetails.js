const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserDetailsSchema = new Schema(
  {
    userId: ObjectId,
    userName: String,
    userType: String,
    password: String,
    emailId: String,
    mobileNumber: String,
  },
  { timestamps: true }
);

const UserDetailsModel = mongoose.model("UserDetails", UserDetailsSchema);

module.exports = { UserDetailsModel };
