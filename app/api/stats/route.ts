import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Brand from '@/models/Brand'
import Testimonial from '@/models/Testimonial'
import Banner from '@/models/Banner'
import Client from '@/models/Client'
import Media from '@/models/Media'
import Enquiry from '@/models/Enquiry'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get public statistics (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Only count active items for public stats
    const [brands, testimonials, banners, clients, media] = await Promise.all([
      Brand.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
      Banner.countDocuments({ isActive: true }),
      Client.countDocuments({ isActive: true }),
      Media.countDocuments(),
    ])

    const response = NextResponse.json({
      success: true,
      data: {
        brands,
        testimonials,
        banners,
        clients,
        media,
      },
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get stats error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch stats',
      },
      { status: 500 }
    )
  }
}


