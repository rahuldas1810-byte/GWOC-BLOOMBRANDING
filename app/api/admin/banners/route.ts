import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Banner from '@/models/Banner'

// GET - List all banners (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const query: any = {}
    if (type) query.type = type

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: banners,
    })
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

// POST - Create banner
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()

    const body = await request.json()
    const { type, title, subtitle, text, image, video, order, isActive } = body

    if (!type) {
      return NextResponse.json(
        { success: false, message: 'Banner type is required' },
        { status: 400 }
      )
    }

    const banner = await Banner.create({
      type,
      title: title || '',
      subtitle: subtitle || '',
      text: text || '',
      image: image || {},
      video: video || {},
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: 'Banner created successfully',
      data: banner,
    })
  } catch (error: any) {
    console.error('❌ Create banner error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create banner',
      },
      { status: 500 }
    )
  }
}

