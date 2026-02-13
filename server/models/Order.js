const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true, required: true },
    patientDetails: {
        name: { type: String, required: true },
        phone: { type: String },
        age: { type: Number },
        gender: { type: String },
        address: { type: String }
    },
    prescriptionPath: { type: String },
    kiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chemist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    medicines: [{
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }],
    totalAmount: { type: Number },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'packed', 'out_for_delivery', 'delivered', 'completed', 'rejected', 'cancelled'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        comment: String
    }],
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    paymentMode: {
        type: String,
        enum: ['COD', 'UPI', 'CARD'],
        default: 'COD'
    },
    isEmergency: { type: Boolean, default: false },
    deliveryDetails: {
        estimatedTime: { type: String },
        trackingId: { type: String },
        otp: { type: String }
    },
    invoicePath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
