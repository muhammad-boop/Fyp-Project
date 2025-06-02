import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();  // call parent logout to clear token and state
    navigate("/admin-login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Cinema Admin Panel</h3>
        <ul>
          <li>
            <Link to="/admin/adminDashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/adminUsers">Users</Link>
          </li>
          <li>
            <Link to="/admin/adminTickets">Bookings</Link>
          </li>
          <li>
            <Link to="/admin/adminShowTime">Show Timings</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
