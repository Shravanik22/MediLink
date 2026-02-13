const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Only admins should ideally call this without filters, 
        // but the route middleware should handle permissions.
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {
            status,
            $push: { activityLogs: { action: `Status changed to ${status}` } }
        }, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `User status updated to ${status}`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyChemist = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            isVerified: true,
            status: 'active',
            $push: { activityLogs: { action: 'Chemist verified by admin' } }
        }, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Chemist verified successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAvailableChemists = async (req, res) => {
    try {
        const chemists = await User.find({ role: 'chemist', isVerified: true, status: 'active' })
            .select('name businessName location rating reviewCount');
        res.json(chemists);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
