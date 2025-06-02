import React, { useState } from "react";
import "./Signup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FcGoogle } from "react-icons/fc";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (
      e.target.name === "confirmPassword" &&
      e.target.value !== formData.password
    ) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        name,
        email,
        password,
        address: phone, // Mapping phone to address
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const loginnavigate = () => {
    navigate("/login");
  };

  return (
    <div className="login-container content">
      <form onSubmit={handleSignup}>
        <div className="login-main">
          <h3 className="login-heading">Sign Up</h3>

          <label>Name*</label>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="textfeild"
            fullWidth
            label="Enter Your Name"
            required
          />

          <label>Email*</label>
          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="textfeild"
            type="email"
            fullWidth
            label="Email"
            required
          />

       

          <label>Password*</label>
          <TextField
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="textfeild"
            fullWidth
            type="password"
            label="Enter Password"
            required
          />

          <label>Confirm Password*</label>
          <TextField
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="textfeild"
            fullWidth
            type="password"
            label="Confirm Password"
            required
          />

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <Button
            type="submit"
            variant="contained"
            disabled={errorMessage !== ""}
          >
            Sign Up
          </Button>

          

          <p className="dont-account">
            Already have an account?{" "}
            <button type="button" onClick={loginnavigate}>
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
