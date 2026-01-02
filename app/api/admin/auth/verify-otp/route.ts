import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Admin from '@/models/Admin'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const { email, otp } = await request.json()

        if (!email || !otp) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and OTP are required',
                },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Find admin with email and check OTP
        // We need to select the OTP fields as they are excluded by default
        const admin = await Admin.findOne({
            email: normalizedEmail,
            isActive: true,
        }).select('+otp +otpExpiry +otpAttempts')

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email or OTP',
                },
                { status: 400 }
            )
        }

        // Check if OTP exists
        if (!admin.otp || !admin.otpExpiry) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No OTP request found. Please request a new one.',
                },
                { status: 400 }
            )
        }

        // Check if blocked (too many attempts)
        if ((admin.otpAttempts || 0) >= 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Too many failed attempts. Please request a new OTP.',
                },
                { status: 400 }
            )
        }

        // Check expiry
        if (new Date() > admin.otpExpiry) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'OTP has expired. Please request a new one.',
                },
                { status: 400 }
            )
        }

        // Check OTP match
        if (admin.otp !== otp) {
            // Increment attempts
            admin.otpAttempts = (admin.otpAttempts || 0) + 1
            await admin.save()

            return NextResponse.json(
                {
                    success: false,
                    message: 'Incorrect OTP. Please try again.',
                },
                { status: 400 }
            )
        }

        // OTP is valid!
// Generate reset token
const resetToken = crypto.randomBytes(32).toString('hex')
const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

// Update admin: clear OTP, set reset token
admin.otp = undefined
admin.otpExpiry = undefined
admin.otpAttempts = 0
admin.resetPasswordToken = resetToken
admin.resetPasswordExpiry = resetTokenExpiry

await admin.save()

return NextResponse.json(
  {
    success: true,
    data: {
      resetToken,
    },
  },
  { status: 200 }
)


    } catch (error: any) {
        console.error('❌ Verify OTP error:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred. Please try again later.',
            },
            { status: 500 }
        )
    }
}
