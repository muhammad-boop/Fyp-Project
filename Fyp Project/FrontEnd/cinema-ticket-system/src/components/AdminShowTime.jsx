import React, { useState, useEffect } from "react";

const AdminShowTime = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    language: "",
    releaseDate: "",
    cast: "",
  });
  const [editId, setEditId] = useState(null);
  const apiBase = "http://localhost:5000/api/movies";

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddOrUpdate = async () => {
    const { name, description, duration, language, releaseDate,  cast } = formData;
    if (!name || !description || !duration || !language || !releaseDate || !cast) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiBase}/${editId}` : apiBase;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save movie");
      }

      await fetchMovies();
      setFormData({
        name: "",
        description: "",
        duration: "",
        language: "",
        releaseDate: "",
        cast: "",
      });
      setEditId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this movie?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete movie");
      await fetchMovies();
      if (editId === id) {
        setEditId(null);
        setFormData({
          name: "",
          description: "",
          duration: "",
          language: "",
          releaseDate: "",
          cast: "",
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (movie) => {
    setFormData({
      name: movie.name || "",
      description: movie.description || "",
      duration: movie.duration || "",
      language: movie.language || "",
      releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
      cast: movie.cast || "",
    });
    setEditId(movie._id);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Admin - Manage Movies</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 20,
          borderRadius: 8,
          marginBottom: 30,
          background: "#f9f9f9",
        }}
      >
        <h3>{editId ? "Edit Movie" : "Add New Movie"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <input type="text" name="name" placeholder="Movie Name" value={formData.name} onChange={handleChange} style={{ flexGrow: 1, padding: 8 }} />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ flexGrow: 1, padding: 8 }} />
          <input type="text" name="duration" placeholder="Duration (e.g. 2h 15min)" value={formData.duration} onChange={handleChange} style={{ flexGrow: 1, padding: 8 }} />
          <input type="text" name="language" placeholder="Language" value={formData.language} onChange={handleChange} style={{ flexGrow: 1, padding: 8 }} />
          <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} style={{ flexGrow: 1, padding: 8 }} />
          <input type="text" name="cast" placeholder="Cast (comma separated)" value={formData.cast} onChange={handleChange} style={{ flexGrow: 1, padding: 8 }} />
          <button
            onClick={handleAddOrUpdate}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              alignSelf: "center",
              minWidth: 150,
            }}
          >
            {editId ? "Update Movie" : "Add Movie"}
          </button>
        </div>
      </div>

      <div>
        <h3>Current Movies</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Duration</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Language</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Release Date</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Cast</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 12 }}>
                  No movies available.
                </td>
              </tr>
            )}
            {movies.map((movie) => (
              <tr key={movie._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{movie.name}</td>
                <td style={{ padding: 8 }}>{movie.duration}</td>
                <td style={{ padding: 8 }}>{movie.language}</td>
                <td style={{ padding: 8 }}>{movie.releaseDate?.split("T")[0]}</td>
                <td style={{ padding: 8 }}>{movie.cast}</td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => handleEdit(movie)}
                    style={{
                      marginRight: 8,
                      backgroundColor: "#ffc107",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    style={{
                      backgroundColor: "#dc3545",
                      border: "none",
                      padding: "6px 10px",
                      color: "#fff",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShowTime;
