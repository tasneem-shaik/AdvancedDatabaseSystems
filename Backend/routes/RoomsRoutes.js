const express = require("express");
const router = express.Router();
const RoomDetailsService = require("../services/RoomDetailsService");
const mongodb = require("mongodb");

const { ObjectId } = mongodb;

// Create new room details
router.post("/add/new", async (req, res) => {
  try {
    if (req) {
      const data = req.body;
      const payload = { ...data, roomId: new ObjectId() };
      const saveRes = await RoomDetailsService.AddRoomsService(payload);
      return res.json(saveRes);
    }
    return res.status(400).send(`Something went wrong: ${e}`);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

//Fetch all rooms details
router.get("/fetch/all", async (req, res) => {
  try {
    const roomsDetailsRes = await RoomDetailsService.FetchAllRoomsService();
    if (roomsDetailsRes) {
      return res.json(roomsDetailsRes);
    }
    return res.status(400).json(null);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

//Fetch all rooms details
router.get("/fetch/oneroom/details", async (req, res) => {
  try {
    const { roomId } = req.query;
    const roomsDetailsRes = await RoomDetailsService.FetchOneRoomDetails(
      roomId
    );
    if (roomsDetailsRes) {
      return res.json(roomsDetailsRes);
    }
    return res.status(400).json(null);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

// Update
router.post("/update/details", async (req, res) => {
  try {
    const { bedsCount, roomPrice, roomId } = req.body;
    const roomsDetailsRes = await RoomDetailsService.UpdateRoomsDetails({
      bedsCount,
      roomPrice,
      roomId,
    });
    if (roomsDetailsRes) {
      return res.json(roomsDetailsRes);
    }
    return res.status(400).json(null);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

module.exports = router;
