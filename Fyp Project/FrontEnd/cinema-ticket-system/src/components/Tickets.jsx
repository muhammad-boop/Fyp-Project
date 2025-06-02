import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Tickets.css'; // Optional styling file

const Tickets = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMovies, setExpandedMovies] = useState({});

  const [searchName, setSearchName] = useState('');
  const [searchCast, setSearchCast] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  const navigate = useNavigate();

  // Fetch all movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
        setFilteredMovies(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies.');
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Toggle show/hide details for a movie
  const toggleDetails = (id) => {
    setExpandedMovies(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle "Book Now" click
  const handleBookNow = (movie) => {
    navigate(`/seatselection/${movie._id}`);
  };

  // Handle search filter
  const handleSearch = () => {
    if (searchBy === 'name' && searchName.trim()) {
      const filtered = movies.filter(movie =>
        movie.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else if (searchBy === 'cast' && searchCast.trim()) {
      const filtered = movies.filter(movie =>
        movie.cast.some(castMember =>
          castMember.toLowerCase().includes(searchCast.toLowerCase())
        )
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  };

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ticket-container">
      <h2>Available Movies</h2>

      {/* Search Options */}
      <div className="search-controls">
        <div>
          <label>
            <input
              type="radio"
              value="name"
              checked={searchBy === 'name'}
              onChange={() => {
                setSearchBy('name');
                setSearchCast('');
              }}
            /> Search by Name
          </label>

          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="cast"
              checked={searchBy === 'cast'}
              onChange={() => {
                setSearchBy('cast');
                setSearchName('');
              }}
            /> Search by Cast
          </label>
        </div>

        {searchBy === 'name' && (
          <input
            type="text"
            placeholder="Movie name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        )}

        {searchBy === 'cast' && (
          <input
            type="text"
            placeholder="Cast member"
            value={searchCast}
            onChange={(e) => setSearchCast(e.target.value)}
          />
        )}

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Movie List */}
      <ul className="movie-list">
        {filteredMovies.length === 0 && <p>No movies found.</p>}
        {filteredMovies.map((movie) => (
          <li key={movie._id} className="movie-card">
            <h3>{movie.name}</h3>

            <button onClick={() => toggleDetails(movie._id)}>
              {expandedMovies[movie._id] ? 'Hide Details' : 'Show More'}
            </button>

            <button className="book-now-btn" onClick={() => handleBookNow(movie)}>
              Book Now
            </button>

            {expandedMovies[movie._id] && (
              <div className="movie-details">
                <p><strong>Description:</strong> {movie.description}</p>
                <p><strong>Duration:</strong> {movie.duration}</p>
                <p><strong>Release Date:</strong> {movie.releaseDate?.substring(0, 10)}</p>
                <p><strong>Language:</strong> {movie.language}</p>
                <p><strong>Cast:</strong> {movie.cast?.join(", ")}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tickets;
