import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/backend/db'
import Brand from '@/models/Brand'
import Testimonial from '@/models/Testimonial'
import Banner from '@/models/Banner'
import Client from '@/models/Client'
import Media from '@/models/Media'
import Enquiry from '@/models/Enquiry'
import Service from '@/models/Service'

// GET - Get admin dashboard statistics
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

    const [brands, services, testimonials, banners, clients, media, newEnquiries] = await Promise.all([
      Brand.countDocuments(),
      Service.countDocuments(),
      Testimonial.countDocuments(),
      Banner.countDocuments(),
      Client.countDocuments(),
      Media.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        brands,
        services,
        testimonials,
        banners,
        clients,
        media,
        newEnquiries,
      },
    })
  } catch (error: any) {
    console.error('❌ Get stats error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch stats',
      },
      { status: 500 }
    )
  }
}

