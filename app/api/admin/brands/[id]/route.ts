import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Brand from '@/models/Brand'

// GET - Get single brand
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

    const brand = await Brand.findById(params.id)
    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: brand,
    })
  } catch (error: any) {
    console.error('❌ Get brand error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch brand',
      },
      { status: 500 }
    )
  }
}

// PUT - Update brand
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
    const { name, category, description, logo, image, order, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (logo !== undefined) updateData.logo = logo
    if (image !== undefined) updateData.image = image
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const brand = await Brand.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    })
  } catch (error: any) {
    console.error('❌ Update brand error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update brand',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete brand
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

    const brand = await Brand.findByIdAndDelete(params.id)
    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete brand error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete brand',
      },
      { status: 500 }
    )
  }
}

