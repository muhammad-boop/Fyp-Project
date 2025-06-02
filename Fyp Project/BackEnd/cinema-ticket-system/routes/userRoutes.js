const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '25d' });

// User signup (only role=user)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already registered' });

        const user = new User({ name, email, password, address, role: 'user' });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            user: { _id: user._id, name, email, role: user.role, address },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login (user or admin)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.json({
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, address: user.address },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current profile
router.get('/profile', authMiddleware, (req, res) => {
    res.json(req.user);
});

// Update profile (name, address)
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { name, address } = req.body;

        if (name) user.name = name;
        if (address) user.address = address;
        await user.save();

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
