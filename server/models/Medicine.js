const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genericName: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 10 },
    expiryDate: { type: Date },
    supplierName: { type: String },
    batchNumber: { type: String },
    prescriptionRequired: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isOutOfStock: { type: Boolean, default: false },
    chemist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Index for expiry and stock checks
MedicineSchema.index({ expiryDate: 1 });
MedicineSchema.index({ stockQuantity: 1 });

module.exports = mongoose.model('Medicine', MedicineSchema);
