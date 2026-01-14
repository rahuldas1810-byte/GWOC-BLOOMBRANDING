'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Gem, Cpu, Leaf, TrendingUp, Armchair, Rocket, Heart, ShoppingBag, Camera, Music } from 'lucide-react'
import { getSectors } from '@/lib/content'

const ICON_MAP: { [key: string]: any } = {
  Gem,
  Cpu,
  Leaf,
  TrendingUp,
  Armchair,
  Rocket,
  Heart,
  ShoppingBag,
  Camera,
  Music,
}

// Sub-component to handle individual scroll transforms
function SectorCard({ sector, index, containerRef, isMobile }: { sector: any, index: number, containerRef: React.RefObject<HTMLElement>, isMobile: boolean }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  })

  // Stagger the movement
  const startOffset = index * 0.15
  const endOffset = startOffset + 0.35

  const y = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [isMobile ? 100 : 350, 0]
  )

  const opacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15],
    [0, 1]
  )

  const smoothY = useSpring(y, { damping: 25, stiffness: 80 })

  const IconComp = ICON_MAP[sector.icon] || Gem

  return (
    <motion.div
      style={{ y: smoothY, opacity }}
      whileHover={{
        scale: 1.03,
        y: -10,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      className={`
        relative h-[300px] sm:h-[350px] md:h-[400px] p-6 sm:p-8 md:p-10 flex flex-col justify-between 
        ${sector.color}
        hover:shadow-2xl transition-shadow duration-500 ease-out
        group cursor-pointer rounded-xl
      `}
    >
      {/* Icon Top */}
      <motion.div
        className="w-14 h-14 rounded-full border border-dark-choc/20 flex items-center justify-center text-dark-choc"
        whileHover={{ rotate: 15, scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <IconComp strokeWidth={1} size={28} />
      </motion.div>

      {/* Text Bottom */}
      <div>
        <h3 className="font-serif text-3xl sm:text-3xl md:text-4xl text-dark-choc mb-4 sm:mb-5 md:mb-6">
          {sector.name}
        </h3>
        <p className="font-sans text-sm sm:text-base text-dark-choc/80 leading-relaxed max-w-[200px]">
          {sector.description}
        </p>
      </div>

      {/* Subtle top border for definition */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/20" />
    </motion.div>
  )
}

export default function SectorShowcase() {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [sectors, setSectors] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSectors()
      if (data && data.length > 0) {
        setSectors(data)
      }
    }
    fetchData()

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (sectors.length === 0) return null

  return (
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 bg-[#F0EBE5] overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px]">
      {/* Increased max-width for wider cards */}
      <div className="mx-auto max-w-[1800px] w-full px-4 sm:px-6 md:px-12 overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {sectors.map((sector, index) => (
            <SectorCard
              key={sector._id || sector.id}
              sector={sector}
              index={index}
              containerRef={containerRef}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Final Alignment Hint / Decorative Baseline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 h-px w-full bg-dark-choc/10 origin-left"
        />
      </div>
    </section>
  )
}
