import React, { useEffect, useState } from "react";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import StreetviewOutlinedIcon from "@mui/icons-material/StreetviewOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import Button from "@mui/material/Button";
import "../styles/roomDetail.css";
import Premium from "../assets/Club Room.jpg";
import Executive_Premium_Room from "../assets/Park View Suite.jpg";
import Towers_Double_Suite from "../assets/uni.jpg";
import Park_View_Suite from "../assets/Executive Club Room.jpg";
import { Box, Modal, Snackbar, TextField } from "@mui/material";
import axios from "axios";

const RoomDetails = ({
  details,
  handleModalOpen,
  resetData,
  fetchAllDetails,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEOpen, setIsModalEOpen] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0);
  const [searchName, setSearchName] = useState(0);
  const [custName, setcustName] = useState("");
  const [nod, setNod] = useState(0);
  const [unitprice, setunitPriceNod] = useState(0);
  const [bedsCount, setBedsCount] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setresponse] = useState([]);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleClose = () => {
    setIsModalOpen(false);
    setIsModalEOpen(false);
    setcustName("");
  };

  const handleUpdateDetails = (roomId) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };
  const handleSearchName = (val) => {
    setSearchName(val);
    const bookingObj = response.find((obj) => obj.bookingId === val);

    if (bookingObj) {
      setcustName(bookingObj.customerName);
    } else {
      setSnackBarMessage("No Booking id found");
      setOpenSnackBar(true);
    }
  };
  const handleExtend = (roomId, price) => {
    setSelectedRoomId(roomId);
    setIsModalEOpen(true);
    setunitPriceNod(price);
    axios
      .get(`http://localhost:3001/booking/details?pageNo=${1}`)
      .then((res) => {
        if (res && res.data.status === 200 && res.data.response.length > 0) {
          console.log("response in 51", res.data.response);
          setresponse(res.data.response);
        }
      })
      .catch((err) => console.log(err));
  };

  const updateDetais = () => {
    if (roomPrice || bedsCount) {
      axios
        .post("http://localhost:3001/rooms/update/details", {
          roomId,
          roomPrice,
          bedsCount,
        })
        .then((res) => {
          if (res && res.data) {
            setSnackBarMessage("Details updated Successfully");
            setOpenSnackBar(true);
            setIsModalOpen(false);
            fetchAllDetails();
          }
        });
    } else {
      setSnackBarMessage("Enter atleast one detail");
      setOpenSnackBar(true);
    }
  };
  const searchDetails = () => {
    var newDate;
    let bookingId;
    console.log("+++++++",searchName);
    if (searchName) {
      console.log("hello sname", response);
      const bookingObj = response.find((obj) => obj.bookingId === searchName);

      if (bookingObj) {
        const checkoutDate = bookingObj.checkOutDate;
        setcustName(bookingObj.customerName);
        bookingId = bookingObj.bookingId;
        console.log(checkoutDate); // "2023-05-18T05:00:00.000Z"
        const startDate = new Date(checkoutDate);
        startDate.setUTCDate(startDate.getUTCDate() + parseInt(nod));
        newDate = startDate;
        console.log(newDate);
        console.log("new date", newDate); // "2023-05-18T05:00:00.000Z"
      } else {
        setSnackBarMessage("Booking not found for customer name");
      }
      const payload = {
        customerName: searchName,
        nod: nod,
        bookingId: bookingId,
        checkOutDate: newDate,
        paymentAmount: unitprice * nod,
        status: "Booked",
      };
      axios
        .post("http://localhost:3001/booking/extend", {
          payload,
          bookingId,
        })
        .then((res) => {
          if (res) {
            setcustName("");
            setSnackBarMessage("Details updated Successfully");
            setOpenSnackBar(true);
            setIsModalEOpen(false);
            handleClose();
          }
        });
    } else {
      setcustName("");
      setIsModalEOpen(false);
      setSnackBarMessage("No Booking ID found");
      setOpenSnackBar(true);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 480,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

  const {
    roomId,
    roomName,
    roomType,
    roomSize,
    bedType,
    viewType,
    price,
    beds,
    bedsAvailable,
  } = details;

  const amenitiesDetails = [
    "Breakfast Included",
    "AC Rooms",
    "Purified Drinking water",
    "In House Doctor",
  ];

  const getImg = (roomType) => {
    let imgName = Premium;
    // console.log("case,",roomType);
    switch (parseInt(roomType, 10)) {
      case 1:
        imgName = Premium;
        break;
      case 2:
        imgName = Executive_Premium_Room;
        break;
      case 3:
        imgName = Towers_Double_Suite;
        break;
      case 4:
        imgName = Park_View_Suite;
        break;
      default:
        imgName = Premium;
    }
    return imgName;
  };

  return (
    <div key={roomId} className="detailsContainer">
      <div>
        {roomName && (
          <img
            style={{
              height: "300px",
              width: "300px",
              borderRadius: "15px",
              boxShadow: "24",
            }}
            alt={`${roomName}`}
            src={getImg(roomType)}
          ></img>
        )}
      </div>
      <div>
        <div className="roomNameClass">
          <p>{roomName}</p>
        </div>
        <div className="roomDescriptionClass">
          <div className="descContainer">
            <div className="iconClass">
              <CropOutlinedIcon className="iconbase" fontSize="large" />
            </div>
            <div className="descClass">
              <h4>Size</h4>
              <p className="valueClass">{`${roomSize} SqFt`}</p>
            </div>
          </div>
          <div className="descContainer">
            <div className="iconClass">
              <BedOutlinedIcon className="iconbase" fontSize="large" />
            </div>
            <div className="descClass">
              <h4>Type</h4>
              <p className="valueClass">{roomType}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="secondPartGrid">
        <div style={{ display: "flex" }}>
          <h3 style={{ marginTop: "23px" }}>Beds Available</h3>
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginLeft: "1rem",
            }}
          >
            {bedsAvailable}
          </h2>
        </div>
        <h2>Amenities</h2>
        <div style={{ display: "flex", marginTop: "0.5rem" }}>
          <div className="amenitiesClass">
            {amenitiesDetails.map((rec) => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TaskAltOutlinedIcon
                  style={{
                    marginTop: "1rem",
                    marginRight: "10px",
                    color: "lightseagreen",
                  }}
                />
                <p className="amenitiesDetails">{rec}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="paymentClass">
          <h3 style={{ marginTop: "1.8rem" }}>Bed Rent</h3>
          <p>{`$ ${price}`}</p>
          <h5 style={{ marginTop: "2rem", marginLeft: "10px" }}>
            + Service charges applicable
          </h5>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", columnGap: "10px" }}>
          <Button
            variant="contained"
            disabled={bedsAvailable <= 0}
            onClick={() => {
              handleExtend(roomId, price);
              // resetData();
            }}
          >
            EXTEND STAY
          </Button>

          <Button
            variant="contained"
            disabled={bedsAvailable <= 0}
            onClick={() => {
              handleModalOpen(roomId);
              resetData();
            }}
          >
            BOOK BED
          </Button>
          {sessionStorage.getItem("userType") === "admin" && (
            <Button
              variant="contained"
              onClick={() => {
                handleUpdateDetails(roomId);
              }}
            >
              UPDATE DETAILS
            </Button>
          )}
        </div>
      </div>
      <Modal
        open={isModalEOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Extending Stay </h3>
          <div style={{ display: "flex", columnGap: "12px" }}>
            <h4>Booking Id</h4>
            <TextField
              id="sName"
              label="search string"
              variant="outlined"
              onBlur={(e) => {
                handleSearchName(e.target.value);
              }}
              // onClick={() => {
              //   handleExtend(roomId, price);
              //   // resetData();
              // }}
              style={{ maxWidth: "300px" }}
            />
            <TextField
              id="nod"
              label="No of days"
              variant="outlined"
              // onChange={(e) => setNod(e.target.value)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setNod(value);
                } else {
                  setNod("0");
                }
              }}
              style={{ maxWidth: "300px" }}
            />
          </div>
          <div>
            <h3>Customer name</h3>
            <p>{` ${custName}`}</p>
          </div>
          <div>
            <h3>Extra Payable</h3>
            <p>{`$ ${unitprice * nod}`}</p>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "12px",
              justifyContent: "center",
            }}
          >
            <Button variant="contained" onClick={() => searchDetails()}>
              Extend
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>UPDATE DETAILS</h3>
          <div style={{ display: "flex", columnGap: "12px" }}>
            <h4>Room Price</h4>
            <TextField
              id="roomPrice"
              label="Room Price"
              variant="outlined"
              onChange={(e) => setRoomPrice(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
          </div>
          <div style={{ display: "flex", columnGap: "12px" }}>
            <h4>Beds Count</h4>
            <TextField
              id="bedsCount"
              label="Beds Count"
              variant="outlined"
              onChange={(e) => setBedsCount(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "12px",
              justifyContent: "center",
            }}
          >
            <Button variant="contained" onClick={() => updateDetais()}>
              UPDATE
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        message={snackBarMessage}
      ></Snackbar>
    </div>
  );
};

export default RoomDetails;
