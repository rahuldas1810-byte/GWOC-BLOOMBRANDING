import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import SiteSettings from '@/models/SiteSettings'

// GET - Get site settings
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

    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create({})
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error: any) {
    console.error('❌ Get site settings error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch site settings',
      },
      { status: 500 }
    )
  }
}

// PUT - Update site settings
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
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Site settings updated successfully',
      data: settings,
    })
  } catch (error: any) {
    console.error('❌ Update site settings error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update site settings',
      },
      { status: 500 }
    )
  }
}

