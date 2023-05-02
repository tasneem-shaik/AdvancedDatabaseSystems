const express = require("express");
const router = express.Router();
const BookingDetailsService = require("../services/BookingDetailsService");
const mongodb = require("mongodb");

const { ObjectId } = mongodb;

// Insert booking details
router.post("/new/details", async (req, res) => {
  try {
    if (req) {
      const data = req.body;
      const payload = { ...data, bookingId: new ObjectId() };
      const saveRes = await BookingDetailsService.InsertBookingDetails(payload);
      return res.json(saveRes);
    }
    return res.status(400).send(`Something went wrong: ${e}`);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

router.get("/details", async (req, res) => {
  try {
    if (req) {
      const { pageNo } = req.query;
      const dataRes = await BookingDetailsService.FetchAllBookingDetails(
        pageNo
      );
      return res.json(dataRes);
    }
    return res.status(400).send(`Something went wrong: ${e}`);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

// Checkout
router.post("/room/checkout", async (req, res) => {
  try {
    if (req) {
      const { bookingId, checkoutDate } = req.body;
      const dataRes = await BookingDetailsService.UpdateBookingStatus(
        "Checked Out",
        bookingId,
        checkoutDate
      );
      return res.json(dataRes);
    }
    return res.status(400).send(`Something went wrong: ${e}`);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

// Cancel
router.get("/room/cancel", async (req, res) => {
  try {
    if (req) {
      const { bookingId } = req.query;
      const dataRes = await BookingDetailsService.UpdateBookingStatus(
        "Cancelled",
        bookingId,
        null
      );
      return res.json(dataRes);
    }
    return res.status(400).send(`Something went wrong: ${e}`);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

module.exports = router;
