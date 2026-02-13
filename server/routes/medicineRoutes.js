const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', medicineController.getAllMedicines);
router.get('/chemist', auth, role(['chemist']), medicineController.getChemistMedicines);
router.post('/', auth, role(['chemist']), medicineController.addMedicine);
router.patch('/:id', auth, role(['chemist']), medicineController.updateMedicine);
router.delete('/:id', auth, role(['chemist']), medicineController.deleteMedicine);
router.get('/alerts/low-stock', auth, role(['chemist']), medicineController.getLowStockAlerts);

module.exports = router;
