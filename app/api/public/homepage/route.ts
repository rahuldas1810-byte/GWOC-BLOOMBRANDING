import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/backend/db'
import Homepage from '@/models/Homepage'

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get homepage content (read-only)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const homepage = await Homepage.findOne().select(
      'heroHeadline heroSubheading heroImage heroVideo backgroundVideo sectionVideo aboutPreview tagline servicesPreview sections createdAt'
    )

    if (!homepage) {
      // Return default content if no homepage exists
      const response = NextResponse.json({
        success: true,
        data: {
          heroHeadline: 'We craft brand identities that resonate.',
          heroSubheading: 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
          aboutPreview: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
          tagline: 'Helping Brands Bloom',
          servicesPreview: [],
          sections: {
            hero: { enabled: true, order: 1 },
            about: { enabled: true, order: 2 },
            services: { enabled: true, order: 3 },
            clients: { enabled: true, order: 4 },
            testimonials: { enabled: true, order: 5 },
          },
        },
      })
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }

    const response = NextResponse.json({
      success: true,
      data: homepage,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get homepage error:', error)
    // Return default content on error for graceful degradation
    const response = NextResponse.json({
      success: true,
      data: {
        heroHeadline: 'We craft brand identities that resonate.',
        heroSubheading: 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
        aboutPreview: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
        tagline: 'Helping Brands Bloom',
        servicesPreview: [],
        sections: {
          hero: { enabled: true, order: 1 },
          about: { enabled: true, order: 2 },
          services: { enabled: true, order: 3 },
          clients: { enabled: true, order: 4 },
          testimonials: { enabled: true, order: 5 },
        },
      },
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }
}

