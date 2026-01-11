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
    <div className="min-h-screen relative">

      {/* Hero */}
      <section className="relative py-36 md:py-48 lg:py-56 overflow-hidden bg-[#F0EBE5]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 47, 47, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              <p className="label-text mb-6 md:mb-8 text-dark-choc/70 font-mono text-sm md:text-base uppercase tracking-[0.3em] font-semibold">
                Our Clients
              </p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-dark-choc mb-8 md:mb-12 leading-[1.1] tracking-tight"
            >
              We build <span className="relative inline-block">
                <span className="italic font-serif relative z-10">Legacies</span>
                <motion.svg 
                  className="absolute -bottom-1 left-0 w-full h-[0.25em] text-dark-choc/30 -z-0 pointer-events-none"
                  viewBox="0 0 100 15" 
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                >
                  <path d="M2 5 Q 50 12, 98 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </motion.svg>
              </span> not just Logos.
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto"
            >
              <p className="body-text text-lg md:text-xl lg:text-2xl text-dark-choc/80 leading-relaxed mb-8 font-sans">
                Bloom Branding is a strategic design partner for ambitious founders who want to define the next generation of culture.
              </p>
            </motion.div>
            


            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 md:mt-16 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-dark-choc/20 to-transparent"
            />
          </div>
        </div>
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
        <section className="relative h-[60vh] flex items-center justify-center bg-dark-choc overflow-hidden cursor-pointer group">
          {/* Expanding Background Bubble */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-[#F0EBE5] rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:w-[150%] group-hover:h-[150%]" />
          
          {/* Content */}
          <div className="relative z-10 text-center mix-blend-normal">
            <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl text-[#F0EBE5] transition-all duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-dark-choc group-hover:scale-110 group-hover:tracking-widest group-hover:italic">
              Let&apos;s Talk.
            </h2>
          </div>
        </section>
      </Link>
    </div>
  )
}
