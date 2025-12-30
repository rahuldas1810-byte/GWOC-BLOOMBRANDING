import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Enquiry from '@/models/Enquiry'

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

