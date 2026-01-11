'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import { motion } from 'framer-motion'
import ClientShowcase from '@/components/clientshowcase'
import ImpactStats from '@/components/ImpactStats'
import ClientSocialProof from '@/components/ClientSocialProof'
import { getClients, getSiteSettings } from '@/lib/content'
import SectorShowcase from '@/components/SectorShowcase'

export default function Clients() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSiteSettings()
      if (data) {
        setSettings(data)
      }
    }
    fetchData()

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative bg-[#0A0A0A] overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] md:h-[90vh] md:min-h-[700px] flex items-center bg-[#FDF6EE] overflow-hidden">
        <div className="container-custom relative z-10 w-full">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              <p className="label-text mb-6 md:mb-8 text-[#BDAF62] font-mono text-xs sm:text-sm md:text-base uppercase tracking-[0.4em] md:tracking-[0.6em] font-black opacity-80">
                Strategic Partnerships
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-dark-choc mb-8 md:mb-12 leading-[1.1] md:leading-[0.85] tracking-tighter px-4"
            >
              Building <span className="relative inline-block">
                <span className="italic font-light relative z-10 text-dark-choc/90">Legacies</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 1, ease: "circOut" }}
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#BDAF62]/60 to-transparent origin-left"
                />
              </span><br />
              <span className="text-dark-choc/80">not just Logos.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto px-4"
            >
              <p className="body-text text-base sm:text-lg md:text-xl lg:text-2xl text-dark-choc/60 leading-relaxed mb-8 md:mb-12 font-light tracking-tight">
                A strategic collective for ambitious founders who want to <span className="text-[#BDAF62] font-medium">define the next era</span> of global culture.
              </p>
            </motion.div>

            {/* Architectural Scroll Anchor */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 64, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1, ease: "circOut" }}
              className="mx-auto w-[2px] bg-gradient-to-b from-[#BDAF62] to-transparent mt-8 md:mt-16"
            />
          </div>
        </div>

        {/* Sharp Architectural Cut */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-dark-choc/5 z-[5]" />
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* Client Showcase */}
      <ClientShowcase />

      {/* Linked Social Proof (Logos + Testimonials) */}
      <ClientSocialProof />

      {/* Sector Showcase */}
      <SectorShowcase />

      {/* CTA - Fill on Hover */}
      <Link href="/contact" className="block">
        <section className="relative h-[50vh] min-h-[300px] md:h-[60vh] md:min-h-[400px] flex items-center justify-center bg-dark-choc overflow-hidden cursor-pointer group px-4">
          {/* Expanding Background Bubble */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-[#F0EBE5] rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:w-[150%] group-hover:h-[150%]" />

          {/* Content */}
          <div className="relative z-10 text-center mix-blend-normal">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl text-[#F0EBE5] transition-all duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-dark-choc group-hover:scale-110 group-hover:tracking-widest group-hover:italic">
              Let&apos;s Talk.
            </h2>
          </div>
        </section>
      </Link>
    </div>
  )
}
