import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  //   const handleNavigate = () => {
  //     naviagate("/productdetails");
  //   };
  return (
    <div className="footer-container">
      <div className="footer-childs">
        <h2>Bus</h2>
        <p>
          A Bus E-ticketing system, also known as an Electronic Ticketing System
          for buses, is a digital platform that enables passengers to book, pay
          for, and manage their bus tickets electronically, often through a
          website or a mobile application.
        </p>
      </div>
      <div className="footer-childs">
        <h3>Quick Links</h3>
        <p>About Us</p>
        <p>My Account</p>
        <p>Reserve your ticket</p>
        <p>Create your Account</p>
      </div>
    </div>
  );
};

export default Footer;
