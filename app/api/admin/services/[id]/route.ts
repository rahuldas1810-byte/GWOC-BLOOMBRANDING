import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Service from '@/models/Service'

// GET - Get single service
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

    const service = await Service.findById(params.id)
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: service,
    })
  } catch (error: any) {
    console.error('❌ Get service error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch service',
      },
      { status: 500 }
    )
  }
}

// PUT - Update service
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
    const service = await Service.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    })
  } catch (error: any) {
    console.error('❌ Update service error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update service',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
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

    const service = await Service.findByIdAndDelete(params.id)
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete service error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete service',
      },
      { status: 500 }
    )
  }
}

