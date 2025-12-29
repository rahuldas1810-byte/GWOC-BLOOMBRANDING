import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/backend/db'
import { signToken } from '@/backend'
import Admin from '@/models/Admin'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
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
    const admin = await Admin.findOne({
      email: normalizedEmail,
    }).select('+password')

    // ❌ Admin not found OR not active
    if (!admin || admin.isActive !== true) {
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

    if (!isPasswordValid) {
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
    console.error('❌ Admin login error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Login failed. Please try again.',
      },
      { status: 500 }
    )
  }
}
