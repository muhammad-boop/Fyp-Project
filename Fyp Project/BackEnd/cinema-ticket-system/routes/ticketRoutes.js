const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin check middleware
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

// Helper to check seat availability
async function seatsAvailable(showtimeId, seats) {
    const bookedTickets = await Ticket.find({ showtime: showtimeId, status: 'booked' });
    let bookedSeats = [];
    bookedTickets.forEach(ticket => {
        bookedSeats = bookedSeats.concat(ticket.seats);
    });
    return seats.every(seat => !bookedSeats.includes(seat));
}

// ✅ Book Ticket (User)
router.post('/book', authMiddleware, async (req, res) => {
    try {
        const { movieId, showtimeId, selectedSeats } = req.body;

        if (!movieId || !showtimeId || !selectedSeats || selectedSeats.length === 0) {
            return res.status(400).json({ message: 'Invalid booking request' });
        }

        const available = await seatsAvailable(showtimeId, selectedSeats);
        if (!available) {
            return res.status(400).json({ message: 'One or more selected seats are already booked' });
        }

        const ticket = new Ticket({
            user: req.user._id,
            movie: movieId,
            showtime: showtimeId,
            seats: selectedSeats,
            totalAmount: selectedSeats.length * 200, // e.g., 200 per seat
            paymentStatus: 'paid',
            status: 'booked',
            refunded: false,
            paymentMethod: 'online',
        });

        await ticket.save();
        res.status(201).json({ message: 'Ticket booked successfully', ticket });
    } catch (error) {
        console.error('Booking Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ View own tickets (User)
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id })
            .populate('movie')
            .populate('showtime');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get all booked seats for a showtime
router.get('/booked-seats/:showtimeId', authMiddleware, async (req, res) => {
    try {
        const { showtimeId } = req.params;
        const tickets = await Ticket.find({ showtime: showtimeId, status: 'booked' });
        let bookedSeats = [];
        tickets.forEach(ticket => bookedSeats = bookedSeats.concat(ticket.seats));
        res.json({ bookedSeats });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Cancel ticket (User or Admin)
router.put('/cancel/:id', authMiddleware, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (!ticket.user.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this ticket' });
        }

        ticket.status = 'canceled';
        await ticket.save();
        res.json({ message: 'Ticket canceled', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Admin: get all tickets
router.get('/', authMiddleware, adminCheck, async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('user', '-password')
            .populate('movie')
            .populate('showtime');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Admin: update payment status
router.put('/:id/payment-status', authMiddleware, adminCheck, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const { paymentStatus } = req.body;
        if (!['paid', 'pending'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        ticket.paymentStatus = paymentStatus;
        await ticket.save();

        res.json({ message: 'Payment status updated', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
