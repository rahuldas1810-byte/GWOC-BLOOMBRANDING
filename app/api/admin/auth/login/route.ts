import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import { signToken } from '@/backend'
import Admin from '@/models/Admin'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  try {
    // 🔍 DEBUG: Log when login API is hit
    console.log('🔍 [DEBUG] Admin login API hit')
    console.log('🔍 [DEBUG] Request URL:', request.url)
    console.log('🔍 [DEBUG] Request Method:', request.method)

    await connectDB()

    // 🔍 DEBUG: Log MongoDB connection info
    const dbConnection = mongoose.connection
    const dbName = dbConnection.db?.databaseName || 'unknown'
    console.log('🔍 [DEBUG] MongoDB Database Name:', dbName)
    console.log('🔍 [DEBUG] MongoDB Connection State:', dbConnection.readyState === 1 ? 'connected' : 'not connected')

    const { email, password } = await request.json()

    // 🔍 DEBUG: Log request body (email only, NOT password)
    console.log('🔍 [DEBUG] Request email:', email)
    console.log('🔍 [DEBUG] Password provided:', password ? '***' : 'missing')

    // Basic validation
    if (!email || !password) {
      console.log('🔍 [DEBUG] Early return: Missing email or password')
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      )
    }

    // Find admin and explicitly include password
    const normalizedEmail = email.toLowerCase().trim()
    
    // 🔍 DEBUG: Log the exact MongoDB query
    const query = { email: normalizedEmail }
    console.log('🔍 [DEBUG] MongoDB Query:', JSON.stringify(query))
    console.log('🔍 [DEBUG] Collection Name: adminusers (from Admin model)')
    
    const admin = await Admin.findOne(query).select('+password')

    // 🔍 DEBUG: Log MongoDB result (user object WITHOUT password hash)
    if (admin) {
      const adminWithoutPassword = {
        _id: admin._id?.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        hasPassword: !!admin.password,
        passwordLength: admin.password ? admin.password.length : 0,
      }
      console.log('🔍 [DEBUG] MongoDB Result (user found):', JSON.stringify(adminWithoutPassword, null, 2))
    } else {
      console.log('🔍 [DEBUG] MongoDB Result: null (user NOT found)')
    }

    // ❌ Admin not found OR not active
    if (!admin || admin.isActive !== true) {
      console.log('🔍 [DEBUG] Early return: Admin not found or not active')
      console.log('🔍 [DEBUG] Admin exists:', !!admin)
      console.log('🔍 [DEBUG] Admin isActive:', admin?.isActive)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // Extra safety check
    if (!admin.password) {
      console.log('🔍 [DEBUG] Early return: Admin password field is missing')
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // 🔑 Compare password using bcryptjs
    const plainPassword = password.trim()
    const isPasswordValid = await bcrypt.compare(plainPassword, admin.password)

    // 🔍 DEBUG: Log password comparison result (true/false only)
    console.log('🔍 [DEBUG] Password comparison result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('🔍 [DEBUG] Early return: Password comparison failed')
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = signToken(
      admin._id.toString(),
      admin.email,
      admin.role
    )

    // 🔍 DEBUG: Log successful login
    console.log('🔍 [DEBUG] Login successful - JWT token created')
    console.log('🔍 [DEBUG] Admin ID:', admin._id.toString())
    console.log('🔍 [DEBUG] Admin email:', admin.email)
    console.log('🔍 [DEBUG] Admin role:', admin.role)

    // Success response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    })

    // Set auth cookie with name "adminToken"
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    // 🔍 DEBUG: Log error details
    console.error('❌ Admin login error:', error)
    console.log('🔍 [DEBUG] Error message:', error?.message)
    console.log('🔍 [DEBUG] Error stack:', error?.stack)

    return NextResponse.json(
      {
        success: false,
        message: 'Login failed. Please try again.',
      },
      { status: 500 }
    )
  }
}
