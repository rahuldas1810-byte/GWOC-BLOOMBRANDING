'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company') || undefined,
      message: formData.get('message'),
    }

    const validatedData = contactSchema.parse(rawData)

    // Log submission (in production, you might want to send an email or store elsewhere)
    console.log('Contact form submission:', {
      ...validatedData,
      submittedAt: new Date().toISOString(),
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

