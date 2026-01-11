'use client'

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion"
import { getSiteSettings } from "@/lib/content"

function Counter({ value, suffix, index }: { value: number; suffix: string; index: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.2,
      })
      return controls.stop
    }
  }, [count, isInView, value, index])

  return (
    <span ref={ref} className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tighter font-light">
      <motion.span>{rounded}</motion.span>
      <span className="text-[#BDAF62]">{suffix}</span>
    </span>
  )
}

function PolygonEnclosure({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* The Polygon SVG */}
      <motion.div
        initial={{ rotate: -15, opacity: 0, scale: 0.8 }}
        whileInView={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-0"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 drop-shadow-[0_0_30px_rgba(30,53,112,0.3)]"
        >
          {/* Main Glass Polygon */}
          <motion.path
            d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            className="backdrop-blur-sm"
          />
          {/* Animated Glow Border */}
          <motion.path
            d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
            fill="none"
            stroke="url(#polyGradient)"
            strokeWidth="2"
            strokeDasharray="10 400"
            animate={{
              strokeDashoffset: [410, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <defs>
            <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BDAF62" stopOpacity="0" />
              <stop offset="50%" stopColor="#BDAF62" />
              <stop offset="100%" stopColor="#BDAF62" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* The Content (Number) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        {children}
      </div>
    </div>
  )
}

export default function ImpactStats() {
  const [settings, setSettings] = useState<any>(null)
  const containerRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSiteSettings()
      if (data) setSettings(data)
    }
    fetchData()

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - left) / width,
        y: (e.clientY - top) / height,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = settings?.impactStats ? [
    { value: settings.impactStats.brandsCollaborated, suffix: '+', label: 'Brands', sublabel: 'COLLABORATED' },
    { value: settings.impactStats.successfulLaunches, suffix: '+', label: 'Successful', sublabel: 'LAUNCHES' },
    { value: settings.impactStats.industriesServed, suffix: '+', label: 'Industries', sublabel: 'SERVED' },
  ] : [
    { value: 20, suffix: '+', label: 'Brands', sublabel: 'COLLABORATED' },
    { value: 10, suffix: '+', label: 'Successful', sublabel: 'LAUNCHES' },
    { value: 4, suffix: '+', label: 'Industries', sublabel: 'SERVED' },
  ]

  return (
    <section ref={containerRef} className="relative py-12 md:py-16 lg:py-20 bg-[#0A0A0A] overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Deep Radial Glows */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#1E3570]/10 blur-[150px] -translate-x-1/2 -translate-y-1/2"
          animate={{
            x: (mousePosition.x - 0.5) * 50,
            y: (mousePosition.y - 0.5) * 50,
          }}
        />


        {/* Architectural Mesh */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, #FDF6EE 1px, transparent 0),
            linear-gradient(to right, #FDF6EE 1px, transparent 1px),
            linear-gradient(to bottom, #FDF6EE 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 200px 200px, 200px 200px',
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Headline - Split Editorial Style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 lg:mb-32 items-end">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.6em] text-[#BDAF62] mb-4 sm:mb-6 md:mb-8 block font-black">
                Experience Served
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[0.85] tracking-tighter">
                Global<br />
                <span className="italic relative font-light">
                  Impact.
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    className="absolute -bottom-2 left-0 h-1 bg-[#BDAF62]/30"
                  />
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:pb-4"
            >
              <p className="font-sans text-base sm:text-lg md:text-xl text-white/50 leading-relaxed max-w-md font-light">
                We don&apos;t just chase numbers; we build <span className="text-white italic">legacies</span>. Every launch is a definitive move in a global brand strategy.
              </p>
            </motion.div>
          </div>

          {/* Stats Cards - Balanced Architectural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center relative gap-8 sm:gap-12 md:gap-0">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`
                  relative flex flex-col items-center justify-center p-6 sm:p-8 md:p-14
                  group cursor-default
                  ${index !== 2 ? 'md:border-r border-white/5' : ''}
                `}
              >
                {/* Polygon Enclosure with Reactive Scaling */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative mb-8 sm:mb-10 md:mb-12"
                >
                  <PolygonEnclosure index={index}>
                    <Counter value={stat.value} suffix={stat.suffix} index={index} />
                  </PolygonEnclosure>
                </motion.div>

                {/* Sub-labeling */}
                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 relative z-10 transition-transform duration-500 group-hover:translate-y-1">
                  <span className="font-serif text-xl sm:text-2xl text-white/80 italic">{stat.label}</span>
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#BDAF62] font-black">{stat.sublabel}</span>
                </div>

                {/* Vertical accent on hover - architectural detail */}
                <div className="absolute top-0 right-0 w-px h-0 bg-[#BDAF62]/20 group-hover:h-full transition-all duration-1000 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div >

      {/* Edge Shadow Overlays */}
      < div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
    </section >
  )
}
