'use server'

import { z } from 'zod'
import { sendQueryConfirmationEmail } from '@/backend/email'
import connectDB from '@/lib/db'
import Enquiry from '@/models/Enquiry'

// Force Node.js runtime for this server action
export const runtime = 'nodejs'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company') || undefined,
      message: formData.get('message'),
      phone: formData.get('phone') || undefined,
    }

    const validatedData = contactSchema.parse(rawData)

    // Connect to database
    await connectDB()

    // Create enquiry directly in DB
    const enquiry = await Enquiry.create({
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company || '',
      phone: validatedData.phone || '',
      message: validatedData.message,
      status: 'new',
    })

    if (!enquiry) {
      throw new Error('Failed to create enquiry record')
    }

    // Send confirmation email to user (non-blocking)
    sendQueryConfirmationEmail(validatedData.email, validatedData.name)
      .then((emailSent) => {
        if (emailSent) {
          console.log('✅ Confirmation email sent to:', validatedData.email)
        } else {
          console.warn('⚠️ Failed to send confirmation email to:', validatedData.email)
        }
      })
      .catch((error) => {
        console.error('❌ Error sending confirmation email:', error)
        // Don't throw - email failure shouldn't block form submission
      })

    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Please check your input and try again.',
      }
    }

    console.error('Error submitting contact form:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    }
  }
}

