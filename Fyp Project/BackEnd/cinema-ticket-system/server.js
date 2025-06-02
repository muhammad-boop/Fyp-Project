require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Your MongoDB connection

// Route files
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const movieRoutes = require('./routes/movieRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => res.send('Online Cinema Ticket System API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
