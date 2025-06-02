import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", hasBooked: false });

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditing = (user) => {
    setEditUserId(user._id);
    setEditFormData({ name: user.name, email: user.email, hasBooked: user.hasBooked });
  };

  const cancelEditing = () => {
    setEditUserId(null);
    setEditFormData({ name: "", email: "", hasBooked: false });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${editUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editUserId ? { ...user, ...editFormData } : user
        )
      );
      cancelEditing();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="admin-users-container">
      <h2>Admin - Users List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Booking Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editUserId === user._id ? (
              <tr key={user._id}>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      name="hasBooked"
                      checked={editFormData.hasBooked}
                      onChange={handleEditChange}
                    />
                    Booked
                  </label>
                </td>
                <td>
                  <button className="save-btn" onClick={handleEditSubmit}>Save</button>
                  <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={user.hasBooked ? "booked" : "not-booked"}>
                  {user.hasBooked ? "Booked" : "Not Booked"}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => startEditing(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
