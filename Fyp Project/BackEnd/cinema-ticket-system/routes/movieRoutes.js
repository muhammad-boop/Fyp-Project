const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin check middleware
const adminCheck = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// GET all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        console.error('Error fetching movie:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Add new movie
router.post('/', authMiddleware, adminCheck, async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        console.error('Error adding movie:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update movie by ID
router.put('/:id', authMiddleware, adminCheck, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        Object.assign(movie, req.body);
        await movie.save();
        res.json(movie);
    } catch (err) {
        console.error('Error updating movie:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete movie by ID
router.delete('/:id', authMiddleware, adminCheck, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        await movie.deleteOne();
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        console.error('Error deleting movie:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
