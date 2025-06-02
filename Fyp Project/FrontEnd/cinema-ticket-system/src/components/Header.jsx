import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx"; // Make sure this is installed
import AdminLogin from "./AdminLogin";
import "./Header.css"; // Ensure responsive styles are defined here

const Header = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    navigate("/dashboard");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavClick = (path) => {
    setMenuOpen(false); // Close menu after click
    navigate(path);
  };

  return (
    <>
      <div className="header-container">
        <div className="logo-container">
          {menuOpen ? (
            <RxCross2 className="menu-icon" onClick={toggleMenu} />
          ) : (
            <FaBars className="menu-icon" onClick={toggleMenu} />
          )}
          <p className="logo-text">Cinema</p>
        </div>

        <div className={`loginsignup-container ${menuOpen ? "open" : ""}`}>
          <div className="items" onClick={() => handleNavClick("/home")}>
            <p>Home</p>
          </div>
          <div className="items" onClick={() => handleNavClick("/tickets")}>
            <p>Tickets</p>
          </div>
          <div className="items" onClick={() => handleNavClick("/help")}>
            <p>Help</p>
          </div>
          <div className="items" onClick={() => handleNavClick("/login")}>
            <button className="btn">Login</button>
          </div>
          <div className="items" onClick={() => handleNavClick("/signup")}>
            <button className="btn">SignUp</button>
          </div>
        </div>
      </div>

      {showAdminLogin && (
        <div className="fullscreen-overlay">
          <button className="close-btn" onClick={() => setShowAdminLogin(false)}>X</button>
          <AdminLogin onLogin={handleLoginSuccess} />
        </div>
      )}
    </>
  );
};

export default Header;
