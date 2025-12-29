import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

import bcrypt from 'bcryptjs'

async function createAdmin() {
  try {
    console.log('🔄 Starting admin creation...')

    // 🔥 CRITICAL: dynamic imports AFTER dotenv
    const { default: connectDB } = await import('../backend/db')
    const { default: Admin } = await import('../models/Admin')

    await connectDB()
    console.log('✅ Connected to MongoDB')

    const email = 'admin@bloombranding.com'
    const plainPassword = 'admin123'

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', email)
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    await Admin.create({
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', plainPassword)
    console.log('⚠️ Change this password after first login!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error creating admin:')
    console.error(error.message)
    process.exit(1)
  }
}

createAdmin()


