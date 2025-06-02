import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Components
import Home from "./components/Home";
import Header from "./components/Header";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Help from "./components/Help";
import Tickets from "./components/Tickets";
import TicketDetails from "./components/TicketDetails";
import SeatSelection from "./components/SeatSelection";
import Payment from "./components/Payment";
// import BookingSuccess from "./components/BookingSuccess";

// Admin Components
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminTickets from "./components/AdminTickets";
import AdminUsers from "./components/AdminUsers";
import AdminShowTime from "./components/AdminShowTime";

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAdminLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <div className="main-content">
        <Header onLogout={handleLogout} isAdminLoggedIn={isAdminLoggedIn} />
        <div className="page-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/help" element={<Help />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/ticketdetails/:ticketId" element={<TicketDetails />} />
            <Route path="/seatselection/:movieId" element={<SeatSelection />} />
            <Route path="/payment" element={<Payment />} />
            {/* <Route path="/ticket-success" element={<BookingSuccess />} /> */}

            {/* Admin Login */}
            <Route
              path="/admin-login"
              element={<AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />}
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                isAdminLoggedIn ? (
                  <AdminLayout onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            >
              {/* Redirect /admin to /admin/adminDashboard */}
              <Route index element={<Navigate to="adminDashboard" replace />} />
              <Route path="adminDashboard" element={<AdminDashboard />} />
              <Route path="adminUsers" element={<AdminUsers />} />
              <Route path="adminTickets" element={<AdminTickets />} />
              <Route path="adminShowTime" element={<AdminShowTime />} />
            </Route>

            {/* Redirect root to home or any default */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
