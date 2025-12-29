import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../backend/db';
import Admin from '../models/Admin';

async function createAdmin() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@bloombranding.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      console.log('   If you want to create a new admin, use a different email.');
      process.exit(0);
    }

    const admin = await Admin.create({
      email: 'admin@bloombranding.com',
      password: 'admin123', // ⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!
      name: 'Admin User',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@bloombranding.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  IMPORTANT: Change this password immediately after first login!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();

