import { useState, useRef } from 'react'
import type { Client } from '@/types'
import { motion } from 'framer-motion'


export default function ClientShowcase() {
    const [activeIndex, setActiveIndex] = useState(0)
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null)


    const handleHover = (index: number) => {
  if (hoverTimeout.current) {
    clearTimeout(hoverTimeout.current)
  }

  hoverTimeout.current = setTimeout(() => {
    setActiveIndex(index)
  }, 200)
}


    const clients = [
  {
    name: 'Bloom Studio',
    type: 'D2C • Branding',
    review: 'We helped shape a bold and confident brand identity.'
  },
  {
    name: 'Nova Labs',
    type: 'Startup • Strategy',
    review: 'Positioned for clarity and early-stage growth.'
  },
  {
    name: 'Echo Creators',
    type: 'Creator • Identity',
    review: 'Built a strong personal brand with consistency.'
  },
  {
    name: 'Pulse Tech',
    type: 'SaaS • Rebrand',
    review: 'Led a complete rebrand for a modern SaaS product.'
  },
  {
    name: 'Urban D2C',
    type: 'Ecommerce • Launch',
    review: 'Supported a clean and confident product launch.'
  }
]

    const positions = [
  { x: -240, scale: 0.8, opacity: 0.4 }, // far left
  { x: -120, scale: 0.9, opacity: 0.6 }, // left
  { x: 0, scale: 1, opacity: 1 },        // center
  { x: 120, scale: 0.9, opacity: 0.6 },  // right
  { x: 240, scale: 0.8, opacity: 0.4 }   // far right
]

    const visibleClients = [
  clients[(activeIndex + clients.length - 2) % clients.length],
  clients[(activeIndex + clients.length - 1) % clients.length],
  clients[activeIndex],
  clients[(activeIndex + 1) % clients.length],
  clients[(activeIndex + 2) % clients.length],
]


  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="relative flex items-center justify-center h-[420px] overflow-hidden">
            {visibleClients.map((client, i) => {
                const pos = positions[i]
                const isCenter = i === 2

                return (
                  <motion.div
                    key={client.name}
                    animate={{
                        x: pos.x,
                        scale: pos.scale,
                        opacity: pos.opacity,
                    }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className={`absolute rounded-2xl ${
                    isCenter
                        ? 'w-64 h-80 bg-black text-white z-10'
                        : 'w-40 h-56 bg-gradient-to-br from-pink-400 to-yellow-300'
                    }`}
                    onMouseEnter={() =>
                        handleHover((activeIndex + i - 2 + clients.length) % clients.length)
                    }
                >
                    {isCenter && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.3 }}
                            className="h-full flex flex-col items-center justify-center px-6 text-center"
                            >
                            <h3 className="text-xl mb-2">{client.name}</h3>
                            <p className="text-sm opacity-70">{client.type}</p>
                            <p className="text-sm mt-4">{client.review}</p>
                        </motion.div>
                    )}
                </motion.div>
            )
         })}
        </div>

      </div>
    </section>
  )
}
