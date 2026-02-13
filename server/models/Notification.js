const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional (e.g. admin)
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['order', 'health', 'system', 'emergency'],
        default: 'system'
    },
    isRead: { type: Boolean, default: false },
    orderRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
