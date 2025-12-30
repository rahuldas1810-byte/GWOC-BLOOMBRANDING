'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from "next/link"
import { Instagram } from 'lucide-react'


import { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import SectionReveal from '@/components/SectionReveal'
import { submitContactForm } from '@/app/actions/contact'
import { getContact, getSiteSettings } from '@/lib/content'

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
  const [contactData, setContactData] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [data, settings] = await Promise.all([
        getContact(),
        getSiteSettings(),
      ])
      if (data) {
        setContactData(data)
      }
      if (settings) {
        setSiteSettings(settings)
      }
    }
    fetchData()
    
    // Refresh every 5 seconds to catch admin updates quickly
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Fallback data
  const data = contactData || {
    heroLabel: "Let's Talk",
    heroTitle: 'Get in Touch',
    heroDescription: 'Ready to build your brand identity? Let\'s start a conversation.',
    heroBackgroundImage: { url: '/mainlogo.png', mediaId: null },
    formTitle: 'Send us a message.',
    formDescription: 'Tell us about your project and we\'ll get back to you within 24 hours.',
    email: 'hello@bloombranding.com',
    socialLinks: {
      instagram: 'https://www.instagram.com/bloom.branding_/',
    },
    address: {
      line1: 'Bloom Branding, Solarium',
      line2: 'Business Centre, 515,',
      line3: 'beside Times Corner, Surat,',
      line4: 'Gujarat 395007',
    },
  }
  
  // Safely get background image URL - handle both object and string formats
  const backgroundImageUrl = data?.heroBackgroundImage 
    ? (typeof data.heroBackgroundImage === 'string' 
        ? data.heroBackgroundImage 
        : (data.heroBackgroundImage?.url || '/mainlogo.png'))
    : '/mainlogo.png'

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
<section className="relative min-h-[90vh] overflow-hidden flex items-center bg-earl-gray">

  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <Image
      src={backgroundImageUrl}
      alt="Bloom Branding background"
      fill
      className="object-cover object-center opacity-100"
      priority
      unoptimized={backgroundImageUrl?.startsWith('http') || false}
    />
  </div>

  {/* Single soft overlay (NOT too strong) */}
  <div className="absolute inset-0 z-10 bg-earl-gray/70" />

  {/* Content */}
  <div className="relative z-20 container-custom w-full">
    <div className="grid grid-cols-1 lg:grid-cols-12 items-center">

      {/* empty space to push text right */}
      <div className="hidden lg:block lg:col-span-8" />

      {/* text column */}
      <div className="lg:col-span-4">
        <SectionReveal>
          <div className="max-w-xl ml-auto">

            <p className="label-text mb-6">{data.heroLabel}</p>

           <h1 className="heading-1 mb-8 whitespace-nowrap">
  {data.heroTitle}
</h1>


            <p className="body-text">
              {data.heroDescription}
            </p>

            <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/50 mt-8">
              {siteSettings?.contactLabels?.heroSubtitle || 'Projects • Collaborations • Brand Enquiries'}
            </p>

          </div>
        </SectionReveal>
      </div>

    </div>
  </div>
</section>




      {/* Contact Form */}
      <SectionReveal>
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              
              <div className="lg:col-span-5">
                <p className="label-text mb-5">{siteSettings?.contactLabels?.formLabel || 'Contact'}</p>
                <h2 className="heading-2 mb-10">{siteSettings?.contactLabels?.formTitle || data.formTitle || 'Send us a message.'}</h2>
                <p className="body-text mb-12">
                  {siteSettings?.contactLabels?.formDescription || data.formDescription || 'Tell us about your project and we\'ll get back to you within 24 hours.'}
                </p>
                <div className="space-y-8">
                  {data.email && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">Email</p>
                      <p className="font-sans text-lg text-near-black">{data.email}</p>
                    </div>
                  )}
                  {data.socialLinks?.instagram && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                        Instagram
                      </p>
                      <Link
                        href={data.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 font-sans text-lg text-near-black"
                      >
                        <Instagram
                          size={18}
                          strokeWidth={1.5}
                          className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <span className="relative">
                          {data.socialLinks.instagram.includes('instagram.com/') 
                            ? '@' + data.socialLinks.instagram.split('instagram.com/')[1]?.replace('/', '')
                            : '@bloom.branding_'}
                          <span
                            className="absolute left-0 -bottom-1 h-[1px] w-0 bg-near-black transition-all duration-300 group-hover:w-full"
                          />
                        </span>
                      </Link>
                    </div>
                  )}
                  {data.address && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">Address</p>
                      <address className="font-sans text-lg text-near-black not-italic">
                        {data.address.line1 && <p>{data.address.line1}</p>}
                        {data.address.line2 && <p>{data.address.line2}</p>}
                        {data.address.line3 && <p>{data.address.line3}</p>}
                        {data.address.line4 && <p>{data.address.line4}</p>}
                      </address>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <div className="relative bg-earl-gray p-10 md:p-14 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.12)]">

                  {submitStatus === 'success' && (
                    <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
  className="mb-10 p-8 bg-butter-yellow/50"
>

                      
                      <p className="font-sans text-dark-choc">
                        Thank you! Your message has been sent. We&apos;ll get back to you soon.
                      </p>
                    </motion.div>
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
                        className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30"

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
                       className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30"

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
                        className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30"

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
                       className="w-full px-0 py-5 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30"

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
                      {isPending ? 'Sending...' : 'Start the Conversation'}

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
