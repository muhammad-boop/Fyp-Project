import React from "react";
import "./TicketDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { moviesData } from "./moviesData";

const TicketDetails = () => {
  const { movieId } = useParams();
  const movie = moviesData.find((movie) => movie.id === parseInt(movieId));
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/seatselection", { state: { movieId: movie.id } });
  };

  const availableSeats = Math.floor(Math.random() * 100) + 1;

  return (
    <div className="ticket-details-container">
      <h2>{movie?.title}</h2>
      <h3>{movie?.genre}</h3>
      <div className="ticket-details">
        <div className="ticket-details-time">
          <h3>{new Date(movie?.time).toLocaleString()}</h3>
          <p>{availableSeats} seats left</p>
        </div>
        <div className="ticket-details-price">
          <h3>{movie?.price} Rs.</h3>
          <button onClick={handleNavigate}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;