const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const emergencyOrders = await Order.countDocuments({ isEmergency: true });
        const totalUsers = await User.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const revenueByMonth = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const lowStockMedicines = await Medicine.find({
            $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] }
        }).populate('chemist', 'name businessName');

        res.json({
            stats: {
                totalOrders,
                emergencyOrders,
                totalUsers,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            revenueByMonth,
            lowStockMedicines
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
