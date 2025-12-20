'use client'

import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import ScrollHorizontalMarquee from '@/components/ScrollHorizontalMarquee'
import Image from 'next/image'
import { motion } from 'framer-motion'
import MagneticButton from '@/components/MagneticButton'

const services = [
  {
    title: 'Brand Identity',
    description:
      'Complete visual identity systems that define who you are. We create logos, color palettes, typography, and brand guidelines that work together to tell your story.',
    details: [
      'Logo design and variations',
      'Color palette and typography',
      'Brand guidelines document',
      'Visual identity system',
    ],
  },
  {
    title: 'Visual Design',
    description:
      'Stunning design that communicates your brand story. From web design to print materials, we create visuals that resonate.',
    details: [
      'Web and digital design',
      'Print and packaging design',
      'Marketing materials',
      'Design system creation',
    ],
  },
  {
    title: 'Social Media Branding',
    description:
      'Cohesive brand presence across all social platforms. We ensure your brand looks and feels consistent wherever your audience finds you.',
    details: [
      'Social media templates',
      'Content style guides',
      'Profile optimization',
      'Brand consistency audits',
    ],
  },
  {
    title: 'Content Strategy',
    description:
      'Strategic messaging that resonates with your audience. We help you find your voice and communicate clearly.',
    details: [
      'Brand messaging framework',
      'Content guidelines',
      'Tone of voice development',
      'Messaging strategy',
    ],
  },
  {
    title: 'Creative Direction',
    description:
      'End-to-end creative vision for your brand. We guide the entire creative process from concept to execution.',
    details: [
      'Creative strategy',
      'Art direction',
      'Campaign development',
      'Brand evolution planning',
    ],
  },
]

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">What We Do</p>
              <h1 className="heading-1 mb-10">Our Services</h1>
              <p className="body-text max-w-2xl">
                Strategic branding services designed for companies ready to make an impact.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Services List */}
      <section>
        {services.map((service, index) => (
          <SectionReveal key={service.title} delay={index * 0.05}>
<div
  className={`section-padding relative overflow-hidden ${
    index % 2 === 0 ? 'bg-white' : 'bg-earl-gray'
  } ${
    service.title === 'Content Strategy'
      ? 'min-h-[80vh]'
      : ''
  }`}
>
{service.title === 'Brand Identity' && (
  <>
    <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none items-center justify-center">
      <Image
        src="/12.jpg"
        alt="Brand identity background"
        fill
        className="object-contain opacity-[0.48]"
        priority
      />
    </div>

    <div className="hidden lg:block absolute inset-0 z-[1] bg-gradient-to-r from-white/75 via-white/40 to-white/75" />
  </>
)}



              {/* Content Strategy background */}
              {service.title === 'Content Strategy' && (
                <>
                  <div className="absolute inset-0 opacity-[0.8] pointer-events-none z-0">
                    <ScrollHorizontalMarquee
                      images={['/story1.jpeg', '/story2.jpeg', '/story3.jpeg']}
                    />
                  </div>

                  <div className="absolute inset-0 z-[1] bg-gradient-to-r from-earl-gray/85 via-earl-gray/55 to-earl-gray/85" />
                </>
              )}

              <div className="relative z-10 container-custom">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 ${
                    service.title === 'Brand Identity' ? 'items-center' : ''
                  }`}
                >
                  {/* LEFT — TEXT */}
                  <div className="lg:col-span-5">
                    <span className="font-mono text-xs text-dark-choc/30 mb-6 block tracking-[0.2em]">
                      0{index + 1}
                    </span>
                    <h2 className="heading-2 mb-8">{service.title}</h2>
                    <p className="body-text">{service.description}</p>
                  </div>

{/* BRAND IDENTITY — VISUAL SYSTEM */}
{service.title === 'Brand Identity' && (
  <div className="lg:col-span-5 lg:col-start-8 mb-16 lg:mb-0">
    <div className="grid grid-cols-2 gap-4">
{[
  '/service1.jpeg',
  '/service2.jpeg',
  '/service3.jpeg',
  '/service4.jpeg',
].map((src, i) => (
  <MagneticButton
    key={i}
    className="block bg-transparent p-0 border-0 focus:outline-none"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      className="
        relative h-40 md:h-44
        rounded-xl overflow-hidden
        shadow-[0_20px_50px_rgba(0,0,0,0.08)]
        transition-all duration-500 ease-out
        hover:-translate-y-2
        hover:shadow-[0_30px_70px_rgba(0,0,0,0.15)]
        group
      "
    >
      <Image
        src={src}
        alt="Brand system visual"
        fill
        className="
          object-cover
          transition-transform duration-700 ease-out
          group-hover:scale-105
        "
      />

      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/30 via-black/5 to-transparent
          opacity-0
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />
    </motion.div>
  </MagneticButton>
))}

    </div>
  </div>
)}



                  {/* RIGHT — WHAT’S INCLUDED */}
                  <div className="lg:col-span-5 lg:col-start-8">
                    
                    <p className="label-text mb-8">What&apos;s Included</p>
                    <ul className="space-y-5">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-start">
                          <span className="text-electric-blue mr-5 mt-1 text-xs">—</span>
                          <span className="body-text">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        ))}
      </section>

      {/* CTA */}
      <SectionReveal>
        <section className="py-32 md:py-40 lg:py-48 bg-electric-blue">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-8">
                Ready to Start?
              </p>
              <h2
                className="font-serif text-white font-normal mb-12"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  lineHeight: 1.05,
                }}
              >
                Let&apos;s discuss
                <br />
                your project.
              </h2>
              <Link
                href="/contact"
                className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-electric-blue bg-white px-10 py-5 hover:bg-earl-gray transition-colors duration-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  )
}
