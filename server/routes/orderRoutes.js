const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');

router.post('/', auth, role(['kiosk']), upload.single('prescription'), orderController.createOrder);
router.get('/kiosk', auth, role(['kiosk']), orderController.getKioskOrders);
router.get('/chemist', auth, role(['chemist']), orderController.getOrdersForChemist);
router.patch('/:id/status', auth, role(['chemist', 'admin']), orderController.updateOrderStatus);
router.post('/:id/cancel', auth, orderController.cancelOrder);
router.post('/:id/rate', auth, role(['kiosk']), orderController.rateOrder);

module.exports = router;
