'use server'

import { z } from 'zod'
import { sendQueryConfirmationEmail } from '@/backend/email'
import connectDB from '@/lib/db'
import Enquiry from '@/models/Enquiry'



const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

// ... (imports remain the same)

export async function submitContactForm(formData: FormData) {
  console.log('SERVER ACTION: submitContactForm started'); // Debug log

  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company') || undefined,
      message: formData.get('message'),
      phone: formData.get('phone') || undefined,
    }

    console.log('SERVER ACTION: Parsing data', rawData); // Debug log

    const validatedData = contactSchema.parse(rawData)

    // Connect to database
    console.log('SERVER ACTION: Connecting to DB...'); // Debug log
    await connectDB()
    console.log('SERVER ACTION: DB Connected'); // Debug log

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

    console.log('SERVER ACTION: Enquiry created', enquiry._id); // Debug log

    // Send confirmation email to user (non-blocking)
    // We wrap this in a try/catch to ensure it NEVER fails the main request
    try {
      sendQueryConfirmationEmail(validatedData.email, validatedData.name)
        .then((emailSent) => {
          if (emailSent) {
            console.log('✅ Confirmation email sent to:', validatedData.email)
          } else {
            console.warn('⚠️ Failed to send confirmation email to:', validatedData.email)
          }
        })
        .catch((error) => {
          console.error('❌ Error sending confirmation email (async):', error)
        })
    } catch (emailError) {
      console.error('❌ Synchronous error in email block (ignored):', emailError);
    }

    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    }

  } catch (error: any) {
    console.error('SERVER ACTION ERROR:', error); // Critical Debug Log

    if (error instanceof z.ZodError) {
      // Serialize Zod errors to a simple object
      const fieldErrors = error.flatten().fieldErrors;
      // Convert array of messages to single string for client safety
      const simpleErrors: Record<string, string> = {};
      Object.keys(fieldErrors).forEach(key => {
        if (fieldErrors[key] && fieldErrors[key]!.length > 0) {
          simpleErrors[key] = fieldErrors[key]![0];
        }
      });

      return {
        success: false,
        errors: simpleErrors,
        message: 'Please check your input and try again.',
      }
    }

    // Generic error fallback
    return {
      success: false,
      message: error.message || 'Something went wrong. Please try again later.',
    }
  }
}

