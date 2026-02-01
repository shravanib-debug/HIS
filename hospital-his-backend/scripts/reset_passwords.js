/**
 * Password Reset Script
 * Resets passwords for all demo users to known values
 * Run: node scripts/reset_passwords.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');

const resetPasswords = async () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║          PASSWORD RESET SCRIPT                                 ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(config.mongodbUri);
        console.log(`   ✓ Connected to: ${mongoose.connection.host}`);
        console.log('');

        const passwordUpdates = [
            { email: 'admin@hospital-his.com', newPassword: 'Admin@123' },
            { email: 'dr.sharma@hospital-his.com', newPassword: 'Doctor@123' },
            { email: 'priya@hospital-his.com', newPassword: 'Nurse@123' },
            { email: 'amit@hospital-his.com', newPassword: 'Reception@123' },
            { email: 'ravi@hospital-his.com', newPassword: 'Pharma@123' },
            { email: 'suresh@hospital-his.com', newPassword: 'LabTech@123' },
            { email: 'neha@hospital-his.com', newPassword: 'Billing@123' },
            { email: 'head.nurse@hospital-his.com', newPassword: 'HeadNurse@123' },
        ];

        console.log('📁 Resetting Passwords...');

        for (const update of passwordUpdates) {
            const user = await User.findOne({ email: update.email });
            if (!user) {
                console.log(`   ⏭ User ${update.email} not found`);
                continue;
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(update.newPassword, salt);

            // Update password directly (bypassing pre-save hook)
            await User.updateOne(
                { email: update.email },
                { $set: { password: hashedPassword } }
            );

            console.log(`   ✓ Reset password for ${update.email}`);
        }

        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ Passwords reset successfully!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');
        console.log('📋 Updated Credentials:');
        console.log('┌──────────────────┬───────────────────────────────┬──────────────┐');
        console.log('│ Role             │ Email                         │ Password     │');
        console.log('├──────────────────┼───────────────────────────────┼──────────────┤');
        console.log('│ Admin            │ admin@hospital-his.com        │ Admin@123    │');
        console.log('│ Doctor           │ dr.sharma@hospital-his.com    │ Doctor@123   │');
        console.log('│ Nurse            │ priya@hospital-his.com        │ Nurse@123    │');
        console.log('│ Receptionist     │ amit@hospital-his.com         │ Reception@123│');
        console.log('│ Pharmacist       │ ravi@hospital-his.com         │ Pharma@123   │');
        console.log('│ Lab Technician   │ suresh@hospital-his.com       │ LabTech@123  │');
        console.log('│ Billing          │ neha@hospital-his.com         │ Billing@123  │');
        console.log('│ Head Nurse       │ head.nurse@hospital-his.com   │ HeadNurse@123│');
        console.log('└──────────────────┴───────────────────────────────┴──────────────┘');
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

resetPasswords();
