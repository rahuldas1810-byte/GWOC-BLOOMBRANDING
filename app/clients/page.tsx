'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import ClientShowcase from '@/components/clientshowcase'
import { getClients } from '@/lib/content'

export default function Clients() {
  

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">Our Clients</p>
              <h1 className="heading-1 mb-10">Brands Who Trusted Us</h1>
              <p className="body-text max-w-2xl">
                
                Each collaboration reflects our approach to building clear, confident brand identities.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Client Showcase */}
      <ClientShowcase />

      {/* CTA */}
      <SectionReveal>
        <section className="section-padding bg-butter-yellow/40">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="label-text mb-5">Join Them</p>
              <h2 className="heading-2 mb-10">Ready to work together?</h2>
              <p className="body-text mb-12">
                Let&apos;s build your brand identity together.
              </p>
              <Link href="/contact" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  )
}
