import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Media from '@/models/Media'

// GET - Public API: List media (read-only, filtered)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const usedIn = searchParams.get('usedIn')
    const folder = searchParams.get('folder')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const query: any = {}
    if (type) query.type = type
    if (usedIn) query.usedIn = usedIn
    if (folder) query.folder = folder
    if (tag) query.tags = tag

    const [media, total] = await Promise.all([
      Media.find(query)
        .select('url type altText width height format createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Media.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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

