import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Client from '@/models/Client'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: List active clients (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const clients = await Client.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('name logo category order createdAt')

    const response = NextResponse.json({
      success: true,
      data: clients,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get clients error:', error)
    // Fallback to empty array for graceful degradation
    return NextResponse.json({
      success: true,
      data: [],
    })
  }
}

