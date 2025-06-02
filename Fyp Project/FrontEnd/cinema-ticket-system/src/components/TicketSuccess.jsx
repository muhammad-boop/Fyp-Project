import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TicketSuccess.css";

const TicketSuccess = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Please login to view ticket details.");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`/api/tickets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTicket(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching ticket:", err.response || err.message);
                setError("Failed to load ticket info");
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    if (loading)
        return (
            <div className="ticket-loader">
                Loading ticket details...
            </div>
        );

    if (error)
        return (
            <div className="ticket-error">
                {error}
            </div>
        );

    if (!ticket)
        return (
            <div className="ticket-error">
                Ticket not found.
            </div>
        );

    const { movie, showtime, seats, totalFare, paymentMethod, paymentStatus, status } = ticket;

    return (
        <div className="ticket-container">
            <div className="ticket-card">
                <h1 className="ticket-title">🎉 Booking Successful!</h1>
                <div className="ticket-details">
                    <p><strong>Movie:</strong> {movie?.title || "N/A"}</p>
                    <p><strong>Theater:</strong> {showtime?.theaterName || "N/A"}</p>
                    <p><strong>Show Date:</strong> {showtime?.date ? new Date(showtime.date).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Show Time:</strong> {showtime?.time || "N/A"}</p>
                    <p><strong>Seats:</strong> {seats?.join(", ") || "N/A"}</p>
                    <p><strong>Total Fare:</strong> Rs. {totalFare || "N/A"}</p>
                    <p><strong>Payment Method:</strong> {paymentMethod || "N/A"}</p>
                    <p><strong>Payment Status:</strong> {paymentStatus || "N/A"}</p>
                    <p><strong>Booking Status:</strong> {status || "N/A"}</p>
                </div>
            </div>
        </div>
    );
};

export default TicketSuccess;
