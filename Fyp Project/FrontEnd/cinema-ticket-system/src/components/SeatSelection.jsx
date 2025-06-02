import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieId, setMovieId] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);

  useEffect(() => {
    let paymentData = location.state;

    // Fallback to localStorage if location.state is missing
    if (!paymentData) {
      const storedData = localStorage.getItem("paymentInfo");
      if (storedData) {
        paymentData = JSON.parse(storedData);
      }
    }

    if (
      !paymentData ||
      !paymentData.selectedSeats ||
      !paymentData.movieId ||
      !paymentData.showtimeId
    ) {
      alert("Invalid Payment Request. Please go back and select your seats properly.");
      navigate("/seat-selection"); // or wherever seat selection route is
      return;
    }

    setSelectedSeats(paymentData.selectedSeats);
    setMovieId(paymentData.movieId);
    setShowtimeId(paymentData.showtimeId);
  }, [location.state, navigate]);

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        "http://localhost:5000/api/tickets/book",
        {
          movieId,
          showtimeId,
          selectedSeats,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment successful and ticket booked!");
      navigate("/tickets");
    } catch (error) {
      console.error("Payment failed", error);
      alert("Something went wrong with payment. Try again.");
    }
  };

  return (
    <div>
      <h2>Confirm Payment</h2>
      <p>Selected Seats: {selectedSeats.join(", ")}</p>
      <button onClick={handleConfirmPayment}>Pay & Confirm</button>
    </div>
  );
};

export default Payment;
