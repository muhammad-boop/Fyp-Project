import React, { useState } from "react";
import "./Login.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Save token and user info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to /tickets after successful login
      navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignupNavigate = () => {
    navigate("/signup");
  };

  return (
    <div className="container">
      <Box sx={{ maxWidth: "100%" }}>
        <div className="login-main">
          <h3 className="login-heading">Login</h3>

          <label>Email*</label>
          <TextField
            className="textfeild"
            fullWidth
            label="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password*</label>
          <TextField
            className="textfeild"
            fullWidth
            label="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="forget-password">Forget Password?</p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>

          <p className="dont-account">
            Don't have an account?{" "}
            <span>
              <button onClick={handleSignupNavigate}>Sign Up</button>
            </span>
          </p>
        </div>
      </Box>
    </div>
  );
};

export default Login;
