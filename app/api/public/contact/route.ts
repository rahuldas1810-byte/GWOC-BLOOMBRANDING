import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Contact from '@/models/Contact'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get contact content
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const contact = await Contact.findOne()

    if (!contact) {
      const response = NextResponse.json({
        success: true,
        data: {
          heroLabel: "Let's Talk",
          heroTitle: 'Get in Touch',
          heroDescription: 'Ready to build your brand identity? Let\'s start a conversation.',
          heroBackgroundImage: {
            url: '/mainlogo.png',
            mediaId: null,
          },
          formTitle: 'Send us a message',
          formDescription: 'Fill out the form below and we\'ll get back to you as soon as possible.',
          socialLinks: {},
          address: {
            line1: 'Bloom Branding, Solarium',
            line2: 'Business Centre, 515,',
            line3: 'beside Times Corner, Surat,',
            line4: 'Gujarat 395007',
          },
          email: 'hello@bloombranding.com',
          phone: '+91 1234567890',
        },
      })
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }

    const response = NextResponse.json({
      success: true,
      data: contact,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get contact error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch contact',
      },
      { status: 500 }
    )
  }
}

