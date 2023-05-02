import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BookingDetails from "./pages/BookingDetails";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path='/' exact element={<Login />} />
      <Route path='/login' exact element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/bookings' element={<BookingDetails />} />
    </Routes>
  );
}

export default App;
