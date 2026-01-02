import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Brand from '@/models/Brand'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: List active brands (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const query: any = { isActive: true }
    if (category) query.category = category

    const brands = await Brand.find(query)
      .sort({ order: 1, createdAt: -1 })

    const response = NextResponse.json({
      success: true,
      data: brands,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get brands error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch brands',
      },
      { status: 500 }
    )
  }
}



