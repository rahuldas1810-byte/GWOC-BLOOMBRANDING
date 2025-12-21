'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
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

  const positions = [
    { x: -520, scale: 0.88 },
    { x: -300, scale: 0.95 },
    { x: 0, scale: 1.1 },
    { x: 300, scale: 0.95 },
    { x: 520, scale: 0.88 },
  ]

  const visibleClients = [
    clients[(activeIndex + clients.length - 2) % clients.length],
    clients[(activeIndex + clients.length - 1) % clients.length],
    clients[activeIndex],
    clients[(activeIndex + 1) % clients.length],
    clients[(activeIndex + 2) % clients.length],
  ]

  return (
    <section className="py-20 bg-[#E0D2C2]">
      <div className="relative w-full">
        <div className="relative flex items-center justify-center h-[700px] w-screen max-w-none overflow-visible">
          {visibleClients.map((client, i) => {
            const pos = positions[i]
            const isCenter = i === 2

            return (
              <motion.div
                key={client.name}
                animate={{ x: pos.x, scale: pos.scale }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onMouseEnter={() =>
                  handleHover(
                    (activeIndex + i - 2 + clients.length) % clients.length
                  )
                }
                className={`absolute rounded-2xl overflow-hidden transition-opacity duration-300 ${
                  isCenter
                    ? 'w-[420px] h-[520px] z-10 bg-white'
                    : 'w-72 h-[420px] bg-gradient-to-br from-pink-400 to-yellow-300 opacity-60'
                }`}
              >
                {isCenter && (
                  <div className="flex h-full w-full flex-col">
                    {/* IMAGE SECTION */}
                    <div className="h-[65%] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={client.image}
                        alt={client.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* TEXT SECTION */}
                    <div className="flex h-[35%] flex-col items-center justify-center px-6 text-center">
                      <h3 className="text-xl mb-1">{client.name}</h3>
                      <p className="text-sm opacity-70">{client.type}</p>
                      <p className="text-sm mt-2">{client.review}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
