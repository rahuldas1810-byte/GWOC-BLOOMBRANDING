'use client'

import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

const services = [
  {
    title: 'Brand Identity',
    description: 'Complete visual identity systems that define who you are. We create logos, color palettes, typography, and brand guidelines that work together to tell your story.',
    details: [
      'Logo design and variations',
      'Color palette and typography',
      'Brand guidelines document',
      'Visual identity system',
    ],
  },
  {
    title: 'Visual Design',
    description: 'Stunning design that communicates your brand story. From web design to print materials, we create visuals that resonate.',
    details: [
      'Web and digital design',
      'Print and packaging design',
      'Marketing materials',
      'Design system creation',
    ],
  },
  {
    title: 'Social Media Branding',
    description: 'Cohesive brand presence across all social platforms. We ensure your brand looks and feels consistent wherever your audience finds you.',
    details: [
      'Social media templates',
      'Content style guides',
      'Profile optimization',
      'Brand consistency audits',
    ],
  },
  {
    title: 'Content Strategy',
    description: 'Strategic messaging that resonates with your audience. We help you find your voice and communicate clearly.',
    details: [
      'Brand messaging framework',
      'Content guidelines',
      'Tone of voice development',
      'Messaging strategy',
    ],
  },
  {
    title: 'Creative Direction',
    description: 'End-to-end creative vision for your brand. We guide the entire creative process from concept to execution.',
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
            <div className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-earl-gray'}`}>
              <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                  <div className="lg:col-span-5">
                    <span className="font-mono text-xs text-dark-choc/30 mb-6 block tracking-[0.2em]">
                      0{index + 1}
                    </span>
                    <h2 className="heading-2 mb-8">{service.title}</h2>
                    <p className="body-text">{service.description}</p>
                  </div>
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
              <h2 className="font-serif text-white font-normal mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05 }}>
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
