import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Admin from '@/models/Admin'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reset token is required',
        },
        { status: 400 }
      )
    }

    // Find admin with matching reset token that hasn't expired
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
      isActive: true,
    }).select('+resetPasswordToken +resetPasswordExpiry')

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired reset token',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Reset token is valid',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Validate reset token error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

