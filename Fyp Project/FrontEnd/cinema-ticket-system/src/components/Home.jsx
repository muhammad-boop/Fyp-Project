import React from "react";
import "./Home.css";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

const Home = () => {
  // Cinema services data for cards
  const services = [
    {
      title: "Book Tickets Online",
      description:
        "Easily book your movie tickets online, select your seats, and secure your booking in minutes.",
    },
    {
      title: "Multiple Payment Methods",
      description:
        "We offer a variety of payment options including credit/debit cards, mobile wallets, and more.",
    },
    {
      title: "Choose Your Showtime",
      description:
        "Select your preferred movie and showtime from a wide range of options available at nearby cinemas.",
    },
  ];

  return (
    <div className="home-container">
      <img className="img" src="./images/cinema.webp" alt="Cinema Hall" />
      <div className="card-container">
        <h1>Our Services</h1>
        <Grid container spacing={3} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ maxWidth: 250 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <div className="about">
          <h2>About Our Cinema Ticket Booking Service</h2>
          <p>
            We bring the cinema experience right to your fingertips. Our online
            ticket booking platform allows you to browse movies, select showtimes,
            and reserve your seats from the comfort of your home. You can easily
            purchase tickets for movies across multiple theaters and enjoy the
            latest blockbusters in high-quality cinemas. Whether you're looking
            for a thrilling action movie, a romantic comedy, or a family-friendly
            animated film, we've got you covered.
          </p>
          <p>
            With flexible payment options and easy cancellation policies, you
            can book with confidence. We support multiple payment gateways like
            credit/debit cards, mobile wallets, and online banking, ensuring a
            smooth and secure transaction every time.
          </p>
          <p>
            Our goal is to provide a hassle-free movie-going experience. Choose
            your movie, pick your showtime, reserve your seats, and get ready to
            enjoy a fantastic cinema experience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
