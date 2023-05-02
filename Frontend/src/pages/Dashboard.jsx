import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import axios from "axios";
import RoomDetails from "../components/RoomDetails";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";

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

const Dashboard = () => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [roomDetails, setRoomDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oneRoomDetails, setOneRoomDetails] = useState(null);
  const [oneRoomPrice, setOneRoomPrice] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [bookedDays, setBookedDays] = useState(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [bedsCount, setbedsCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [CardNumber, setCardNumber] = useState("");
  const [CVV, setCVV] = useState("");
  const [ExpiryDate, setExpiryDate] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerIdentity, setCustomerIdentity] = useState("");

  const [mobileNumber, setMobileNumber] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("userType")) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
    resetData();
    axios
      .get("http://localhost:3001/rooms/fetch/all")
      .then((res) => {
        if (res && res.status === 200 && res.data.length > 0) {
          let arr = res.data;
          arr = arr.map((rec) => {
            return {
              ...rec,
              roomId: rec._id,
            };
          });
          console.log("line 78", res);
          setRoomDetails(arr);
        }
      })
      .catch((err) => console.log(err));


      // axios
      // .get(`http://localhost:3001/booking/details?pageNo=${1}`)
      // .then((res) => {
      //   if (res && res.data.status === 200 && res.data.response.length > 0) {          
      //     console.log("response in 88", res.data.response);
      //     setresponse(res.data.response);

      //     // const matchingString = "Tasneem Shaik";
      //     // const bookingObj = res.data.response.find(
      //     //   (obj) => obj.customerName === matchingString
      //     // );
      //     // if (bookingObj) {
      //     //   const checkoutDate = bookingObj.checkOutDate;
      //     //   console.log(checkoutDate); // "2023-05-18T05:00:00.000Z"
      //     // } else {
      //     //   console.log("Booking not found for customer name:", matchingString);
      //     // }
      //   }
      // })
      // .catch((err) => console.log(err));
   
  }, []);

  const handleModalOpen = (roomId) => {
    axios
      .get(`http://localhost:3001/rooms/fetch/oneroom/details?roomId=${roomId}`)
      .then((res) => {
        if (res && res.status === 200 && res.data) {
          console.log(res.data);
          setOneRoomDetails({ ...res.data, roomId: res.data._id });
          let priceForRoom = res.data.price;
          priceForRoom = priceForRoom.replace(/,/g, "");
          setOneRoomPrice(priceForRoom);
        }
      })
      .then(() => {
        setIsModalOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleCheckInDateChange = (value) => {
    setCheckInDate(value);
  };

  const handleCheckOutDateChange = (value) => {
    setCheckOutDate(value);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setbedsCount(event.target.value);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    navigate("/");
  };

  const fetchAllDetails = () => {
    axios
      .get("http://localhost:3001/rooms/fetch/all")
      .then((res) => {
        if (res && res.status === 200 && res.data.length > 0) {
          let arr = res.data;
          arr = arr.map((rec) => {
            return {
              ...rec,
              roomId: rec._id,
            };
          });
          setRoomDetails(arr);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const diffDays = dayjs(checkOutDate).diff(dayjs(checkInDate), "days");
      if (diffDays < 0) {
        setBookedDays(0);
        setIsBtnDisabled(true);
        setSnackBarMessage("Please check the dates");
        setOpenSnackBar(true);
      } else if (diffDays == 0) {
        setBookedDays(1);
        setIsBtnDisabled(false);
        if (bookedDays && bedsCount) {
          setTotalAmount(bedsCount * oneRoomPrice + 50);
        }
      } else if (diffDays > 30) {
        setBookedDays(diffDays);
        setIsBtnDisabled(true);
        setSnackBarMessage("Please Book less than 30 days in one Booking");
        setOpenSnackBar(true);
      } else {
        setBookedDays(diffDays);
        setIsBtnDisabled(false);
        if (bookedDays) {
          setTotalAmount((bedsCount || 1) * oneRoomPrice + 50);
        }
      }
    } else {
      setBookedDays(0);
      setIsBtnDisabled(true);
    }
  }, [checkInDate, checkOutDate, bedsCount]);

  useEffect(() => {
    if (bookedDays) {
      setTotalAmount((bedsCount || 1) * oneRoomPrice + 50);
    }
  }, [bedsCount]);

  const handleConfirmBooking = () => {
    if (!customerName) {
      setSnackBarMessage("Please enter Customer Name");
      setOpenSnackBar(true);
      return;
    }

    if (!customerIdentity) {
      setSnackBarMessage("Please enter Customer Identity");
      setOpenSnackBar(true);
      return;
    }

    if (!customerAddress) {
      setSnackBarMessage("Please enter Customer Address");
      setOpenSnackBar(true);
      return;
    }

    if (!paymentMode) {
      setSnackBarMessage("Please select a payment mode");
      setOpenSnackBar(true);
      return;
    }

    // gather data

    const payload = {
      roomId: oneRoomDetails.roomId,
      customerName,
      customerAddress,
      customerIdentity,
      dateOfBirth,
      mobileNumber,
      noOfBeds: bedsCount,
      typeOfRoom: oneRoomDetails.roomName,
      noOfDays: bookedDays,
      checkInDate,
      checkOutDate,
      ExpiryDate: ExpiryDate,
      CardNumber: CardNumber,
      CVV: CVV,
      paymentType: paymentMode,
      paymentAmount: totalAmount,
      status: "Booked",
    };

    axios
      .post("http://localhost:3001/booking/new/details", payload)
      .then((res) => {
        if ((res && res.status == 200) || 204) {
          setSnackBarMessage("Room Booked Successfully");
          setOpenSnackBar(true);
          resetData();
          axios
            .get("http://localhost:3001/rooms/fetch/all")
            .then((res) => {
              if (res && res.status === 200 && res.data.length > 0) {
                let arr = res.data;
                arr = arr.map((rec) => {
                  return {
                    ...rec,
                    roomId: rec._id,
                  };
                });
                setRoomDetails(arr);
              }
            })
            .catch((err) => console.log(err));
        } else {
          setSnackBarMessage("Room Booking failed");
          setOpenSnackBar(true);
        }
        setIsModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const resetData = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setPaymentMode(null);
    setbedsCount(1);
    setTotalAmount(0);
  };

  const getMenuItems = () => {
    if (oneRoomDetails && oneRoomDetails.bedsAvailable > 0) {
      const menuItemsList = [];
      for (let i = 1; i <= oneRoomDetails.bedsAvailable; i++) {
        menuItemsList.push(<MenuItem value={i}>{i}</MenuItem>);
      }
      return menuItemsList;
    }
    return null;
  };

  return (
    <div style={{ background: "#242526", height: "100vh" }}>
      <div className="dashboardNavBar">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontStyle: "italic", marginLeft: "60px" }}>
            WELCOME TO GRAND BAY RESORT HOTEL
          </h1>
        </div>

        <Button className="logout-button" onClick={() => handleLogout()}>
          LOGOUT
        </Button>
      </div>
      <div className="dashboardMainSection">
        <div className="menuBar">
          <ul style={{ listStyle: "none", marginLeft: "-2em" }}>
            <li onClick={() => navigate("/")}>Dashboard</li>
            <li onClick={() => navigate("/bookings")}>Bookings</li>
          </ul>
        </div>
        <div className="containerSection">
          <div className="roomDetails">
            {roomDetails &&
              roomDetails.length > 0 &&
              roomDetails.map((rec) => (
                <RoomDetails
                  key={rec._id}
                  details={rec}
                  handleModalOpen={handleModalOpen}
                  resetData={resetData}
                  fetchAllDetails={fetchAllDetails}
                />
              ))}
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <p style={{ fontSize: "20px", fontWeight: "600" }}>Book Room</p>
            <TextField
              id="customerName"
              label="Customer Name"
              variant="outlined"
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <div>
              <TextField
                id="customerIdentity"
                label="Customer Identity"
                variant="outlined"
                onChange={(e) => setCustomerIdentity(e.target.value)}
                required
                style={{ marginTop: "10px" }}
              />
            </div>
            <div>
              <TextField
                id="customerAddress"
                label="Customer Address"
                variant="outlined"
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
                style={{ marginTop: "10px", width: "20rem" }}
              />
            </div>
            <div style={{ marginTop: "8px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={dateOfBirth}
                  inputFormat="DD/MM/YYYY"
                  onChange={(newValue) => setDateOfBirth(newValue)}
                  renderInput={(params) => <TextField required {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div>
              <TextField
                id="mobileNumber"
                label="Mobile Number"
                variant="outlined"
                onKeyPress={(event) => {
                  const allowedChars = /[0-9\+]/;
                  const currentValue = event.target.value;
                  const key = event.key;

                  // Allow backspace and delete keys
                  if (key === "Backspace" || key === "Delete") {
                    return;
                  }

                  // Allow only numbers and +
                  if (!allowedChars.test(key)) {
                    event.preventDefault();
                    return;
                  }

                  // Allow + only at the beginning
                  if (key === "+" && currentValue.length !== 0) {
                    event.preventDefault();
                    return;
                  }

                  // Allow only one + in the string
                  if (currentValue.indexOf("+") !== -1 && key === "+") {
                    event.preventDefault();
                    return;
                  }
                }}
                required
                style={{ marginTop: "10px", width: "20rem" }}
              />
            </div>
            <p style={{ fontSize: "26px", fontWeight: "600" }}>
              {oneRoomDetails && oneRoomDetails.roomName}
            </p>
            <div style={{ display: "flex", marginTop: "-1.5rem" }}>
              <h4>No Of Available Bed(s)</h4>
              <h3 style={{ marginLeft: "12px" }}>
                {oneRoomDetails && oneRoomDetails.bedsAvailable}
              </h3>
            </div>
            <div style={{ display: "flex" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Check In Date"
                  value={checkInDate}
                  inputFormat="DD/MM/YYYY"
                  minDate={today}
                  maxDate={today}
                  onChange={(newValue) => handleCheckInDateChange(newValue)}
                  renderInput={(params) => <TextField required {...params} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="checkOutDatePicker"
                  label="Check Out Date"
                  value={checkOutDate}
                  inputFormat="DD/MM/YYYY"
                  minDate={tomorrow}
                  onChange={(newValue) => handleCheckOutDateChange(newValue)}
                  renderInput={(params) => <TextField required {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div style={{ display: "flex" }}>
              <h4>No Of Days Booked</h4>
              <h3 style={{ marginLeft: "12px" }}>{bookedDays}</h3>
            </div>
            <div style={{ display: "flex" }}>
              <h4>No Of Bed(s)</h4>
              <Select
                style={{ marginLeft: "12px" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={bedsCount}
                onChange={handleSelectChange}
              >
                {getMenuItems()}
                {/* <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem> */}
              </Select>
            </div>
            <div style={{ display: "flex" }}>
              <h4>Bed Price / Month for One Bed</h4>
              <h3
                style={{
                  marginLeft: "7rem",
                }}
              >
                {oneRoomDetails && `$ ${oneRoomDetails.price}`}
              </h3>
            </div>
            <div style={{ display: "flex", marginTop: "-1rem" }}>
              <h4>Service Charge + Taxes </h4>
              <h3 style={{ marginLeft: "11.3rem" }}>{`$ 50.00`}</h3>
            </div>
            <div style={{ display: "flex", marginTop: "-1rem" }}>
              <h4>Total Amount Payable </h4>
              <h3 style={{ marginLeft: "11.3rem" }}>{`$ ${totalAmount}`}</h3>
            </div>
            <div style={{ display: "flex" }}>
              <h4>Payment Mode</h4>
              <Select
                style={{ marginLeft: "12px", width: "10rem" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={(e) => setPaymentMode(e.target.value)}
                value={paymentMode}
              >
                {/* <MenuItem value={"Online"}>Online</MenuItem> */}
                <MenuItem value={"Cash"}>Cash</MenuItem>
                <MenuItem value={"Card"}>Card</MenuItem>
              </Select>
              {paymentMode === "Card" && (
                <div>
                  <TextField
                    id="cardNumber"
                    label="Card Number"
                    variant="outlined"
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    style={{ marginTop: "10px", width: "20rem" }}
                  />

                  <TextField
                    id="expiryDate"
                    label="Expiry Date"
                    variant="outlined"
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    style={{ marginTop: "10px", width: "20rem" }}
                  />

                  <TextField
                    id="cvv"
                    label="CVV"
                    variant="outlined"
                    onChange={(e) => setCVV(e.target.value)}
                    required
                    style={{ marginTop: "10px", width: "20rem" }}
                  />
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <Button
                variant="contained"
                disabled={isBtnDisabled}
                onClick={() => handleConfirmBooking()}
              >
                Confirm Booking
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setIsModalOpen(false);
                  resetData();
                }}
                style={{ marginLeft: "1rem" }}
              >
                Cancel
              </Button>
            </div>
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

export default Dashboard;
