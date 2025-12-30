import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Brand from '@/models/Brand'

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
      .select('name category description logo image order createdAt')

    return NextResponse.json({
      success: true,
      data: brands,
    })
  } catch (error: any) {
    console.error('❌ Get brands error:', error)
    // Fallback to empty array for graceful degradation
    return NextResponse.json({
      success: true,
      data: [],
    })
  }
}

