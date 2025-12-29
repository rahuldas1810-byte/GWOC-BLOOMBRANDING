
import connectDB from '../backend/db';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    
    await connectDB();
    console.log('✅ MongoDB connection successful!');
    console.log('✅ You can now create an admin user and login.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', error.message);
    console.error('\n📋 Next steps:');
    console.error('   1. Check your MONGODB_URI in .env.local');
    console.error('   2. If using MongoDB Atlas, ensure:');
    console.error('      - Network Access allows your IP (or "Allow Access from Anywhere")');
    console.error('      - Database user credentials are correct');
    console.error('   3. If using local MongoDB, ensure MongoDB service is running');
    process.exit(1);
  }
}

testConnection();

