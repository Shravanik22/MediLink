const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientDetails: {
        name: String,
        age: Number,
        gender: String
    },
    metrics: [{
        height: Number, // in cm
        weight: Number, // in kg
        bmi: Number,
        bmiCategory: {
            type: String,
            enum: ['Underweight', 'Normal', 'Overweight', 'Obese']
        },
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        sugarLevel: Number, // mg/dL
        heartRate: Number, // bpm
        healthRiskFlag: {
            type: String,
            enum: ['Normal', 'Moderate', 'High'],
            default: 'Normal'
        },
        recordedAt: { type: Date, default: Date.now }
    }],
    notes: String
}, { timestamps: true });

// Helper to determine BMI and Risk
HealthRecordSchema.methods.calculateFlags = function (latest) {
    const bmi = latest.weight / ((latest.height / 100) ** 2);
    latest.bmi = bmi.toFixed(1);

    if (bmi < 18.5) latest.bmiCategory = 'Underweight';
    else if (bmi < 25) latest.bmiCategory = 'Normal';
    else if (bmi < 30) latest.bmiCategory = 'Overweight';
    else latest.bmiCategory = 'Obese';

    if (latest.bloodPressure.systolic > 140 || latest.sugarLevel > 180 || latest.bmiCategory === 'Obese') {
        latest.healthRiskFlag = 'High';
    } else if (latest.bloodPressure.systolic > 130 || latest.sugarLevel > 140 || latest.bmiCategory === 'Overweight') {
        latest.healthRiskFlag = 'Moderate';
    } else {
        latest.healthRiskFlag = 'Normal';
    }
};

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
