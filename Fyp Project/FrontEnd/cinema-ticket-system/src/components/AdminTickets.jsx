import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTickets.css";

// Axios setup
axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const paymentOptions = ["JazzCash", "EasyPaisa", "Bank Transfer", "Other"];
const ITEMS_PER_PAGE = 10;

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setErrorMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setErrorMessage("No token found. Please login as admin.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/tickets");
      setTickets(res.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setErrorMessage("Access forbidden: Admin rights required.");
        } else if (error.response.status === 401) {
          setErrorMessage("Unauthorized: Please login again.");
        } else {
          setErrorMessage(`Error ${error.response.status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        setErrorMessage("No response from server.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (ticketId, updatedFields) => {
    setUpdatingTicketId(ticketId);
    setErrorMessage("");

    try {
      const res = await axios.put(`/api/tickets/${ticketId}/status`, updatedFields);
      const updatedTicket = res.data.ticket;
      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === ticketId ? updatedTicket : ticket))
      );
    } catch (error) {
      if (error.response) {
        setErrorMessage(`Update failed: ${error.response.data.message || error.response.statusText}`);
      } else {
        setErrorMessage("Update error. Try again.");
      }
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleStatusChange = (ticketId, newStatus) => {
    updateTicket(ticketId, { status: newStatus });
  };

  const handlePaymentStatusChange = (ticketId, newPaymentStatus) => {
    updateTicket(ticketId, { paymentStatus: newPaymentStatus });
  };

  const handleRefundChange = (ticketId, refunded) => {
    if (refunded && !window.confirm("Mark this ticket as refunded?")) return;
    updateTicket(ticketId, { refunded });
  };

  const handlePaymentMethodChange = (ticketId, paymentMethod) => {
    updateTicket(ticketId, { paymentMethod });
  };

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatTime = (timeString) => timeString || "-";

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Manage Booked Tickets</h2>

      <div className="admin-filter">
        <label>Filter by Status: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="booked">Confirmed</option>
          <option value="canceled">Cancelled</option>
        </select>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User</th>
                  <th>Movie</th>
                  <th>Theater</th>
                  <th>Showtime</th>
                  <th>Seat no.</th>
                  <th>Booking Date</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                  <th>Refund</th>
                  <th>Payment Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.length > 0 ? (
                  paginatedTickets.map((ticket) => {
                    const isUpdating = updatingTicketId === ticket._id;
                    return (
                      <tr key={ticket._id}>
                        <td>{ticket._id}</td>
                        <td>{ticket.user?.name || "-"}</td>
                        <td>{ticket.showtime?.movie?.title || "-"}</td>
                        <td>{ticket.showtime?.theater || "-"}</td>
                        <td>{formatTime(ticket.showtime?.time)}</td>
                        <td>{ticket.seats?.join(", ") || "-"}</td>
                        <td>{formatDate(ticket.createdAt)}</td>
                        <td>
                          <select
                            disabled={isUpdating}
                            value={ticket.paymentStatus}
                            onChange={(e) =>
                              handlePaymentStatusChange(ticket._id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                          </select>
                        </td>
                        <td>
                          <select
                            disabled={isUpdating}
                            value={ticket.status}
                            onChange={(e) =>
                              handleStatusChange(ticket._id, e.target.value)
                            }
                          >
                            <option value="booked">Confirmed</option>
                            <option value="canceled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            disabled={isUpdating}
                            checked={ticket.refunded || false}
                            onChange={(e) =>
                              handleRefundChange(ticket._id, e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          <select
                            disabled={isUpdating}
                            value={ticket.paymentMethod || ""}
                            onChange={(e) =>
                              handlePaymentMethodChange(ticket._id, e.target.value)
                            }
                          >
                            <option value="">Select Method</option>
                            {paymentOptions.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{isUpdating ? "Updating..." : ""}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="no-tickets">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTickets;
