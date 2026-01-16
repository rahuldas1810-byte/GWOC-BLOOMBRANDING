export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Brand from '@/models/Brand'

// GET - Public API: List active brands (read-only)
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

