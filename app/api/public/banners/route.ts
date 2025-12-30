import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Banner from '@/models/Banner'

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
      .select('type title subtitle text image video order createdAt')

    return NextResponse.json({
      success: true,
      data: banners,
    })
  } catch (error: any) {
    console.error('❌ Get banners error:', error)
    // Fallback to empty array for graceful degradation
    return NextResponse.json({
      success: true,
      data: [],
    })
  }
}

