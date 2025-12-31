import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Testimonial from '@/models/Testimonial'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: List active testimonials (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    const response = NextResponse.json({
      success: true,
      data: testimonials,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
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


