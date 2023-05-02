import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Button, Snackbar, TextField } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setSnackBarMessage("");
    setOpenSnackBar(false);
    if (sessionStorage.getItem("userType")) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, []);

  const handleLogin = () => {
    if (userName && password) {
      axios
        .post("http://localhost:3001/user/login", { userName, password })
        .then((res) => {
          console.log(res);
          if (res && res.data) {
            const { userType, msg } = res.data;
            setSnackBarMessage(msg);
            setOpenSnackBar(true);
            sessionStorage.setItem("userType", userType);
            navigate("/dashboard");
          } else {
            setSnackBarMessage("Login credentails wrong");
            setOpenSnackBar(true);
          }
        });
    } else {
      setSnackBarMessage("User name or password is missing");
      setOpenSnackBar(true);
    }

    return;
  };

  return (
    <>
      <div className='login-form login-form-background'></div>
      <div className='login-form'>
        <div className='card'>
          <h2>Welcome to Home Stay Hostel</h2>
          <TextField
            id='userName'
            label='User Name'
            variant='outlined'
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{ maxWidth: "300px" }}
          />
          <TextField
            id='password'
            label='Password'
            variant='outlined'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ maxWidth: "300px" }}
          />
          <Button
            variant='outlined'
            color='primary'
            type='submit'
            style={{ maxWidth: "300px" }}
            onClick={() => {
              handleLogin();
            }}
          >
            LOGIN
          </Button>
        </div>
      </div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        message={snackBarMessage}
      ></Snackbar>
    </>
  );
};

export default Login;
