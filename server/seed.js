const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Medicine = require('./models/Medicine');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medilink');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Medicine.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const commonPassword = await bcrypt.hash('password123', salt);

        // Create Admin
        const admin = new User({
            name: 'System Admin',
            email: 'admin@medilink.com',
            password: commonPassword,
            role: 'admin'
        });
        await admin.save();

        // Create Chemist
        const chemist = new User({
            name: 'Anil Gupta',
            email: 'chemist@citypharma.com',
            password: commonPassword,
            role: 'chemist',
            businessName: 'City Pharma & Wellness',
            isVerified: true
        });
        await chemist.save();

        // Create Kiosk
        const kiosk = new User({
            name: 'Suresh Kumar',
            email: 'kiosk@village1.com',
            password: commonPassword,
            role: 'kiosk',
            businessName: 'Village Health Kiosk #1'
        });
        await kiosk.save();

        // Add Sample Medicines for the Chemist
        const medicines = [
            { name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', price: 40, stockQuantity: 500, chemist: chemist._id },
            { name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic', price: 120, stockQuantity: 200, prescriptionRequired: true, chemist: chemist._id },
            { name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'Antihistamine', price: 30, stockQuantity: 350, chemist: chemist._id },
            { name: 'Metformin 500mg', genericName: 'Metformin', category: 'Antidiabetic', price: 85, stockQuantity: 150, prescriptionRequired: true, chemist: chemist._id }
        ];

        await Medicine.insertMany(medicines);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
