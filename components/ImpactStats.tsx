'use client'

import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

const stats = [
  { value: 20, suffix: '+', label: 'Brands Collaborated' },
  { value: 10, suffix: '+', label: 'Successful Launches' },
  { value: 4, suffix: '+', label: 'Industries Served' },
  { value: 2, suffix: '+ Years', label: 'Brand Building Experience' },
]

function Counter({ value, suffix, index }: { value: number; suffix: string; index: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1], // Custom easeOut for premium feel
        delay: index * 0.1, // Stagger start of counting
      })
      return controls.stop
    }
  }, [count, isInView, value, index])

  return (
    <span ref={ref} className="font-serif text-5xl md:text-6xl text-dark-choc tracking-tight">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export default function ImpactStats() {
  return (
    <section className="relative py-32 bg-earl-gray overflow-hidden">
      {/* Subtle overlay for container feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-choc/[0.03] to-transparent pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 pl-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
              className="flex flex-col items-start group"
            >
              {/* Micro visual anchor - vertical line */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 + (index * 0.1), ease: 'easeOut' }}
                className="w-px bg-dark-choc/20 mb-8"
              />
              
              <Counter value={stat.value} suffix={stat.suffix} index={index} />
              
              <span className="font-mono text-xs text-dark-choc/50 mt-5 uppercase tracking-[0.2em] font-medium leading-relaxed max-w-[150px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
