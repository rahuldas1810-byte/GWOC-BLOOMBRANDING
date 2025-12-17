'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionReveal from '@/components/SectionReveal'
import { getTestimonials, getClients } from '@/lib/content'
import { homepageContent } from '@/content/homepage'
import type { Testimonial, Client } from '@/types'

const services = [
  {
    title: 'Brand Identity',
    description: 'Complete visual identity systems that define who you are.',
  },
  {
    title: 'Visual Design',
    description: 'Stunning design that communicates your brand story.',
  },
  {
    title: 'Social Media Branding',
    description: 'Cohesive brand presence across all social platforms.',
  },
  {
    title: 'Content Strategy',
    description: 'Strategic messaging that resonates with your audience.',
  },
  {
    title: 'Creative Direction',
    description: 'End-to-end creative vision for your brand.',
  },
]

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [testimonialsData, clientsData] = await Promise.all([
        getTestimonials(),
        getClients(),
      ])
      setTestimonials(testimonialsData.slice(0, 2))
      setClients(clientsData)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-5xl"
          >
            <p className="label-text mb-8">Helping Brands Bloom</p>
            <h1 className="heading-1 mb-10">
              We craft brand
              <br />
              identities that
              <br />
              <span className="text-electric-blue">resonate.</span>
            </h1>
            <p className="body-text max-w-xl mb-14">
              {homepageContent.heroSubheading}
            </p>
            <Link href="/contact" className="btn-primary">
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <SectionReveal>
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              <div className="lg:col-span-6">
                <p className="label-text mb-5">About Us</p>
                <h2 className="heading-2 mb-10">Who We Are</h2>
                <p className="body-text mb-10">
                  {homepageContent.aboutPreview}
                </p>
                <Link
                  href="/our-story"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-electric-blue hover:text-electric-blue-dark transition-colors duration-500"
                >
                  Learn More →
                </Link>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                <div className="image-placeholder aspect-[4/5] bg-butter-yellow/50" />
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Services Preview */}
      <SectionReveal>
        <section className="section-padding bg-earl-gray">
          <div className="container-custom">
            <div className="mb-20">
              <p className="label-text mb-5">What We Do</p>
              <h2 className="heading-2 mb-8">Our Services</h2>
              <p className="body-text max-w-2xl">
                Strategic branding services designed for companies ready to make an impact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-dark-choc/5">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                  className="bg-white p-10 md:p-12 hover:bg-butter-yellow/20 transition-colors duration-500"
                >
                  <h3 className="heading-3 mb-5">{service.title}</h3>
                  <p className="body-text text-near-black/60">{service.description}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-16">
              <Link href="/services" className="btn-secondary">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Client Logos */}
      {clients.length > 0 && (
        <SectionReveal>
          <section className="section-padding bg-white">
            <div className="container-custom">
              <div className="text-center mb-20">
                <p className="label-text mb-5">Our Clients</p>
                <h2 className="heading-2">Trusted By</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center">
                {clients.map((client) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                  >
                    <span className="font-serif text-xl text-dark-choc/40">
                      {client.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      )}

      {/* Testimonials Highlight */}
      {testimonials.length > 0 && (
        <SectionReveal>
          <section className="section-padding bg-butter-yellow/40">
            <div className="container-custom">
              <div className="mb-20">
                <p className="label-text mb-5">Testimonials</p>
                <h2 className="heading-2">What Clients Say</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white p-10 md:p-14"
                  >
                    <p className="font-serif text-2xl md:text-[1.75rem] text-dark-choc mb-10 leading-snug">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc">
                        {testimonial.clientName}
                      </p>
                      <p className="font-sans text-sm text-near-black/50 mt-2">
                        {testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-16">
                <Link 
                  href="/testimonials" 
                  className="font-mono text-xs uppercase tracking-[0.2em] text-electric-blue hover:text-electric-blue-dark transition-colors duration-500"
                >
                  Read More Testimonials →
                </Link>
              </div>
            </div>
          </section>
        </SectionReveal>
      )}

      {/* Final CTA */}
      <SectionReveal>
        <section className="py-32 md:py-40 lg:py-48 bg-electric-blue">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-8">
                Ready to Start?
              </p>
              <h2 className="font-serif text-white font-normal mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05 }}>
                Let&apos;s build your
                <br />
                brand together.
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
