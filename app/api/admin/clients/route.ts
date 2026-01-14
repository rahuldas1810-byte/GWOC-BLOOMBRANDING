import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Client from '@/models/Client'

// GET - List all clients (admin)
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

    const clients = await Client.find().sort({ order: 1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: clients,
    })
  } catch (error: any) {
    console.error('❌ Get clients error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch clients',
      },
      { status: 500 }
    )
  }
}

// POST - Create client
export async function POST(request: NextRequest) {
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
    const { name, logo, category, description, order, isActive } = body

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Client name is required' },
        { status: 400 }
      )
    }

    const client = await Client.create({
      name,
      logo: logo || {},
      category: category || '',
      description: description || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      data: client,
    })
  } catch (error: any) {
    console.error('❌ Create client error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create client',
      },
      { status: 500 }
    )
  }
}

