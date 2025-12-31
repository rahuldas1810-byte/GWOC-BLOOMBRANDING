import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import OurStory from '@/models/OurStory'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get our story content
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const ourStory = await OurStory.findOne()

    if (!ourStory) {
      const response = NextResponse.json({
        success: true,
        data: {
          heroLabel: 'Established 2024',
          heroTitle: 'OUR STORY',
          heroSubtitle: 'Building brands that leave a legacy through clarity, confidence, and craft.',
          purposeTitle: 'A studio built on clarity.',
          purposeDescription: 'Bloom Branding is a strategic branding agency for those ready to make a noise.',
          philosophyTitle: 'Our Philosophy',
          philosophyDescription: 'We believe in building brands that stand the test of time.',
          philosophyCards: [],
        },
      })
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }

    const response = NextResponse.json({
      success: true,
      data: ourStory,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get our story error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch our story',
      },
      { status: 500 }
    )
  }
}

