var ObjectID = require("mongodb").ObjectId;
const mongoose = require("mongoose");

const { BookingDetailsModel } = require("../models/BookingDetails");
const { CustomerDetailsModel } = require("../models/CustomerDetails");
const { PaymentDetailsModel } = require("../models/PaymentDetails");
const { RoomDetailsModel } = require("../models/RoomDetails");
const { ObjectId } = require("mongodb");

const InsertBookingDetails = async (payload) => {
  if (payload) {
    const {
      customerName,
      customerIdentity,
      customerAddress,
      dateOfBirth,
      mobileNumber,
    } = payload;

    const customerDetailsModel = new CustomerDetailsModel({
      customerId: new ObjectID(),
      customerName,
      customerIdentity,
      customerAddress,
      dateOfBirth,
      mobileNumber,
    });

    // save customer details
    let customerResData = await customerDetailsModel.save();

    const { customerId } = JSON.parse(JSON.stringify(customerResData));
    const bookingDetailsModel = new BookingDetailsModel({
      ...payload,
      customerId,
    });

    // save booking details
    let resData = await bookingDetailsModel.save();
    resData = JSON.parse(JSON.stringify(resData));
    if (resData) {
      const { roomId, noOfBeds, bookingId } = resData;

      // save payment details
      const { paymentType, paymentAmount} = payload;

      const paymentDetailsModel = new PaymentDetailsModel({
        paymentId: new ObjectID(),
        bookingId,
        paymentType,
        paymentAmount,
        // ExpiryDate,
        // CVV,
        // CardNumber
      });

      await paymentDetailsModel.save();

      let roomData = await RoomDetailsModel.find({});
      if (roomData) {
        roomData = JSON.parse(JSON.stringify(roomData));
        roomData = roomData.filter((rec) => rec._id === roomId)[0];
        let { bedsAvailable } = roomData;
        bedsAvailable = bedsAvailable - noOfBeds;
        const updateRes = await RoomDetailsModel.updateOne(
          { _id: new ObjectID(roomId) },
          { $set: { bedsAvailable: bedsAvailable } }
        );
        if (updateRes) {
          return { status: 200, response: "Rooms Booked Successfully" };
        }
      }
      return { status: 400, response: "Error in booking rooms" };
    }
    return { status: 400, response: "Error in booking rooms" };
  }

  throw new Error("Booking details not available");
};

const FetchAllBookingDetails = async (pageNo) => {
  let resData = [];
  resData = await BookingDetailsModel.find({});
  resData = JSON.parse(JSON.stringify(resData));

  const returnList = [];
  if (resData && resData.length > 0) {
    for (let key in resData) {
      const { customerId, bookingId } = resData[key];
      let customerDetails = await CustomerDetailsModel.findOne({}).where({
        customerId: customerId,
      });
      let paymentDetails = await PaymentDetailsModel.findOne({}).where({
        bookingId,
      });
      paymentDetails = JSON.parse(JSON.stringify(paymentDetails));
      customerDetails = JSON.parse(JSON.stringify(customerDetails));
      const { customerName, customerIdentity, customerAddress } =
        customerDetails;
      const { paymentAmount, paymentType } = paymentDetails;
      returnList.push({
        ...resData[key],
        customerName,
        customerIdentity,
        customerAddress,
        paymentAmount,
        paymentType,
        // CardNumber,
        // ExpiryDate,
        // CVV
      });
    }
  }
  if (returnList && returnList.length > 0) {
    return {
      status: 200,
      response: returnList,
    };
  }
  return { status: 400, response: "No Booking Details found" };
};

const UpdateBookingDetails = async (bookingId, bookingStatus, checkOutDate) => {
  let resData = await BookingDetailsModel.findById({ bookingId: bookingId });
  resData = JSON.parse(JSON.stringify(resData));
  if (resData && resData.length > 0) {
    resData = await BookingDetailsModel.updateOne({
      bookingStatus: bookingStatus,
      checkOutDate: checkOutDate,
    }).where({ bookingId: bookingId });
    if (resData) {
      return { status: 200, response: "Booking details updated successfully" };
    }
    return { status: 500, response: "Booking details update failed" };
  }
  throw new Error("Booking update details not available");
};

