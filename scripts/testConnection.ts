import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...')
    console.log(
      'MONGODB_URI:',
      process.env.MONGODB_URI ? '✅ Set' : '❌ Not set'
    )

    // 🔥 IMPORTANT: dynamic import AFTER dotenv
    const { default: connectDB } = await import('../lib/db')

    await connectDB()
    console.log('✅ MongoDB connection successful!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:')
    console.error(error.message)
    process.exit(1)
  }
}

testConnection()


