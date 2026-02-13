const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    kiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metrics: [{
        bmi: Number,
        weight: Number,
        height: Number,
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        sugarLevel: Number,
        flags: [String], // 'high_bp', 'obese', etc.
        recordedAt: { type: Date, default: Date.now }
    }],
    history: [String], // General medical history
    emergencyAlerts: [{
        type: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
