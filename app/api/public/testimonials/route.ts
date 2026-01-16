import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Testimonial from '@/models/Testimonial'

// Force dynamic rendering - disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0

// GET - Public API: List active testimonials (read-only)
export async function GET(request: NextRequest) {
  try {
    // Connect to database with retry
    try {
      await connectDB()
    } catch (dbError: any) {
      console.error('Database connection failed:', dbError.message)
      // Return empty array if DB connection fails
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('quote clientName company profileImage createdAt')

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
    // Fallback to empty array for graceful degradation
    return NextResponse.json({
      success: true,
      data: [],
    })
  }
}

