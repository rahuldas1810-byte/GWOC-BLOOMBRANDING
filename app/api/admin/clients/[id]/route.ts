import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Client from '@/models/Client'

// GET - Get single client
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

    const client = await Client.findById(params.id)
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error: any) {
    console.error('❌ Get client error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch client',
      },
      { status: 500 }
    )
  }
}

// PUT - Update client
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
    const { name, logo, category, order, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (logo !== undefined) updateData.logo = logo
    if (category !== undefined) updateData.category = category
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const client = await Client.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    })
  } catch (error: any) {
    console.error('❌ Update client error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update client',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete client
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

    const client = await Client.findByIdAndDelete(params.id)
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    })
  } catch (error: any) {
    console.error('❌ Delete client error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete client',
      },
      { status: 500 }
    )
  }
}

