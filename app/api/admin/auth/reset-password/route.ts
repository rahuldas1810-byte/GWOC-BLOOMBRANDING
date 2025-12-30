import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Admin from '@/models/Admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { token, newPassword } = await request.json()

    // Validation
    if (!token || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token and new password are required',
        },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long',
        },
        { status: 400 }
      )
    }

    // Find admin with matching reset token that hasn't expired
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
      isActive: true,
    }).select('+resetPasswordToken +resetPasswordExpiry +password')

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired reset token',
        },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password and clear reset token fields
    admin.password = hashedPassword
    admin.resetPasswordToken = undefined
    admin.resetPasswordExpiry = undefined
    await admin.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Reset password error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

