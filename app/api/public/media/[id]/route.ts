import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Media from '@/models/Media'

// GET - Public API: Get single media item (read-only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const media = await Media.findById(params.id).select('url type altText width height format createdAt')
    
    if (!media) {
      return NextResponse.json(
        { success: false, message: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: media,
    })
  } catch (error: any) {
    console.error('❌ Get media error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch media',
      },
      { status: 500 }
    )
  }
}

