'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import { getTestimonials } from '@/lib/content'
import type { Testimonial } from '@/types'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsData = await getTestimonials()
      setTestimonials(testimonialsData)
    }
    fetchTestimonials()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">Client Stories</p>
              <h1 className="heading-1 mb-10">Testimonials</h1>
              <p className="body-text max-w-2xl">
                Hear from companies who&apos;ve worked with us to build their brand identity.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Testimonials Grid */}
      <SectionReveal>
        <section className="section-padding bg-white">
          <div className="container-custom">
            {testimonials.length > 0 ? (
              <div className="space-y-1 bg-dark-choc/5">
                {testimonials.map((testimonial, index) => (
                  <SectionReveal key={testimonial.id} delay={index * 0.08}>
                    <div className={`p-14 md:p-20 ${index % 2 === 0 ? 'bg-earl-gray' : 'bg-butter-yellow/30'}`}>
                      <div className="max-w-4xl">
                        <p className="font-serif text-2xl md:text-4xl text-dark-choc mb-12 leading-snug">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-px bg-dark-choc/20" />
                          <div>
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc">
                              {testimonial.clientName}
                            </p>
                            <p className="font-sans text-sm text-near-black/50 mt-2">
                              {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="body-text text-near-black/50">
                  Testimonials will be displayed here.
                </p>
              </div>
            )}
          </div>
        </section>
      </SectionReveal>

      {/* CTA */}
      <SectionReveal>
        <section className="py-32 md:py-40 lg:py-48 bg-electric-blue">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-8">
                Your Story Next
              </p>
              <h2 className="font-serif text-white font-normal mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05 }}>
                Ready to build
                <br />
                your brand?
              </h2>
              <Link 
                href="/contact" 
                className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-electric-blue bg-white px-10 py-5 hover:bg-earl-gray transition-colors duration-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  )
}
