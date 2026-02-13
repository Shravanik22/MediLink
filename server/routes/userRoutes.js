const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/profile', auth, userController.getUserProfile);
router.get('/', auth, role(['admin']), userController.getAllUsers);
router.get('/chemists', auth, userController.getAvailableChemists);
router.patch('/:id/status', auth, role(['admin']), userController.updateUserStatus);
router.patch('/:id/verify', auth, role(['admin']), userController.verifyChemist);

module.exports = router;
