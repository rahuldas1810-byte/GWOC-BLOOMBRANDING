import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Media from '@/models/Media'
import { deleteFromCloudinary } from '@/backend/cloudinary'

// GET - Get single media item
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

    const media = await Media.findById(params.id)
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

// PUT - Update media metadata
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
    const { altText, usedIn, tags } = body

    const updateData: any = {}
    if (altText !== undefined) updateData.altText = altText
    if (usedIn !== undefined) updateData.usedIn = Array.isArray(usedIn) ? usedIn : [usedIn]
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : []

    const media = await Media.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!media) {
      return NextResponse.json(
        { success: false, message: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Media updated successfully',
      data: media,
    })
  } catch (error: any) {
    console.error('❌ Update media error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update media',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete media via path parameter
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

    const media = await Media.findById(params.id)
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
    await Media.findByIdAndDelete(params.id)

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
