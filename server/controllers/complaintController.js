const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
    try {
        const { title, description, orderId, priority } = req.body;
        const complaint = new Complaint({
            title,
            description,
            order: orderId,
            user: req.user.id,
            priority
        });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'name email').populate('order', 'orderId');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const { resolution, status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, {
            resolution,
            status,
            resolvedBy: req.user.id,
            resolvedAt: new Date()
        }, { new: true });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
