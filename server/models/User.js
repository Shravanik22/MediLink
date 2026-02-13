const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'chemist', 'kiosk'],
        required: true
    },
    phoneNumber: { type: String },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    isVerified: { type: Boolean, default: false }, // For chemists
    status: { type: String, enum: ['active', 'blocked', 'pending'], default: 'active' },
    businessName: { type: String }, // For chemists
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    notifications: [{
        title: String,
        message: String,
        type: { type: String, enum: ['order', 'health', 'system', 'emergency'] },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    activityLogs: [{
        action: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
