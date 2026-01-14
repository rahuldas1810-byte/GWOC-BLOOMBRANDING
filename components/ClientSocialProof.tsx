'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getTestimonials, getSiteSettings } from '@/lib/content'

const FONT_STYLES = [
  'font-sans',
  'font-serif italic',
  'font-mono tracking-widest',
  'font-sans font-bold tracking-tighter',
  'font-serif uppercase tracking-widest',
  'font-serif italic',
  'font-sans font-light tracking-[0.3em]',
  'font-serif uppercase'
]

export default function ClientSocialProof() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [brands, setBrands] = useState<any[]>([])
  const [label, setLabel] = useState('Trusted by growing brands')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsData, settingsData] = await Promise.all([
          getTestimonials(),
          getSiteSettings()
        ])

        if (settingsData?.clientsHero?.socialLabel) {
          setLabel(settingsData.clientsHero.socialLabel)
        }

        if (testimonialsData && testimonialsData.length > 0) {
          const mappedBrands = testimonialsData.map((t, i) => ({
            name: t.company,
            quote: t.quote,
            author: `${t.clientName}, ${t.company}`,
            font: FONT_STYLES[i % FONT_STYLES.length]
          }))
          setBrands(mappedBrands)
        }
      } catch (error) {
        console.error('Error fetching social proof data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Time-based rotation
  useEffect(() => {
    if (brands.length === 0) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % brands.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [brands])

  if (loading || brands.length === 0) return null

  const activeBrand = brands[activeIndex]

  return (
    <section className="py-24 relative overflow-hidden bg-[#F0EBE5]">
      {/* Subtle vertical gradient background for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0EBE5] via-[#EAE1D5] to-[#F0EBE5] opacity-50 pointer-events-none" />

      <div className="container-custom mb-12 flex justify-center relative z-10">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dark-choc/60">
          {label}
        </span>
      </div>

      <div className="relative w-full flex flex-col z-10">
        {/* LOGO MARQUEE */}
        <div className="relative w-full flex mb-8">
          {/* Side Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F0EBE5] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F0EBE5] to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden group">
            <motion.div
              className="flex gap-16 sm:gap-24 md:gap-32 items-center whitespace-nowrap px-10"
              animate={{ x: "-50%" }}
              transition={{
                ease: "linear",
                duration: 40,
                repeat: Infinity
              }}
              style={{ width: "fit-content" }}
            >
              {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
                <motion.div
                  key={i}
                  className={`text-2xl sm:text-3xl md:text-4xl text-dark-choc/70 hover:text-dark-choc transition-all duration-[250ms] ease-out cursor-default select-none ${brand.font}`}
                  whileHover={{ scale: 1.08, y: -4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {brand.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* LINKED TESTIMONIAL WHISPER */}
        <div className="w-full min-h-[120px] flex flex-col items-center justify-center text-center relative px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrand.name + activeIndex} // Triggers animation on change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl text-dark-choc/90 italic leading-relaxed mb-4 md:mb-6 max-w-2xl text-center">
                &ldquo;{activeBrand.quote}&rdquo;
              </h3>
              {activeBrand.author && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/40"
                >
                  — {activeBrand.author}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
