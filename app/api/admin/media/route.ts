import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Media from '@/models/Media'
import { deleteFromCloudinary } from '@/backend/cloudinary'

// GET - List all media (admin)
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
    const usedIn = searchParams.get('usedIn')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const query: any = {}
    if (type) query.type = type
    if (usedIn) query.usedIn = usedIn

    const [media, total] = await Promise.all([
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
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

// DELETE - Delete media (admin) - Note: This route handles DELETE via query param for compatibility
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Media ID is required' },
        { status: 400 }
      )
    }

    const media = await Media.findById(id)
    if (!media) {
      return NextResponse.json(
        { success: false, message: 'Media not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(media.publicId)
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await Media.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete media error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete media',
      },
      { status: 500 }
    )
  }
}

