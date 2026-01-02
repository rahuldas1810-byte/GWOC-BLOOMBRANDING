import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Banner from '@/models/Banner'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: List active banners (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const query: any = { isActive: true }
    if (type) query.type = type

    const banners = await Banner.find(query)
      .sort({ order: 1, createdAt: -1 })

    const response = NextResponse.json({
      success: true,
      data: banners,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get banners error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch banners',
      },
      { status: 500 }
    )
  }
}



