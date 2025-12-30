import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Homepage from '@/models/Homepage'

// GET - Get homepage content (admin)
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

    // Get or create homepage document (only one should exist)
    let homepage = await Homepage.findOne()
    
    if (!homepage) {
      // Create default homepage if none exists
      homepage = await Homepage.create({
        heroHeadline: 'We craft brand identities that resonate.',
        heroSubheading: 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
        aboutPreview: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
        tagline: 'Helping Brands Bloom',
        servicesPreview: [],
        sections: {
          hero: { enabled: true, order: 1 },
          about: { enabled: true, order: 2 },
          services: { enabled: true, order: 3 },
          clients: { enabled: true, order: 4 },
          testimonials: { enabled: true, order: 5 },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: homepage,
    })
  } catch (error: any) {
    console.error('❌ Get homepage error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch homepage',
      },
      { status: 500 }
    )
  }
}

// PUT - Update homepage content
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

    // Use findOneAndUpdate with upsert for atomic operation (ensures single document)
    // This guarantees ONLY ONE homepage document exists in the database
    const homepage = await Homepage.findOneAndUpdate(
      {}, // Empty filter - find any document (there should only be one)
      { $set: body }, // Use $set to properly update fields
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true, // Apply schema defaults on insert
        runValidators: true, // Run schema validators
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Homepage updated successfully',
      data: homepage,
    })
  } catch (error: any) {
    console.error('❌ Update homepage error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update homepage',
      },
      { status: 500 }
    )
  }
}

