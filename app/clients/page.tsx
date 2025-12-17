'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import { getClients } from '@/lib/content'
import type { Client } from '@/types'

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      const clientsData = await getClients()
      setClients(clientsData)
    }
    fetchClients()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">Our Work</p>
              <h1 className="heading-1 mb-10">Our Clients</h1>
              <p className="body-text max-w-2xl">
                We&apos;re proud to work with forward-thinking companies building brands that matter.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Clients Grid */}
      <SectionReveal>
        <section className="section-padding bg-white">
          <div className="container-custom">
            {clients.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-dark-choc/5">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-earl-gray p-14 md:p-20 text-center hover:bg-butter-yellow/30 transition-colors duration-500"
                  >
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="max-h-12 mx-auto object-contain"
                      />
                    ) : (
                      <p className="font-serif text-2xl text-dark-choc/70">{client.name}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="body-text text-near-black/50">
                  Client information will be displayed here.
                </p>
              </div>
            )}
          </div>
        </section>
      </SectionReveal>

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
