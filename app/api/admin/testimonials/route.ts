import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Testimonial from '@/models/Testimonial'

// GET - List all testimonials (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()

    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: testimonials,
    })
  } catch (error: any) {
    console.error('❌ Get testimonials error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch testimonials',
      },
      { status: 500 }
    )
  }
}

// POST - Create testimonial
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()

    const body = await request.json()
    const { quote, clientName, company, profileImage, order, isActive } = body

    if (!quote || !clientName || !company) {
      return NextResponse.json(
        { success: false, message: 'Quote, client name, and company are required' },
        { status: 400 }
      )
    }

    const testimonial = await Testimonial.create({
      quote,
      clientName,
      company,
      profileImage: profileImage || {},
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    })
  } catch (error: any) {
    console.error('❌ Create testimonial error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create testimonial',
      },
      { status: 500 }
    )
  }
}

