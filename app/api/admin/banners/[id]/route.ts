import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Banner from '@/models/Banner'

// GET - Get single banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticate(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()

    const banner = await Banner.findById(params.id)
    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: banner,
    })
  } catch (error: any) {
    console.error('❌ Get banner error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch banner',
      },
      { status: 500 }
    )
  }
}

// PUT - Update banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updateData: any = {}
    if (type !== undefined) updateData.type = type
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (text !== undefined) updateData.text = text
    if (image !== undefined) updateData.image = image
    if (video !== undefined) updateData.video = video
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const banner = await Banner.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully',
      data: banner,
    })
  } catch (error: any) {
    console.error('❌ Update banner error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update banner',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticate(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()

    const banner = await Banner.findByIdAndDelete(params.id)
    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete banner error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete banner',
      },
      { status: 500 }
    )
  }
}

