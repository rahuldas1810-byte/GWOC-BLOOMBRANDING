import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Admin from '@/models/Admin'
import { sendOtpEmail } from '@/backend/email'

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
    console.log('🧪 Forgot Password Lookup:', {
  inputEmail: normalizedEmail,
  adminFound: !!admin,
  adminEmail: admin?.email,
  isActive: admin?.isActive,
})

    
    if (!admin) {
      return NextResponse.json(
        {
          success: true,
          message: 'If an account with that email exists, an OTP has been sent.',
        },
        { status: 200 }
      )
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Save OTP to admin document
    admin.otp = otp
    admin.otpExpiry = otpExpiry
    admin.otpAttempts = 0
    await admin.save()

    console.log('📧 Sending OTP email to:', admin.email)
    console.log('🔢 OTP:', otp)


    const emailSent = await sendOtpEmail(admin.email, otp)

    if (!emailSent) {
      console.error(`Failed to send OTP email to ${admin.email}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, an OTP has been sent.',
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

