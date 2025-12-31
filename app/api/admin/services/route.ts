import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Service from '@/models/Service'

// GET - Get all services
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

    const services = await Service.find().sort({ order: 1 })

    return NextResponse.json({
      success: true,
      data: services,
    })
  } catch (error: any) {
    console.error('❌ Get services error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch services',
      },
      { status: 500 }
    )
  }
}

// POST - Create service
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
    const service = await Service.create(body)

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: service,
    })
  } catch (error: any) {
    console.error('❌ Create service error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create service',
      },
      { status: 500 }
    )
  }
}

