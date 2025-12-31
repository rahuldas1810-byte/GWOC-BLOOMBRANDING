import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Enquiry from '@/models/Enquiry'

// GET - Get single enquiry
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

    const enquiry = await Enquiry.findById(params.id)
    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    })
  } catch (error: any) {
    console.error('❌ Get enquiry error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch enquiry',
      },
      { status: 500 }
    )
  }
}

// PUT - Update enquiry (status, notes)
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
    const { status, notes } = body

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const enquiry = await Enquiry.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry,
    })
  } catch (error: any) {
    console.error('❌ Update enquiry error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update enquiry',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete enquiry
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

    const enquiry = await Enquiry.findByIdAndDelete(params.id)
    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete enquiry error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete enquiry',
      },
      { status: 500 }
    )
  }
}

