'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import SectionReveal from '@/components/SectionReveal'
import { submitContactForm } from '@/app/actions/contact'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function Contact() {
  const [isPending, startTransition] = useTransition()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('idle')
    setErrorMessage('')

    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      if (data.company) formData.append('company', data.company)
      formData.append('message', data.message)

      const result = await submitContactForm(formData)

      if (result.success) {
        setSubmitStatus('success')
        reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.message || 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">Let&apos;s Talk</p>
              <h1 className="heading-1 mb-10">Get in Touch</h1>
              <p className="body-text max-w-2xl">
                Ready to build your brand identity? Let&apos;s start a conversation.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Contact Form */}
      <SectionReveal>
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div className="lg:col-span-5">
                <p className="label-text mb-5">Contact</p>
                <h2 className="heading-2 mb-10">Send us a message.</h2>
                <p className="body-text mb-12">
                  Tell us about your project and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="space-y-8">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">Email</p>
                    <p className="font-sans text-lg text-near-black">hello@bloombranding.com</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">Instagram</p>
                    <p className="font-sans text-lg text-near-black">@bloom.branding_</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <div className="bg-earl-gray p-10 md:p-14">
                  {submitStatus === 'success' && (
                    <div className="mb-10 p-8 bg-butter-yellow/50">
                      <p className="font-sans text-dark-choc">
                        Thank you! Your message has been sent. We&apos;ll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-10 p-8 bg-white border-l-2 border-dark-choc">
                      <p className="font-sans text-dark-choc">
                        {errorMessage || 'Something went wrong. Please try again.'}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div>
                      <label htmlFor="name" className="block label-text mb-4">
                        Name <span className="text-electric-blue">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-colors duration-500 font-sans text-lg text-near-black placeholder:text-near-black/30"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-3 font-sans text-sm text-dark-choc">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block label-text mb-4">
                        Email <span className="text-electric-blue">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-colors duration-500 font-sans text-lg text-near-black placeholder:text-near-black/30"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-3 font-sans text-sm text-dark-choc">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="company" className="block label-text mb-4">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        {...register('company')}
                        className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-colors duration-500 font-sans text-lg text-near-black placeholder:text-near-black/30"
                        placeholder="Your company (optional)"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block label-text mb-4">
                        Message <span className="text-electric-blue">*</span>
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows={5}
                        className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-colors duration-500 font-sans text-lg text-near-black placeholder:text-near-black/30 resize-none"
                        placeholder="Tell us about your project..."
                      />
                      {errors.message && (
                        <p className="mt-3 font-sans text-sm text-dark-choc">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  )
}
