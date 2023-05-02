import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";
import "../styles/booking.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs, { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TablePagination from "@mui/material/TablePagination";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Snackbar from "@mui/material/Snackbar";

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

const BookingDetails = () => {
  const [pageNo, setPageNo] = useState(0);
  const [rows, setRows] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [checkoutDate, setCheckOutDate] = useState(null);
  const [checkinDate, setCheckInDate] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("userType")) {
      navigate("/bookings");
    } else {
      navigate("/");
    }
    axios
      .get(`http://localhost:3001/booking/details?pageNo=${pageNo}`)
      .then((res) => {
        if (res && res.data.status === 200 && res.data.response.length > 0) {
          setBookingDetails(res.data.response || []);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const dataRows = [];
    setTotalData(bookingDetails.length);
    // console.log(bookingDetails);
    if (bookingDetails && bookingDetails.length > 0) {
      bookingDetails &&
        bookingDetails.map(
          (
            {
              bookingId,
              customerName,
              customerAddress,
              customerIdentity,
              noOfBeds,
              typeOfRoom,
              noOfDays,
              checkInDate,
              checkOutDate,
              paymentType,
              paymentAmount,
              status,
            },
            index
          ) => {
            dataRows.push(
              createData(
                index,
                bookingId,
                customerName,
                customerAddress,
                customerIdentity,
                noOfBeds,
                typeOfRoom,
                noOfDays,
                checkInDate,
                checkOutDate,
                paymentType,
                paymentAmount,
                status
              )
            );
          }
        );
    }
    setRows(dataRows.slice(pageNo * 10, (pageNo + 1) * 10));
  }, [bookingDetails]);

  const handleChangePage = (event, newPage) => {
    axios
      .get(`http://localhost:3001/booking/details?pageNo=${newPage}`)
      .then((res) => {
        if (res && res.data.status === 200 && res.data.response.length > 0) {
          setBookingDetails(res.data.response || []);
        }
      })
      .catch((err) => console.log(err));

    setPageNo(newPage);
  };

  const navigate = useNavigate();

  function createData(
    index,
    bookingId,
    customerName,
    customerAddress,
    customerIdentity,
    noOfBeds,
    typeOfRoom,
    noOfDays,
    checkInDate,
    checkOutDate,
    paymentType,
    paymentAmount,
    status
  ) {
    return {
      sNo: index + 1,
      bookingId,
      customerName,
      customerAddress,
      customerIdentity,
      noOfBeds,
      typeOfRoom,
      noOfDays,
      checkInDate,
      checkOutDate,
      paymentType,
      paymentAmount,
      status,
    };
  }

  const doCheckOut = () => {
    if (!checkoutDate) {
      setSnackBarMessage("Please select a Checkout date");
      setOpenSnackBar(true);
      return;
    }

    const diffDays = dayjs(checkoutDate).diff(dayjs(checkinDate), "days");
    if (diffDays < 0) {
      setSnackBarMessage("Check Out date is before check in date");
      setOpenSnackBar(true);
      return;
    }

    const payload = { checkoutDate, bookingId: selectedBookingId };

    axios
      .post(`http://localhost:3001/booking/room/checkout`, payload)
      .then((res) => {
        if (res && res.data.status === 200 && res.data.response) {
          setIsModalOpen(false);
          axios
            .get(`http://localhost:3001/booking/details?pageNo=${pageNo}`)
            .then((res) => {
              if (
                res &&
                res.data.status === 200 &&
                res.data.response.length > 0
              ) {
                setBookingDetails(res.data.response || []);
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  const cancelBooking = (bookingId) => {
    axios
      .get(`http://localhost:3001/booking/room/cancel?bookingId=${bookingId}`)
      .then((res) => {
        setIsModalOpen(false);
        axios
          .get(`http://localhost:3001/booking/details?pageNo=${pageNo}`)
          .then((res) => {
            if (
              res &&
              res.data.status === 200 &&
              res.data.response.length > 0
            ) {
              setBookingDetails(res.data.response || []);
              setIsModalOpen(false);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleCheckoutClick = (bookingId, checkinDate) => {
    setCheckInDate(checkinDate);
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div style={{ background: "#242526", height: "100vh" }}>
      <div className='dashboardNavBar'>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontStyle: "italic", marginLeft: "60px" }}>
            WELCOME TO HOME STAY HOSTEL
          </h1>
        </div>

        <Button className='logout-button' onClick={() => handleLogout()}>
          LOGOUT
        </Button>
      </div>
      <div className='dashboardMainSection'>
        <div className='menuBar'>
          <ul style={{ listStyle: "none", marginLeft: "-2em" }}>
            <li onClick={() => navigate("/")}>Dashboard</li>
            <li onClick={() => navigate("/bookings")}>Bookings</li>
          </ul>
        </div>
        <div className='containerSection'>
          <TableContainer component={Paper} sx={{ margin: "0.8rem" }}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 50, fontWeight: "bold" }}>
                    Booking ID
                  </TableCell>
                  <TableCell>Cust Name</TableCell>
                  <TableCell>Cust Address</TableCell>
                  <TableCell>Cust Identity</TableCell>
                  <TableCell align='center'>Beds Booked</TableCell>
                  <TableCell align='center'>Days Booked</TableCell>
                  <TableCell align='center'>Check In Date</TableCell>
                  <TableCell align='center'>Check Out Date</TableCell>
                  <TableCell align='center'>Payment Type</TableCell>
                  <TableCell align='center'>Bill Amount</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.sNo}
                    </TableCell>
                    <TableCell align='left'>{row.customerName}</TableCell>
                    <TableCell align='left'>{row.customerAddress}</TableCell>
                    <TableCell align='left'>{row.customerIdentity}</TableCell>
                    <TableCell align='center'>{row.noOfBeds}</TableCell>
                    <TableCell align='center'>{row.noOfDays}</TableCell>
                    <TableCell align='center'>
                      {dayjs(row.checkInDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align='center'>
                      {" "}
                      {dayjs(row.checkOutDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align='center'>{row.paymentType}</TableCell>
                    <TableCell align='center'>{`$ ${row.paymentAmount}`}</TableCell>
                    <TableCell align='center'>{row.status}</TableCell>
                    {row.status !== "Cancelled" &&
                      row.status !== "Checked Out" && (
                        <TableCell align='center'>
                          <Button
                            variant='contained'
                            onClick={() =>
                              handleCheckoutClick(
                                row.bookingId,
                                row.checkInDate
                              )
                            }
                            style={{ marginLeft: "1rem" }}
                          >
                            Check-Out
                          </Button>
                        </TableCell>
                      )}
                    {row.status && row.status === "Booked" && (
                      <TableCell align='center'>
                        {
                          <Button
                            variant='outlined'
                            color='error'
                            onClick={() => cancelBooking(row.bookingId)}
                            style={{ marginLeft: "1rem" }}
                          >
                            Cancel
                          </Button>
                        }
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10]}
            component='div'
            count={totalData}
            rowsPerPage={10}
            page={pageNo}
            sx={{ color: "white" }}
            onPageChange={handleChangePage}
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div>
            <p style={{ fontSize: "20px", fontWeight: "600" }}>Check-Out</p>
            <div style={{ display: "flex", marginTop: "1rem" }}></div>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                rowGap: "1rem",
              }}
            >
              <h3>Please select the Checkout date</h3>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Check Out Date'
                  value={checkoutDate}
                  inputFormat='DD/MM/YYYY'
                  onChange={(newValue) => setCheckOutDate(newValue)}
                  renderInput={(params) => <TextField required {...params} />}
                />
              </LocalizationProvider>
              <Button variant='contained' onClick={() => doCheckOut()}>
                Check-Out
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

export default BookingDetails;
