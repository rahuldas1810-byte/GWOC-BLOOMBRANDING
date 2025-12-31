import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Testimonial from '@/models/Testimonial'

// GET - Get single testimonial
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

    const testimonial = await Testimonial.findById(params.id)
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    })
  } catch (error: any) {
    console.error('❌ Get testimonial error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch testimonial',
      },
      { status: 500 }
    )
  }
}

// PUT - Update testimonial
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
    const { quote, clientName, company, profileImage, order, isActive } = body

    const updateData: any = {}
    if (quote !== undefined) updateData.quote = quote
    if (clientName !== undefined) updateData.clientName = clientName
    if (company !== undefined) updateData.company = company
    if (profileImage !== undefined) updateData.profileImage = profileImage
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    })
  } catch (error: any) {
    console.error('❌ Update testimonial error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update testimonial',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete testimonial
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

    const testimonial = await Testimonial.findByIdAndDelete(params.id)
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete testimonial error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete testimonial',
      },
      { status: 500 }
    )
  }
}

