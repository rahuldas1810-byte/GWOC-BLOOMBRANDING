import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Brand from '@/models/Brand'

// GET - List all brands (admin)
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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const query: any = {}
    if (category) query.category = category

    const brands = await Brand.find(query).sort({ order: 1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: brands,
    })
  } catch (error: any) {
    console.error('❌ Get brands error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch brands',
      },
      { status: 500 }
    )
  }
}

// POST - Create brand
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
    const { name, category, description, logo, image, order, isActive } = body

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Brand name is required' },
        { status: 400 }
      )
    }

    const brand = await Brand.create({
      name,
      category: category || '',
      description: description || '',
      logo: logo || {},
      image: image || {},
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    })
  } catch (error: any) {
    console.error('❌ Create brand error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create brand',
      },
      { status: 500 }
    )
  }
}

