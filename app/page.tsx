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
  {
    title: 'Marketing Campaigns',
    description: 'Data-driven campaigns designed to amplify reach and impact.',
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
      setTestimonials(testimonialsData)
      setClients(clientsData)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/video2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#1f1b16]/45" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl"
            >
              <p className="label-text mb-8 text-white/70">Helping Brands Bloom</p>
              <h1 className="heading-1 mb-10 text-white">
                We craft brand<br />identities that<br />
                <span className="text-electric-blue">resonate.</span>
              </h1>
              <p className="body-text max-w-xl mb-14 text-white/80">
                {homepageContent.heroSubheading}
              </p>
              <Link href="/contact" className="btn-primary">
                Start Your Project
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
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
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group relative bg-white p-10 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:bg-butter-yellow/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                >
                  <span className="pointer-events-none absolute inset-0 border border-electric-blue/0 transition-all duration-500 group-hover:border-electric-blue/40 scale-95 group-hover:scale-100" />
                  <h3 className="heading-3 mb-5 transition-colors group-hover:text-electric-blue">
                    {service.title}
                  </h3>
                  <p className="body-text text-near-black/60 group-hover:text-near-black/80">
                    {service.description}
                  </p>
                  <div className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-electric-blue opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    Explore →
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================= VIDEO BREAK ================= */}
      <section className="w-screen h-screen overflow-hidden bg-black">
        <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </section>

      {/* ================= CLIENTS ================= */}
      {clients.length > 0 && (
        <SectionReveal>
          <section className="section-padding bg-white">
            <div className="container-custom">
              <div className="text-center mb-20">
                <p className="label-text mb-5">Our Clients</p>
                <h2 className="heading-2">Trusted By</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
                {clients.map((client) => (
                  <span key={client.id} className="text-center font-serif text-xl text-dark-choc/40">
                    {client.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      )}

      {/* ================= TESTIMONIALS SLIDER ================= */}
      {testimonials.length > 0 && (
        <SectionReveal>
          <section className="section-padding bg-butter-yellow/40 overflow-hidden">
            <div className="container-custom">
              <div className="mb-20">
                <p className="label-text mb-5">Testimonials</p>
                <h2 className="heading-2">What Clients Say</h2>
              </div>

              <motion.div
                className="flex gap-8"
                animate={{ x: ['0%', '-100%'] }}
                transition={{
                  duration: 40,
                  ease: 'linear',
                  repeat: Infinity,
                }}
                drag="x"
                dragConstraints={{ left: -1000, right: 0 }}
              >
                {[...testimonials, ...testimonials].map((t, i) => (
<div
  key={`${t.id}-${i}`}
  className="
    relative min-w-[90%] md:min-w-[45%]
    bg-white p-10 md:p-14
    rounded-2xl
    max-w-[520px]
    border border-dark-choc/5
    shadow-[0_10px_40px_rgba(0,0,0,0.06)]
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    hover:-translate-y-1
    transition-all duration-500
  "
>
  {/* Decorative Quote */}
  <span className="absolute -top-6 -left-4 text-[6rem] leading-none font-serif text-electric-blue/10">
    “
  </span>

  <p className="font-serif text-[1.75rem] leading-snug text-dark-choc mb-10">
    {t.quote}
  </p>

  <div className="border-t border-dark-choc/10 pt-6">
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc">
      {t.clientName}
    </p>
    <p className="text-sm text-near-black/50 mt-1">
      {t.company}
    </p>
  </div>
</div>

                ))}
              </motion.div>
            </div>
          </section>
        </SectionReveal>
      )}
    </div>
  )
}
