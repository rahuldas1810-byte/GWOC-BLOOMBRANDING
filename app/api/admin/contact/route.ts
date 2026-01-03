import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import { revalidatePath } from 'next/cache'
import Contact from '@/models/Contact'

export const dynamic = 'force-dynamic'

// GET - Get contact content
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

    let contact = await Contact.findOne()
    if (!contact) {
      contact = await Contact.create({})
    }

    // Fallback FAQs if empty (so Admin has something to edit)
    const defaultFaqs = [
      {
        question: "What services does Bloom Branding offer?",
        answer: "We offer comprehensive branding services including brand identity design, logo creation, visual identity systems, brand strategy, content creation, and social media management. We work with businesses of all sizes to create cohesive brand experiences.",
      },
      {
        question: "Do you work with startups or only established brands?",
        answer: "We work with both startups and established brands. Whether you're just launching or looking to refresh your existing brand, we tailor our approach to meet your specific needs and goals.",
      },
      {
        question: "How long does a typical branding project take?",
        answer: "The timeline varies depending on the scope of the project. A complete brand identity typically takes 6-8 weeks, while smaller projects like logo design or content packages may take 2-4 weeks. We'll provide a detailed timeline after understanding your specific requirements.",
      },
      {
        question: "Can you handle only content or social media management?",
        answer: "Yes, we offer standalone content creation and social media management services. You can work with us for individual services or choose our comprehensive branding packages that include everything.",
      },
      {
        question: "Do you work with clients outside Surat?",
        answer: "Absolutely! While we're based in Surat, we work with clients across India and internationally. We conduct meetings via video calls and have streamlined processes to ensure smooth collaboration regardless of location.",
      },
      {
        question: "How do we start a project with Bloom Branding?",
        answer: "Simply fill out the contact form on this page or reach out via email. We'll schedule an initial consultation to discuss your project, understand your vision, and provide a customized proposal. From there, we'll guide you through our process step by step.",
      },
    ]

    const contactObj = contact.toObject()
    if (!contactObj.faqs || contactObj.faqs.length === 0) {
      contactObj.faqs = defaultFaqs
    }

    return NextResponse.json({
      success: true,
      data: contactObj,
    })
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

// PUT - Update contact content
export async function PUT(request: NextRequest) {
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

    // Properly handle heroBackgroundImage - ensure it's structured correctly
    const updateData: any = { ...body }
    if (body.heroBackgroundImage) {
      if (typeof body.heroBackgroundImage === 'object') {
        // If it's already an object, use it as is (handle both with and without url)
        if (body.heroBackgroundImage.url) {
          updateData.heroBackgroundImage = {
            url: body.heroBackgroundImage.url,
            mediaId: body.heroBackgroundImage.mediaId || null,
          }
        } else {
          // Empty object means clear the image
          updateData.heroBackgroundImage = {
            url: '',
            mediaId: null,
          }
        }
      } else if (typeof body.heroBackgroundImage === 'string' && body.heroBackgroundImage.trim() !== '') {
        // If it's a non-empty string URL, convert to object
        updateData.heroBackgroundImage = {
          url: body.heroBackgroundImage,
          mediaId: null,
        }
      } else {
        // Empty string means clear the image
        updateData.heroBackgroundImage = {
          url: '',
          mediaId: null,
        }
      }
    } else if (body.heroBackgroundImage === null || body.heroBackgroundImage === undefined) {
      // Allow clearing the image
      updateData.heroBackgroundImage = {
        url: '',
        mediaId: null,
      }
    }

    // Explicitly handle faqs array if present
    if (body.faqs && Array.isArray(body.faqs)) {
      updateData.faqs = body.faqs
    }

    const contact = await Contact.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )

    // Revalidate paths to purge cache
    revalidatePath('/contact')
    revalidatePath('/admin/contact')

    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    })
  } catch (error: any) {
    console.error('❌ Update contact error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update contact',
      },
      { status: 500 }
    )
  }
}

