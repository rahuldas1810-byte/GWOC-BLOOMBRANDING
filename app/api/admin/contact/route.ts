import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Contact from '@/models/Contact'

// GET - Get contact content
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

    let contact = await Contact.findOne()
    if (!contact) {
      contact = await Contact.create({})
    }

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error: any) {
    console.error('❌ Get contact error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch contact',
      },
      { status: 500 }
    )
  }
}

// PUT - Update contact content
export async function PUT(request: NextRequest) {
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
    
    // Properly handle heroBackgroundImage - ensure it's structured correctly
    const updateData: any = { ...body }
    if (body.heroBackgroundImage) {
      if (typeof body.heroBackgroundImage === 'object') {
        // If it's already an object, use it as is (handle both with and without url)
        if (body.heroBackgroundImage.url) {
          updateData.heroBackgroundImage = {
            url: body.heroBackgroundImage.url,
            mediaId: body.heroBackgroundImage.mediaId || null,
          }
        } else {
          // Empty object means clear the image
          updateData.heroBackgroundImage = {
            url: '',
            mediaId: null,
          }
        }
      } else if (typeof body.heroBackgroundImage === 'string' && body.heroBackgroundImage.trim() !== '') {
        // If it's a non-empty string URL, convert to object
        updateData.heroBackgroundImage = {
          url: body.heroBackgroundImage,
          mediaId: null,
        }
      } else {
        // Empty string means clear the image
        updateData.heroBackgroundImage = {
          url: '',
          mediaId: null,
        }
      }
    } else if (body.heroBackgroundImage === null || body.heroBackgroundImage === undefined) {
      // Allow clearing the image
      updateData.heroBackgroundImage = {
        url: '',
        mediaId: null,
      }
    }
    
    const contact = await Contact.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    })
  } catch (error: any) {
    console.error('❌ Update contact error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update contact',
      },
      { status: 500 }
    )
  }
}

