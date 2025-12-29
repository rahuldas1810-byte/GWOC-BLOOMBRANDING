'use server'

import { z } from 'zod'

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

    // Submit to API
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    const result = await response.json()

    if (result.success) {
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

