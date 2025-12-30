import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Service from '@/models/Service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get active services
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const services = await Service.find({ isActive: true })
      .sort({ order: 1 })
      .select('title description details images order')

    const response = NextResponse.json({
      success: true,
      data: services,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get services error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch services',
      },
      { status: 500 }
    )
  }
}

