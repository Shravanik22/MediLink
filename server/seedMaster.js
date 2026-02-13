const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Medicine = require('./models/Medicine');

dotenv.config();

const seed = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI || 'mongodb://localhost:27017/medilink');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medilink');

        console.log('Clearing existing user data...');
        await User.deleteMany({});
        await Medicine.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const hashedUserPassword = await bcrypt.hash('password123', salt);
        console.log('Password hash generated successfully');

        // Create Admin
        const admin = await User.create({
            name: 'Master Admin',
            email: 'admin@medilink.com',
            password: hashedUserPassword,
            role: 'admin',
            status: 'active'
        });
        console.log('Admin user created:', admin.email);

        // Create Chemist
        const chemist = await User.create({
            name: 'City Pharma',
            email: 'chemist@medilink.com',
            password: hashedUserPassword,
            role: 'chemist',
            businessName: 'City Main Pharma',
            isVerified: true,
            status: 'active',
            rating: 4.5,
            reviewCount: 12,
            location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore Central' }
        });
        console.log('Chemist user created:', chemist.email);

        // Create Kiosk
        const kiosk = await User.create({
            name: 'Village Kiosk 01',
            email: 'kiosk@medilink.com',
            password: hashedUserPassword,
            role: 'kiosk',
            status: 'active',
            location: { lat: 13.0827, lng: 80.2707, address: 'Rural Outpost A' }
        });
        console.log('Kiosk user created:', kiosk.email);

        // Create Medicines
        const medicines = [
            {
                name: 'Paracetamol 500mg',
                genericName: 'Paracetamol',
                category: 'Analgesic',
                price: 15,
                stockQuantity: 100,
                expiryDate: new Date('2025-12-31'),
                chemist: chemist._id,
                lowStockThreshold: 20,
                batchNumber: 'BT-889'
            },
            {
                name: 'Amoxicillin 250mg',
                genericName: 'Amoxicillin',
                category: 'Antibiotic',
                price: 45,
                stockQuantity: 15,
                expiryDate: new Date('2026-06-30'),
                chemist: chemist._id,
                prescriptionRequired: true,
                lowStockThreshold: 20,
                batchNumber: 'AX-003'
            }
        ];

        await Medicine.insertMany(medicines);
        console.log('Sample medicines injected');

        console.log('=========================================');
        console.log('MASTER SEED COMPLETED SUCCESSFULLY');
        console.log('USE: admin@medilink.com / password123');
        console.log('=========================================');
        process.exit();
    } catch (err) {
        console.error('SEED ERROR:', err);
        process.exit(1);
    }
};

seed();
