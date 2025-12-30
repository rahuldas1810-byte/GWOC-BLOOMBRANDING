import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Admin from '@/models/Admin'
import { sendPasswordResetEmail } from '@/backend/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email } = await request.json()

    // Basic validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      )
    }

    // Find admin by email
    const normalizedEmail = email.toLowerCase().trim()
    const admin = await Admin.findOne({
      email: normalizedEmail,
      isActive: true,
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!admin) {
      return NextResponse.json(
        {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.',
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to admin document
    admin.resetPasswordToken = resetToken
    admin.resetPasswordExpiry = resetTokenExpiry
    await admin.save()

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(admin.email, resetToken)

    // If email failed to send, log it but still return success (security best practice)
    if (!emailSent) {
      console.error(`Failed to send password reset email to ${admin.email}`)
      // Still return success to prevent email enumeration
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Forgot password error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

