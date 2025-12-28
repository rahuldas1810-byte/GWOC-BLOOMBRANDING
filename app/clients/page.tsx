'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import { motion } from 'framer-motion'
import ClientShowcase from '@/components/clientshowcase'
import ImpactStats from '@/components/ImpactStats'
import ClientApproach from '@/components/ClientApproach'
import ClientSocialProof from '@/components/ClientSocialProof'
import { getClients } from '@/lib/content'

export default function Clients() {
  

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <div className="max-w-4xl">
            <motion.p 
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="label-text mb-8"
            >
              Our Clients
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="heading-1 mb-10"
            >
              Brands Who Trusted Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="body-text max-w-2xl"
            >
              Each collaboration reflects our approach to building clear, confident brand identities.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-near-black/60 font-sans mt-6 text-sm tracking-wide"
            >
              Trusted by founders, startups, and growing D2C brands.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* Client Showcase */}
      <ClientShowcase />

      {/* Approach Micro-Section */}
      <ClientApproach />

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
