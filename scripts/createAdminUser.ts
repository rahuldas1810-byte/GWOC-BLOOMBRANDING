import connectDB from '../lib/db';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const email = 'admin@bloombranding.com';
    const password = 'password123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', email);
      console.log('   If you want to reset the password, delete the user first.');
      process.exit(0);
    }

    // Create admin user (password will be hashed by the pre-save hook)
    const admin = await Admin.create({
      email,
      password, // Will be hashed automatically
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email:    admin@bloombranding.com');
    console.log('   Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('\n🚀 You can now login at: http://localhost:3000/admin/login');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MongoDB is not connected. Run: npm run test-db');
    }
    process.exit(1);
  }
}

createAdminUser();

