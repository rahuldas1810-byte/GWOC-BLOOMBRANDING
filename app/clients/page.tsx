'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import { motion } from 'framer-motion'
import ClientShowcase from '@/components/clientshowcase'
import ImpactStats from '@/components/ImpactStats'
import ClientSocialProof from '@/components/ClientSocialProof'
import { getClients, getSiteSettings } from '@/lib/content'

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

  const hero = settings?.clientsHero || {
    label: 'Our Clients',
    title: 'Brands Who Trusted Us',
    description: 'Each collaboration reflects our approach to building clear, confident brand identities.',
    subtitle: 'Trusted by founders, startups, and growing D2C brands.',
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-36 md:py-48 lg:py-56 overflow-hidden bg-gradient-to-br from-earl-gray via-earl-gray/95 to-butter-yellow/20">
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
                {hero.label}
              </p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-dark-choc mb-8 md:mb-12 leading-[1.1] tracking-tight font-light"
            >
              {hero.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto"
            >
              <p className="body-text text-lg md:text-xl lg:text-2xl text-dark-choc/80 leading-relaxed mb-8 font-sans">
                {hero.description}
              </p>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-dark-choc/60 font-sans text-base md:text-lg tracking-wide max-w-2xl mx-auto"
            >
              {hero.subtitle}
            </motion.p>

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

      {/* CTA */}
      {/* CTA - Emotional Peak */}
      <motion.section 
        className="min-h-[70vh] flex items-center justify-center relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              duration: 0.9, 
              ease: "easeOut",
              staggerChildren: 0.15 
            }
          }
        }}
      >
        {/* Option A - Soft Gradient Canvas */}
        <div className="absolute inset-0 bg-earl-gray" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-butter-yellow/60 via-earl-gray/50 to-earl-gray opacity-80" />

        <div className="container-custom relative z-10 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Eyebrow */}
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-dark-choc/60 mb-8 block"
            >
              Let&apos;s Build Together
            </motion.span>
            
            {/* Headline */}
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-dark-choc mb-10 leading-[1.1] tracking-tight"
            >
              Ready to work together?
            </motion.h2>
            
            {/* Supporting Text */}
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-sans text-lg md:text-xl text-near-black/60 max-w-xl mb-16 leading-relaxed"
            >
              We build brands that founders are proud to lead.
            </motion.p>
            
            {/* Premium Button */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Link 
                href="/contact" 
                className="inline-block bg-dark-choc text-white px-14 py-6 rounded-full text-sm uppercase tracking-[0.2em] font-medium shadow-2xl shadow-dark-choc/10 hover:shadow-dark-choc/20 transition-shadow duration-300"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
