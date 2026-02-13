const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const logger = require('../utils/logger');
const mailer = require('../utils/mailer');

exports.createOrder = async (req, res) => {
    try {
        const { patientDetails, medicines, paymentMode, isEmergency, totalAmount } = req.body;
        const prescriptionPath = req.file ? req.file.path : null;

        const orderId = 'ORD-' + Math.random().toString(36).toUpperCase().slice(2, 8);

        const order = new Order({
            orderId,
            patientDetails,
            medicines,
            prescriptionPath,
            kiosk: req.user.id,
            paymentMode,
            totalAmount,
            isEmergency,
            status: 'pending',
            statusHistory: [{ status: 'pending', comment: 'Order placed via kiosk' }]
        });

        await order.save();

        // Trigger Notifications
        const emailSubject = `Order Confirmed: ${order.orderId}`;
        const emailText = `Hello ${patientDetails.name}, your order ${order.orderId} has been placed successfully. Amount: ₹${totalAmount}. Status: Pending.`;
        const emailHtml = `<h1>Order Confirmation</h1><p>Order ID: <b>${order.orderId}</b></p><p>Total: ₹${totalAmount}</p>`;

        await mailer.sendNotificationEmail(patientDetails.email || 'user@example.com', emailSubject, emailText, emailHtml);

        // SMS Simulation
        console.log(`[SMS] Sending alert to ${patientDetails.phone}: Your MediLink order ${order.orderId} is confirmed!`);

        const io = req.app.get('socketio');
        io.emit('new_order', { orderId: order.orderId, isEmergency });
        if (isEmergency) io.emit('emergency_alert', { message: `Urgent: Emergency order ${order.orderId} received!` });

        res.status(201).json(order);
    } catch (err) {
        logger.error('Order Creation Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, comment, deliveryDetails, genericAlternatives } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Handle generic suggestions
        if (genericAlternatives) {
            order.medicines = order.medicines.map(m => {
                const match = genericAlternatives.find(alt => alt.medicineId === m.medicineId.toString());
                if (match) m.genericAlternativeSuggested = match.suggestion;
                return m;
            });
        }

        order.status = status;
        if (deliveryDetails) {
            order.deliveryDetails = {
                ...order.deliveryDetails.toObject(),
                ...deliveryDetails,
                lastUpdated: new Date()
            };
        }

        order.statusHistory.push({ status, comment: comment || `Order ${status}` });

        await order.save();

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

        // Logic: Only cancel before Packed
        const forbiddenStatuses = ['packed', 'out_for_delivery', 'delivered', 'completed'];
        if (forbiddenStatuses.includes(order.status)) {
            return res.status(400).json({ message: 'Order is already in fulfillment phase and cannot be cancelled.' });
        }

        order.status = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', comment: 'Cancelled by user' });
        await order.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rateOrder = async (req, res) => {
    try {
        const { score, review } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order || order.status !== 'delivered') {
            return res.status(400).json({ message: 'Only delivered orders can be reviewed.' });
        }

        order.rating = { score, review };
        await order.save();

        // Update chemist global rating
        if (order.chemist) {
            const chemist = await User.findById(order.chemist);
            const totalScore = (chemist.rating * chemist.reviewCount) + score;
            chemist.reviewCount += 1;
            chemist.rating = totalScore / chemist.reviewCount;
            await chemist.save();
        }

        res.json({ message: 'Thank you for your review!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getKioskOrders = async (req, res) => {
    try {
        const orders = await Order.find({ kiosk: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrdersForChemist = async (req, res) => {
    try {
        const orders = await Order.find({ chemist: req.user.id }).sort({ isEmergency: -1, createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
