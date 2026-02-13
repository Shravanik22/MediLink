const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', auth, complaintController.createComplaint);
router.get('/', auth, role(['admin']), complaintController.getAllComplaints);
router.patch('/:id/resolve', auth, role(['admin']), complaintController.resolveComplaint);

module.exports = router;
