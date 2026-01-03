'use server'

import { z } from 'zod'
import { sendQueryConfirmationEmail } from '@/backend/email'

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

    // Submit to API - use absolute URL for server actions
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: `Server error: ${response.status}` }
      }
      throw new Error(errorData.message || 'Failed to submit enquiry')
    }

    const result = await response.json()

    if (result.success) {
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
    } else {
      throw new Error(result.message || 'Failed to submit enquiry')
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