//extend
const UpdateCheckout = async (payload) => {


  
  const { ObjectId } = require('mongoose');

  const id = payload.bookingId // string ID from request body
  const objId = ObjectId(id); // convert string ID to ObjectId
  
  BookingDetailsModel.findById(objId)
    .then((booking) => {
      console.log("obj id here")
      // Do something with the booking object
    })

    .catch((error) => {
      // Handle errors
    });

  // bookingId= payload.bookingId;
  // let resData = await BookingDetailsModel.findById({ bookingId: bookingId });
  // console.log("check 1 ",resData,"*****",payload);

  // resData = JSON.parse(JSON.stringify(resData));
  // console.log("check",resData,"*****",payload)
  // if (resData && resData.length > 0) {
  //   resData = await BookingDetailsModel.updateOne({
  //     bookingStatus: bookingStatus,
  //     // checkOutDate: payload.checkOutDate,
  //     paymentAmount: payload.paymentAmount,
  //     checkOutDate: payload.checkOutDate,
  //     noOfDays: payload.nod,
  //   }).where({ bookingId: bookingId });
  //   if (resData) {
  //     return { status: 200, response: "Booking details updated successfully" };
  //   }
  //   return { status: 500, response: "Booking details update failed" };
  // }
  // throw new Error("Booking update details not available");



};


  
//   console.log("payload in first",payload);
//   const ObjectId = mongoose.Types.ObjectId;
//   // const booking = { bookingId: mongoose.Types.ObjectId(payload.bookingId) };
//   // const bookingId = new ObjectId(payload.bookingId);
//   const bookingId =new ObjectId(payload.bookingId);
//   let resData = await BookingDetailsModel.find({ bookingId: bookingId });
//   resData = JSON.parse(JSON.stringify(resData));
//   console.log("result",resData);
  

//   if (resData && resData.length > 0) {
//     resData = await BookingDetailsModel.updateOne({
//       // paymentAmount: payload.paymentAmount,
//       checkOutDate: payload.checkOutDate,
//       noOfDays: payload.nod,
//     }).where({ bookingId: bookingId });
//     if (resData) {
//       return { status: 200, response: "Booking details updated successfully1111",bookingId };
//     }
//     return { status: 500, response: "Booking details update failed" };
//   }
//   throw new Error("Booking update details not available");
// };

const UpdateBookingStatus = async (updatedStatus, bookingId, checkOutDate) => {
  let resData = null;
  if (checkOutDate) {
    resData = await BookingDetailsModel.updateOne({
      checkOutDate: checkOutDate,
      status: updatedStatus,
    }).where({ bookingId: new ObjectID(bookingId) });
  } else {
    resData = await BookingDetailsModel.updateOne({
      status: updatedStatus,
    }).where({ bookingId: new ObjectID(bookingId) });
  }
  if (resData) {
    resData = await BookingDetailsModel.find({}).where({
      bookingId: new ObjectID(bookingId),
    });
    resData = JSON.parse(JSON.stringify(resData));
    const { noOfBeds, roomId } = resData[0];
    let roomsDetails = await RoomDetailsModel.findOne({}).where({
      _id: new ObjectID(roomId),
    });
    roomsDetails = JSON.parse(JSON.stringify(roomsDetails));
    let { bedsAvailable } = roomsDetails;
    bedsAvailable = Number(bedsAvailable) + Number(noOfBeds);
    await RoomDetailsModel.updateOne({ bedsAvailable }).where({
      _id: new ObjectID(roomId),
    });
    return { status: 200, response: "Rooms Checked out successfully" };
  }

  throw new Error("Something went wrong");
};

module.exports = {
  InsertBookingDetails,
  FetchAllBookingDetails,
  UpdateBookingDetails,
  UpdateCheckout,
  UpdateBookingStatus,
};
