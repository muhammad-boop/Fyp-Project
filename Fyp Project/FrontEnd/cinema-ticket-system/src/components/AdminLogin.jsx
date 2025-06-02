import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // If status code is not 2xx, throw error
        const errData = await response.json();
        throw new Error(errData.message || "Invalid email or password");
      }

      const data = await response.json();

      // Assuming backend sends back a token and user info:
      // { token: "...", adminUser: { email: "...", name: "..." } }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.adminUser));

      onLogin();
      navigate("/admin/adminDashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = () => {
    if (error) setError("");
  };

  return (
    <div
      className="admin-login"
      style={{ maxWidth: "350px", margin: "auto", padding: "20px" }}
    >
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              onInputChange();
            }}
            required
            placeholder="admin@example.com"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              onInputChange();
            }}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 15px", width: "100%" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
