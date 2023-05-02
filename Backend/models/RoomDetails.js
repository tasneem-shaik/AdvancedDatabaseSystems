const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoomDetailsSchema = new Schema(
  {
    roomId: ObjectId,
    order: Number,
    roomName: String,
    roomSize: String,
    roomType: String,
    price: String,
    bedsAvailable: Number,
    beds: [String],
  },
  { timestamps: true }
);

const RoomDetailsModel = mongoose.model("RoomDetails", RoomDetailsSchema);

module.exports = { RoomDetailsModel };
