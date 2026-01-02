import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import SiteSettings from '@/models/SiteSettings'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get site settings (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create({})
    }

    const response = NextResponse.json({
      success: true,
      data: settings,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get site settings error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch site settings',
      },
      { status: 500 }
    )
  }
}



