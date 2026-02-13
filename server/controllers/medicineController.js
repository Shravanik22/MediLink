const Medicine = require('../models/Medicine');

exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().populate('chemist', 'name businessName location');
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getChemistMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({ chemist: req.user.id });
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addMedicine = async (req, res) => {
    try {
        const medicine = new Medicine({
            ...req.body,
            chemist: req.user.id
        });
        await medicine.save();
        res.status(201).json(medicine);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOneAndUpdate(
            { _id: req.params.id, chemist: req.user.id },
            req.body,
            { new: true }
        );
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        res.json(medicine);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, chemist: req.user.id });
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        res.json({ message: 'Medicine deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLowStockAlerts = async (req, res) => {
    try {
        const medicines = await Medicine.find({
            chemist: req.user.id,
            $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] }
        });
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
