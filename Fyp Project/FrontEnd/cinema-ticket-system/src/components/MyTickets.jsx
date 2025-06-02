import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyTickets.css";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("active"); // 'active' or 'canceled'
    const [cancelLoadingIds, setCancelLoadingIds] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/tickets/my", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTickets(response.data);
        } catch (err) {
            setError("Failed to fetch tickets.");
            console.error("Error fetching tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const requestCancellation = async (ticketId) => {
        try {
            setCancelLoadingIds((ids) => [...ids, ticketId]);
            const token = localStorage.getItem("token");
            await axios.put(
                `/api/tickets/${ticketId}/cancel-request`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Cancellation request sent.");
            fetchTickets();
        } catch (err) {
            alert("Failed to send cancellation request.");
            console.error("Error requesting cancellation:", err);
        } finally {
            setCancelLoadingIds((ids) => ids.filter((id) => id !== ticketId));
        }
    };

    const activeTickets = tickets.filter((t) => t.status === "booked");
    const canceledTickets = tickets.filter((t) => t.status === "canceled");

    if (loading) return <p>Loading tickets...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-tickets-container">
            <h2>My Tickets</h2>
            <div className="tabs">
                <button
                    className={activeTab === "active" ? "active" : ""}
                    onClick={() => setActiveTab("active")}
                >
                    Active Tickets
                </button>
                <button
                    className={activeTab === "canceled" ? "active" : ""}
                    onClick={() => setActiveTab("canceled")}
                >
                    Canceled Tickets
                </button>
            </div>

            {activeTab === "active" && (
                <div>
                    {activeTickets.length === 0 && <p>No active tickets found.</p>}
                    {activeTickets.map((ticket) => (
                        <div key={ticket._id} className="ticket-card">
                            <p><strong>Movie:</strong> {ticket.movie?.title || "N/A"}</p>
                            <p><strong>Theater:</strong> {ticket.showtime?.theaterName || "N/A"}</p>
                            <p><strong>Showtime:</strong> {ticket.showtime?.date} {ticket.showtime?.time}</p>
                            <p><strong>Seats:</strong> {ticket.seats.join(", ")}</p>
                            <p><strong>Fare:</strong> Rs. {ticket.totalFare}</p>
                            <p><strong>Status:</strong> {ticket.status}</p>
                            <button
                                disabled={cancelLoadingIds.includes(ticket._id)}
                                onClick={() => requestCancellation(ticket._id)}
                            >
                                {cancelLoadingIds.includes(ticket._id) ? "Requesting..." : "Request Cancellation"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "canceled" && (
                <div>
                    {canceledTickets.length === 0 && <p>No canceled tickets found.</p>}
                    {canceledTickets.map((ticket) => (
                        <div key={ticket._id} className="ticket-card canceled">
                            <p><strong>Movie:</strong> {ticket.movie?.title || "N/A"}</p>
                            <p><strong>Theater:</strong> {ticket.showtime?.theaterName || "N/A"}</p>
                            <p><strong>Showtime:</strong> {ticket.showtime?.date} {ticket.showtime?.time}</p>
                            <p><strong>Seats:</strong> {ticket.seats.join(", ")}</p>
                            <p><strong>Fare:</strong> Rs. {ticket.totalFare}</p>
                            <p><strong>Status:</strong> {ticket.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
