const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

exports.createOrder = async (req, res) => {
    try {
        const { patientDetails, medicines, paymentMode, isEmergency } = req.body;
        const prescriptionPath = req.file ? req.file.path : null;

        const orderId = 'ORD-' + Math.random().toString(36).toUpperCase().slice(2, 8);

        const order = new Order({
            orderId,
            patientDetails,
            prescriptionPath,
            kiosk: req.user.id,
            paymentMode,
            isEmergency,
            status: 'pending',
            statusHistory: [{ status: 'pending', comment: 'Order placed' }]
        });

        await order.save();

        // Trigger Notifications
        console.log(`[Email] Notification sent to kiosk ${req.user.id}: Order ${order.orderId} created.`);

        // Real-time notification
        const io = req.app.get('socketio');
        io.emit('new_order', { orderId: order.orderId, isEmergency });

        res.status(201).json(order);
    } catch (err) {
        logger.error('Order Creation Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getOrdersForChemist = async (req, res) => {
    try {
        // Chemists see pending orders or orders assigned to them
        const orders = await Order.find({
            $or: [
                { chemist: req.user.id },
                { status: 'pending', chemist: { $exists: false } }
            ]
        }).sort({ isEmergency: -1, createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, comment, deliveryDetails } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        if (deliveryDetails) order.deliveryDetails = { ...order.deliveryDetails.toObject(), ...deliveryDetails };

        order.statusHistory.push({ status, comment: comment || `Status updated to ${status}` });

        await order.save();

        // Notify Kiosk
        const io = req.app.get('socketio');
        io.to(order.kiosk.toString()).emit('order_update', { orderId: order.orderId, status });

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (['packed', 'out_for_delivery', 'delivered', 'completed'].includes(order.status)) {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }

        order.status = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', comment: 'Cancelled by user' });
        await order.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
