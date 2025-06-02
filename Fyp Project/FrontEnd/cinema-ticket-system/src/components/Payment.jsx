import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    let stateData = location.state;
    if (!stateData || !stateData.selectedSeats || !stateData.movieId || !stateData.showtimeId) {
      const saved = localStorage.getItem("paymentInfo");
      if (saved) {
        stateData = JSON.parse(saved);
      }
    }

    if (
      !stateData ||
      !stateData.selectedSeats ||
      stateData.selectedSeats.length === 0 ||
      !stateData.movieId ||
      !stateData.showtimeId
    ) {
      alert("Invalid Payment Request. Please go back and select your seats properly.");
      navigate(-1);
    } else {
      setPaymentData(stateData);
    }
  }, [location.state, navigate]);

  if (!paymentData) return null;

  const { selectedSeats, movieId, showtimeId } = paymentData;

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // or fetch from your auth context

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

      alert("Payment Successful! Booking confirmed.");
      localStorage.removeItem("paymentInfo");
      navigate("/tickets"); // redirect to ticket history or homepage
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Payment failed or booking could not be completed.");
    }
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
      <p><strong>Movie ID:</strong> {movieId}</p>
      <p><strong>Showtime ID:</strong> {showtimeId}</p>

      <button
        onClick={handleConfirmPayment}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default Payment;
