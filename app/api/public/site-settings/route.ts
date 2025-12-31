import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import SiteSettings from '@/models/SiteSettings'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: Get site settings
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const settings = await SiteSettings.findOne()

    if (!settings) {
      const response = NextResponse.json({
        success: true,
        data: {
          experienceStats: {
            years: 4,
            clients: 75,
            projects: 100,
          },
          impactStats: {
            brandsCollaborated: 20,
            successfulLaunches: 10,
            industriesServed: 4,
            yearsExperience: 2,
          },
          clientApproach: {
            eyebrow: 'Our Approach',
            title: 'Design meaningful connections.',
            statements: [
              'We partner directly with founders.',
              'We prioritize clarity over trends.',
              'We build brands that are ready to scale.',
            ],
          },
          servicesHero: {
            label: 'What We Do',
            title: 'Our Services',
            description: 'Strategic branding services designed for companies ready to make an impact.',
          },
          clientsHero: {
            label: 'Our Clients',
            title: 'Brands Who Trusted Us',
            description: 'Each collaboration reflects our approach to building clear, confident brand identities.',
            subtitle: 'Trusted by founders, startups, and growing D2C brands.',
          },
          homepageSections: {
            clientsLabel: 'Our Clients',
            clientsTitle: 'Trusted By',
          },
          ourStoryAdditional: {
            whoWeAreLabel: 'Who We Are',
            additionalParagraph: 'We work with startups, D2C brands, and creators who are ready to make a real impact. Our team combines strategic thinking with clean, confident design. We don\'t chase trends. We build brands that stand the test of time.',
          },
          contactLabels: {
            heroSubtitle: 'Projects • Collaborations • Brand Enquiries',
            formLabel: 'Contact',
            formTitle: 'Send us a message.',
            formDescription: 'Tell us about your project and we\'ll get back to you within 24 hours.',
          },
          testimonialsHero: {
            label: 'Our Partners',
            title: 'Testimonials',
            description: 'Hear from companies who have worked with us to build their brand identity.',
            buttonText: 'Client Stories',
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
      data: settings,
    })
    
    // Disable caching - always return fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('❌ Get site settings error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch site settings',
      },
      { status: 500 }
    )
  }
}

