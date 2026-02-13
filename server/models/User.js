const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['kiosk', 'chemist', 'admin'],
        default: 'kiosk'
    },
    phone: { type: String },
    address: { type: String },
    location: {
        lat: Number,
        lng: Number
    },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'blocked', 'pending'], default: 'pending' },
    businessName: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    activityLogs: [{
        action: String,
        timestamp: { type: Date, default: Date.now }
    }],
    notifications: [{
        message: String,
        type: String, // 'order', 'emergency', 'status'
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
