const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/UserRoutes");
const RoomsRoutes = require("./routes/RoomsRoutes");
const BookingRoutes = require("./routes/BookingRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

async function main() {
  await mongoose
    .connect("mongodb+srv://Admin:Admin123@cluster0.ddrarlt.mongodb.net/hostel")
    .then((log) => console.log("Connected to Database"));
}

main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json("Welcome to Hotel Management system");
});

app.use("/user", UserRoutes);
app.use("/rooms", RoomsRoutes);
app.use("/booking", BookingRoutes);

app.listen(3001, () => {
  console.log("Listening in Port 3001");
});
