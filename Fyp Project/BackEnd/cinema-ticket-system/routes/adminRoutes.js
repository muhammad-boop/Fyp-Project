const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const adminCheck = (req, res, next) => {
    console.log('Logged-in user:', req.user);  // Add this for debugging
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: Admin rights required.' });
    }
    next();
};
// Admin signup protected by ADMIN_SECRET header
router.post('/create-admin', async (req, res) => {
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Forbidden: Invalid admin secret' });
    }

    try {
        const { name, email, password, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const adminUser = new User({ name, email, password, address, role: 'admin' });
        await adminUser.save();

        res.status(201).json({ message: 'Admin user created successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await User.findOne({ email, role: 'admin' });
    if (!adminUser) return res.status(401).json({ message: 'Invalid admin credentials' });

    const isMatch = await adminUser.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '25d' });

    res.json({ token, user: { id: adminUser._id, name: adminUser.name, role: adminUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Admin: get all users (no passwords)
router.get('/users', authMiddleware, adminCheck, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
