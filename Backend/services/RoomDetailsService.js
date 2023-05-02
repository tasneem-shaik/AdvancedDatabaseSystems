const { ObjectId } = require("mongodb");
const { RoomDetailsModel } = require("../models/RoomDetails");

const AddRoomsService = async (payload) => {
  if (payload) {
    const roomDetailsModel = new RoomDetailsModel(payload);
    let res = await roomDetailsModel.save();
    res = JSON.parse(JSON.stringify(res));
    if (res) {
      return { status: 200, response: res };
    }
    return { status: 400, response: null };
  }

  throw new Error("Unable to add new rooms");
};

const FetchAllRoomsService = async () => {
  let resData = await RoomDetailsModel.find({});
  resData = JSON.parse(JSON.stringify(resData));
  if (resData && resData.length > 0) {
    return resData;
  }
  return null;
};

const FetchOneRoomDetails = async (roomId) => {
  let resData = await RoomDetailsModel.findOne({ _id: new ObjectId(roomId) });
  resData = JSON.parse(JSON.stringify(resData));
  if (resData) {
    return resData;
  }
  return null;
};

const UpdateRoomCountService = async (roomId, bookedCount) => {
  let resData = await RoomDetailsModel.findById({ roomId: roomId });
  resData = JSON.parse(JSON.stringify(resData));
  if (resData && resData.length > 0) {
    let { bedsAvailable } = resData[0];
    bedsAvailable = bedsAvailable - bookedCount;
    await RoomDetailsModel.updateOne({ bedsAvailable: bedsAvailable }).where({
      roomId: roomId,
    });
    return { status: 200, response: "Updated Successfully" };
  }
  throw new Error("No Room details available");
};

const UpdateRoomsDetails = async (payload) => {
  const { bedsCount, roomPrice, roomId } = payload;
  let resData = await RoomDetailsModel.findOne({ _id: new ObjectId(roomId) });
  resData = JSON.parse(JSON.stringify(resData));
  if (resData) {
    if (bedsCount) {
      await RoomDetailsModel.updateOne({ bedsAvailable: bedsCount }).where({
        _id: new ObjectId(roomId),
      });
    }
    if (roomPrice) {
      await RoomDetailsModel.updateOne({ price: roomPrice }).where({
        _id: new ObjectId(roomId),
      });
    }
    return { status: 200, response: "Updated Successfully" };
  }
  throw new Error("No Room details available");
};

module.exports = {
  AddRoomsService,
  FetchAllRoomsService,
  UpdateRoomCountService,
  FetchOneRoomDetails,
  UpdateRoomsDetails,
};
