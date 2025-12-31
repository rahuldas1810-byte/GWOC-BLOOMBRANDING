import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import OurStory from '@/models/OurStory'

// GET - Get our story content
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

    let ourStory = await OurStory.findOne()
    if (!ourStory) {
      ourStory = await OurStory.create({})
    }

    return NextResponse.json({
      success: true,
      data: ourStory,
    })
  } catch (error: any) {
    console.error('❌ Get our story error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch our story',
      },
      { status: 500 }
    )
  }
}

// PUT - Update our story content
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
    
    // Ensure purposeStats is properly structured
    if (body.purposeStats) {
      const brandsBuilt = body.purposeStats.brandsBuilt !== undefined && body.purposeStats.brandsBuilt !== null
        ? Number(body.purposeStats.brandsBuilt)
        : 0
      const satisfaction = body.purposeStats.satisfaction !== undefined && body.purposeStats.satisfaction !== null
        ? Number(body.purposeStats.satisfaction)
        : 0
      
      body.purposeStats = {
        brandsBuilt: isNaN(brandsBuilt) ? 0 : brandsBuilt,
        satisfaction: isNaN(satisfaction) ? 0 : satisfaction,
      }
    }
    
    const ourStory = await OurStory.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Our story updated successfully',
      data: ourStory,
    })
  } catch (error: any) {
    console.error('❌ Update our story error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update our story',
      },
      { status: 500 }
    )
  }
}

