import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Enquiry from '@/models/Enquiry'
import { sendQueryConfirmationEmail } from '@/backend/email'

// POST - Public API: Submit enquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, email, company, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      company: company || '',
      phone: phone || '',
      message,
      status: 'new',
    })

    // Send confirmation email to the user
    try {
      await sendQueryConfirmationEmail(email, name)
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('❌ Failed to send confirmation email:', emailError)
      // Continue with success response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry,
    })
  } catch (error: any) {
    console.error('❌ Submit enquiry error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to submit enquiry',
      },
      { status: 500 }
    )
  }
}

