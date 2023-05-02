const express = require("express");
const router = express.Router();
const UserDetailsService = require("../services/UserDetailsService");
const mongodb = require("mongodb");

const { ObjectId } = mongodb;

// Create new user
router.post("/create", async (req, res) => {
  try {
    if (req) {
      const data = req.body;
      const payload = { ...data, userId: new ObjectId() };
      const saveRes = await UserDetailsService.CreateNewUserService(payload);
      return res.json(saveRes);
    }
    return res.status(400).send(`Something went wrong: ${e}`);
  } catch (e) {
    return res.status(500).send(`Something went wrong: ${e}`);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    if (req) {
      const data = req.body;
      const loginRes = await UserDetailsService.LoginUserService({ ...data });
      if (loginRes && loginRes.status === 200) {
        const { userName, userType } = loginRes.response;
        return res.json({ userName, userType, msg: "LoggedIn Successfully" });
      }
      return res.status(204).send(`Login In Credentails not found`);
    }
  } catch (e) {
    return res.status(400).send(`Something went wrong: ${e}`);
  }
});

module.exports = router;
