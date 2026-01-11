'use client'

import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { getSiteSettings } from '@/lib/content'

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
    <span ref={ref} className="font-serif text-5xl md:text-6xl lg:text-7xl text-dark-choc tracking-tight font-light">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export default function ImpactStats() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSiteSettings()
      if (data) {
        setSettings(data)
      }
    }
    fetchData()
  }, [])

  const stats = settings?.impactStats ? [
    { value: settings.impactStats.brandsCollaborated, suffix: '+', label: 'Brands Collaborated' },
    { value: settings.impactStats.successfulLaunches, suffix: '+', label: 'Successful Launches' },
    { value: settings.impactStats.industriesServed, suffix: '+', label: 'Industries Served' },
  ] : [
    { value: 20, suffix: '+', label: 'Brands Collaborated' },
    { value: 10, suffix: '+', label: 'Successful Launches' },
    { value: 4, suffix: '+', label: 'Industries Served' },
  ]

  return (
    <section className="relative py-32 md:py-40 bg-[#F0EBE5] overflow-hidden">
      {/* Subtle overlay for container feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-choc/[0.03] to-transparent pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover="hover"
              className="flex flex-col items-center text-center group cursor-default relative isolate"
            >
              {/* Breathing Glow Blob - Premium & Ethereal */}
              <motion.div 
                variants={{
                  hover: { scale: 1.4, opacity: 0.8 }
                }}
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 1.5 // Stagger breathing
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#E8E2D2] blur-3xl -z-10"
              />
              
              {/* Micro visual anchor - decorative dot */}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
                className="w-2 h-2 rounded-full bg-dark-choc/30 mb-8 group-hover:bg-dark-choc/50 transition-colors duration-300 relative z-10"
              />
              
              <div className="relative z-10">
                <Counter value={stat.value} suffix={stat.suffix} index={index} />
              </div>
              
              <span className="relative z-10 font-mono text-xs md:text-sm text-dark-choc/60 mt-6 uppercase tracking-[0.25em] font-semibold leading-relaxed">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
