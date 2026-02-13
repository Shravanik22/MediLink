const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');

exports.addMetric = async (req, res) => {
    try {
        const { patientName, age, height, weight, bpSystolic, bpDiastolic, sugarLevel, heartRate } = req.body;

        // Find or create record for patient (linked to kiosk's session or specific user)
        // In actual kiosk mode, it might be anonymous or linked to a temp patient profile
        let record = await HealthRecord.findOne({ patientId: req.user.id });

        if (!record) {
            record = new HealthRecord({
                patientId: req.user.id,
                patientDetails: { name: patientName, age }
            });
        }

        const newMetric = {
            height,
            weight,
            bloodPressure: { systolic: bpSystolic, diastolic: bpDiastolic },
            sugarLevel,
            heartRate
        };

        // Use schema method to calculate BMI and Flags
        record.calculateFlags(newMetric);
        record.metrics.push(newMetric);

        await record.save();

        // If risk is high, add notification
        if (newMetric.healthRiskFlag === 'High') {
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    notifications: {
                        title: 'Health Alert',
                        message: `Risk detected: BP ${bpSystolic}/${bpDiastolic}, Sugar ${sugarLevel}. Please consult a doctor.`,
                        type: 'health'
                    }
                }
            });
        }

        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getHealthHistory = async (req, res) => {
    try {
        const record = await HealthRecord.findOne({ patientId: req.user.id });
        res.json(record || { metrics: [] });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAnonymizedAnalytics = async (req, res) => {
    try {
        // For admin to see population health trends
        const stats = await HealthRecord.aggregate([
            { $unwind: "$metrics" },
            {
                $group: {
                    _id: "$metrics.bmiCategory",
                    count: { $sum: 1 },
                    avgSugar: { $avg: "$metrics.sugarLevel" }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
