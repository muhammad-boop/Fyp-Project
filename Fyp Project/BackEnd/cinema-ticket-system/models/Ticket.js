const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seats: [String],
    totalAmount: Number,
    paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'pending' },
    status: { type: String, enum: ['booked', 'canceled'], default: 'booked' },
    refunded: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'online' },
}, {
    timestamps: true // Optional: adds createdAt and updatedAt
});

module.exports = mongoose.model('Ticket', ticketSchema);
