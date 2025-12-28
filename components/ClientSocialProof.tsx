'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const brands = [
  { 
    name: 'NOVA LABS', 
    font: 'font-sans',
    quote: "They brought clarity when everything felt scattered.",
    author: "Founder, Nova Labs"
  },
  { 
    name: 'Bloom Studio', 
    font: 'font-serif italic',
    quote: "Strategic, calm, and deeply thoughtful.",
    author: "Director, Bloom Studio"
  },
  { 
    name: 'ECHO', 
    font: 'font-mono tracking-widest',
    quote: "The brand finally feels like us.",
    author: "CEO, Echo"
  },
  { 
    name: 'Pulse', 
    font: 'font-sans font-bold tracking-tighter',
    quote: "A partnership that truly transformed our trajectory.",
    author: "CMO, Pulse"
  },
  { 
    name: 'URBAN', 
    font: 'font-serif uppercase tracking-widest',
    quote: "Minimalism with maximum impact.",
    author: "Founder, Urban D2C"
  },
  { 
    name: 'Velvet', 
    font: 'font-serif italic',
    quote: "Elegant execution at every touchpoint.",
    author: "Creative Lead, Velvet"
  },
  { 
    name: 'AURA', 
    font: 'font-sans font-light tracking-[0.3em]',
    quote: "We found our voice in the noise.",
    author: "Head of Brand, Aura"
  },
  { 
    name: 'MUSE', 
    font: 'font-serif uppercase',
    quote: "Design that speaks before you read.",
    author: "Editor, Muse"
  },
]

export default function ClientSocialProof() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Time-based rotation for "illusion" of sync
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % brands.length)
    }, 4000) // 4 seconds interval

    return () => clearInterval(timer)
  }, [])

  const activeBrand = brands[activeIndex]

  return (
    <section className="py-24 relative overflow-hidden bg-earl-gray">
      {/* Subtle vertical gradient background for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-earl-gray via-[#EAE1D5] to-earl-gray opacity-50 pointer-events-none" />
      
      <div className="container-custom mb-12 flex justify-center relative z-10">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dark-choc/60">
          Trusted by growing brands
        </span>
      </div>

      <div className="relative w-full flex flex-col z-10">
        {/* LOGO MARQUEE */}
        <div className="relative w-full flex mb-8"> {/* Reduced gap */}
          {/* Side Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-earl-gray to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-earl-gray to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden group">
            <motion.div
              className="flex gap-24 md:gap-32 items-center whitespace-nowrap px-10"
              animate={{ x: "-50%" }}
              transition={{ 
                ease: "linear", 
                duration: 40, // Continuous ambient motion
                repeat: Infinity 
              }}
              style={{ width: "fit-content" }}
            >
              {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
                <div 
                  key={i}
                  className={`text-3xl md:text-4xl text-dark-choc/70 hover:text-dark-choc transition-all duration-[250ms] ease-out cursor-default select-none transform hover:scale-[1.04] hover:-translate-y-[3px] hover:drop-shadow-sm ${brand.font}`}
                >
                  {brand.name}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* LINKED TESTIMONIAL WHISPER */}
        <div className="w-full min-h-[120px] flex flex-col items-center justify-center text-center relative px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrand.name} // Triggers animation on change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-dark-choc/90 italic leading-relaxed mb-6 max-w-2xl">
                “{activeBrand.quote}”
              </h3>
              {activeBrand.author && (
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/40">
                  — {activeBrand.author}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
