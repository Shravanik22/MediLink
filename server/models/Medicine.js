const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genericName: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    prescriptionRequired: { type: Boolean, default: false },
    supplierName: { type: String },
    batchNumber: { type: String },
    lowStockThreshold: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false },
    isOutOfStock: { type: Boolean, default: false },
    chemist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Auto update isOutOfStock virtual-like behavior
MedicineSchema.pre('save', function (next) {
    if (this.stockQuantity <= 0) {
        this.isOutOfStock = true;
    } else {
        this.isOutOfStock = false;
    }
    next();
});

MedicineSchema.index({ name: 'text', genericName: 'text' });
MedicineSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Medicine', MedicineSchema);
