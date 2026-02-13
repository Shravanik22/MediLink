const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

exports.processPayment = async (req, res) => {
    try {
        const { orderId, method, amount } = req.body;

        // Simulate payment gateway delay
        const success = Math.random() > 0.1; // 90% success rate

        const payment = new Payment({
            order: orderId,
            transactionId: 'TXN-' + uuidv4().slice(0, 8).toUpperCase(),
            amount,
            method,
            status: success ? 'success' : 'failed',
            paidAt: success ? new Date() : null
        });

        await payment.save();

        if (success) {
            await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
        }

        res.json({
            success,
            transactionId: payment.transactionId,
            message: success ? 'Payment successful' : 'Payment failed'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
