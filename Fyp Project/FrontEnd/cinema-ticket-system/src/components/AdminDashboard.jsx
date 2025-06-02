import React, { useState, useEffect } from "react";
import "./AdminDashboard.css"; // Keep your styling

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    // Dummy data for cinema system
    const dummyTickets = [
      { id: "T001", status: "Paid" },
      { id: "T002", status: "Cancelled" },
      { id: "T003", status: "Paid" },
    ];
    const dummyUsers = [
      { id: "U001", name: "Ali Khan" },
      { id: "U002", name: "Sara Ahmed" },
    ];
    const dummyShowtimes = [
      {
        id: 1,
        movieName: "Dune: Part Two",
        theater: "Cinema 1",
        date: "2025-05-15",
        time: "18:00",
      },
      {
        id: 2,
        movieName: "The Batman",
        theater: "Cinema 3",
        date: "2025-05-15",
        time: "21:00",
      },
    ];

    setTickets(dummyTickets);
    setUsers(dummyUsers);
    setShowtimes(dummyShowtimes);
  }, []);

  const totalTickets = tickets.length;
  const totalUsers = users.length;
  const totalShowtimes = showtimes.length;
  const confirmedTickets = tickets.filter((t) => t.status === "Paid").length;
  const cancelledTickets = tickets.filter((t) => t.status === "Cancelled").length;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Admin Dashboard - Cinema Ticket System</h2>

      <div className="dashboard-overview">
        <div className="card">
          <h3>Total Tickets</h3>
          <p>{totalTickets}</p>
        </div>
        <div className="card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="card">
          <h3>Total Showtimes</h3>
          <p>{totalShowtimes}</p>
        </div>
        <div className="card">
          <h3>Confirmed Tickets</h3>
          <p>{confirmedTickets}</p>
        </div>
        <div className="card">
          <h3>Cancelled Tickets</h3>
          <p>{cancelledTickets}</p>
        </div>
      </div>

      <div className="dashboard-recent-activity">
        <h3>Recent Activity</h3>
        <div className="recent-item">
          <h4>Recently Booked Tickets</h4>
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>Ticket {ticket.id} - {ticket.status}</li>
            ))}
          </ul>
        </div>

        <div className="recent-item">
          <h4>Recent Users</h4>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>

        <div className="recent-item">
          <h4>Recent Showtimes</h4>
          <ul>
            {showtimes.map((show) => (
              <li key={show.id}>
                {show.movieName} @ {show.theater} - {show.date} {show.time}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
