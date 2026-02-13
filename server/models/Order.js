const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    kiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chemist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientDetails: {
        name: { type: String, required: true },
        age: { type: Number },
        phone: { type: String, required: true },
        email: { type: String }
    },
    medicines: [{
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        name: String,
        quantity: { type: Number, default: 1 },
        price: Number,
        genericAlternativeSuggested: String
    }],
    totalAmount: { type: Number, required: true },
    paymentMode: { type: String, enum: ['COD', 'UPI', 'CARD'], default: 'COD' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'packed', 'out_for_delivery', 'delivered', 'completed', 'rejected', 'cancelled'],
        default: 'pending'
    },
    isEmergency: { type: Boolean, default: false },
    prescriptionPath: { type: String },
    invoicePath: { type: String },
    deliveryDetails: {
        estimatedTime: { type: String },
        trackingId: { type: String },
        otp: { type: String },
        lastUpdated: { type: Date }
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        comment: String
    }],
    rating: {
        score: { type: Number, min: 1, max: 5 },
        review: String
    }
}, { timestamps: true });

// Indexing for faster priority sorting
OrderSchema.index({ isEmergency: -1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
