import connectDB from '../backend/db';
import Admin from '../models/Admin';

async function resetAdminPassword() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const email = 'admin@bloombranding.com';
    const newPassword = 'admin123';

    // Find the admin user
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('❌ Admin user not found:', email);
      console.log('   Run: npm run create-admin');
      process.exit(1);
    }

    // Update password (will be hashed by the pre-save hook)
    admin.password = newPassword;
    await admin.save();

    console.log('\n✅ Admin password reset successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email:    admin@bloombranding.com');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 You can now login at: http://localhost:3000/admin/login');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MongoDB is not connected. Run: npm run test-db');
    }
    process.exit(1);
  }
}

resetAdminPassword();

