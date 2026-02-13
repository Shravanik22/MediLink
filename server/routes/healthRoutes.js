const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/metrics', auth, role(['kiosk']), healthController.addMetric);
router.get('/history', auth, healthController.getHealthHistory);
router.get('/analytics', auth, role(['admin']), healthController.getAnonymizedAnalytics);

module.exports = router;
