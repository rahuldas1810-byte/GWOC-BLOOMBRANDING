'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ShowcaseClient } from '@/types'

export default function ClientShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHover = (index: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => {
      setActiveIndex(index)
    }, 200)
  }

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const clients: ShowcaseClient[] = [
    {
      name: 'Bloom Studio',
      type: 'D2C • Branding',
      review: 'We helped shape a bold and confident brand identity.',
      image: '/clients/elegant.jpeg',
    },
    {
      name: 'Nova Labs',
      type: 'Startup • Strategy',
      review: 'Positioned for clarity and early-stage growth.',
      image: '/clients/minimal.png',
    },
    {
      name: 'Echo Creators',
      type: 'Creator • Identity',
      review: 'Built a strong personal brand with consistency.',
      image: '/clients/techy.png',
    },
    {
      name: 'Pulse Tech',
      type: 'SaaS • Rebrand',
      review: 'Led a complete rebrand for a modern SaaS product.',
      image: '/clients/creativity.png',
    },
    {
      name: 'Urban D2C',
      type: 'Ecommerce • Launch',
      review: 'Supported a clean and confident product launch.',
      image: '/clients/urban.jpg',
    },
  ]

  // Dynamic positions and sizes
  const getPosition = (index: number) => {
    if (isMobile) {
      const mobileSpacing = 300
      const currentX = (index - 2) * mobileSpacing
      return { x: currentX, scale: index === 2 ? 1 : 0.75, opacity: index === 2 ? 1 : 0.3 }
    }
    if (isTablet) {
      const tabletPositions = [
        { x: -400, scale: 0.8 },
        { x: -220, scale: 0.9 },
        { x: 0, scale: 1.05 },
        { x: 220, scale: 0.9 },
        { x: 400, scale: 0.8 },
      ]
      return { ...tabletPositions[index], opacity: 1 }
    }
    const desktopPositions = [
      { x: -520, scale: 0.88 },
      { x: -300, scale: 0.95 },
      { x: 0, scale: 1.1 },
      { x: 300, scale: 0.95 },
      { x: 520, scale: 0.88 },
    ]
    return { ...desktopPositions[index], opacity: 1 }
  }

  const visibleClients = [
    clients[(activeIndex + clients.length - 2) % clients.length],
    clients[(activeIndex + clients.length - 1) % clients.length],
    clients[activeIndex],
    clients[(activeIndex + 1) % clients.length],
    clients[(activeIndex + 2) % clients.length],
  ]

  return (
    <section className="py-20 bg-[#F0EBE5] overflow-hidden">
      <div className="relative w-full">
        <div className="relative flex items-center justify-center h-[700px] w-full max-w-none overflow-visible">
          {visibleClients.map((client, i) => {
            const pos = getPosition(i)
            const isCenter = i === 2

            // Determine z-index based on position to ensure center is on top
            const zIndex = isCenter ? 10 : i === 1 || i === 3 ? 5 : 1

            return (
              <motion.div
                key={client.name}
                initial={false}
                animate={{ x: pos.x, scale: pos.scale, opacity: pos.opacity }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // smooth easeOut
                onMouseEnter={() =>
                  handleHover((activeIndex + i - 2 + clients.length) % clients.length)
                }
                className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${isCenter
                  ? 'w-[300px] h-[400px] md:w-[420px] md:h-[520px] bg-white hover:shadow-3xl'
                  : 'w-56 h-[320px] md:w-72 md:h-[420px] bg-gradient-to-br from-[#1E3570] via-[#2C4494] to-[#BDAF62] opacity-70 hover:opacity-85' // Brand electric blue + butter yellow gradient
                  }`}
                style={{ zIndex }}
              >
                <AnimatePresence mode="wait">
                  {isCenter && (
                    <motion.div
                      key="center-content"
                      className="flex h-full w-full flex-col relative group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* IMAGE SECTION */}
                      <div className="h-[65%] w-full overflow-hidden relative bg-gray-100">
                        <motion.img
                          src={client.image}
                          alt={client.name}
                          className="h-full w-full object-contain md:object-cover"
                          initial={{ scale: 1.02, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          whileHover={{ scale: 1.04 }}
                        />

                        {/* Hover Overlay - Only on center card */}
                        <motion.div
                          className="absolute inset-0 bg-dark-choc/20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        >
                          <motion.span
                            initial={{ opacity: 0, y: 6 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-white font-mono text-xs uppercase tracking-widest bg-dark-choc/90 px-5 py-2 rounded-full backdrop-blur-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100"
                          >
                            View Work →
                          </motion.span>
                        </motion.div>
                      </div>

                      {/* TEXT SECTION */}
                      <div className="flex h-[35%] flex-col items-center justify-center px-8 text-center bg-white relative z-10">
                        <motion.h3
                          className="text-2xl font-serif text-dark-choc mb-2"
                        >
                          {client.name}
                        </motion.h3>
                        <motion.p
                          className="text-xs font-mono uppercase tracking-widest text-dark-choc/50 mb-4"
                        >
                          {client.type}
                        </motion.p>
                        <motion.p
                          className="text-base text-near-black/80 font-sans leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          {client.review}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
