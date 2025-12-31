import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import { uploadToCloudinary } from '@/backend/cloudinary'
import Media from '@/models/Media'

// Ensure this route runs in Node.js runtime (required for Mongoose, Cloudinary)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Ensure we always return JSON, even for unexpected errors
  // Set JSON content type header explicitly
  const jsonResponse = (data: any, status: number = 200) => {
    return NextResponse.json(data, {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    // Authenticate admin - wrap in try/catch to ensure we always return JSON
    let authResult
    try {
      authResult = await authenticate(request)
    } catch (authError: any) {
      console.error('❌ Authentication error:', authError)
      return jsonResponse(
        { success: false, message: 'Authentication failed' },
        401
      )
    }

    if ('error' in authResult) {
      return jsonResponse(
        { success: false, message: authResult.error },
        authResult.status
      )
    }

    // Connect to database
    try {
      await connectDB()
    } catch (dbError: any) {
      console.error('❌ Database connection error:', dbError)
      return jsonResponse(
        {
          success: false,
          message: 'Database connection failed',
        },
        500
      )
    }

    // Parse form data
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (parseError: any) {
      console.error('❌ Form data parse error:', parseError)
      return jsonResponse(
        {
          success: false,
          message: 'Invalid form data',
        },
        400
      )
    }

    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'bloom-branding'
    const tags = formData.get('tags') as string
    const altText = (formData.get('altText') as string) || ''
    const usedIn = formData.get('usedIn') as string

    if (!file) {
      return jsonResponse(
        { success: false, message: 'No file provided' },
        400
      )
    }

    // Determine resource type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      return jsonResponse(
        { success: false, message: 'File must be an image or video' },
        400
      )
    }

    const resourceType = isImage ? 'image' : 'video'
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : []

    // Upload to Cloudinary
    let uploadResult
    try {
      uploadResult = await uploadToCloudinary(file, {
        folder,
        tags: tagsArray,
        resourceType,
      })
    } catch (uploadError: any) {
      console.error('❌ Cloudinary upload error:', uploadError)
      return jsonResponse(
        {
          success: false,
          message: uploadError.message || 'Failed to upload to Cloudinary',
        },
        500
      )
    }

    // Save to database
    let media
    try {
      media = await Media.create({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        type: resourceType,
        originalName: file.name,
        altText,
        usedIn: usedIn ? [usedIn] : [],
        folder,
        tags: tagsArray,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.size,
      })
    } catch (dbError: any) {
      console.error('❌ Database save error:', dbError)
      return jsonResponse(
        {
          success: false,
          message: 'Failed to save media to database',
        },
        500
      )
    }

    return jsonResponse({
      success: true,
      message: 'Media uploaded successfully',
      data: media,
    })
  } catch (error: any) {
    // Catch-all for any unexpected errors - ALWAYS return JSON
    console.error('❌ Unexpected media upload error:', error)
    return jsonResponse(
      {
        success: false,
        message: error.message || 'Failed to upload media',
      },
      500
    )
  }
}

