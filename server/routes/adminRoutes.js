const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/dashboard', auth, role(['admin']), adminController.getDashboardStats);

module.exports = router;
