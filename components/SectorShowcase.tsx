'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Gem, Cpu, Leaf, TrendingUp, Armchair } from 'lucide-react'

const sectors = [
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Defining modern luxury.',
    icon: Gem,
    // Muted Sage / Eucalyptus
    color: 'bg-[#C5CBB4]',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Humanizing digital experiences.',
    icon: Cpu,
    // Soft Warm Greige
    color: 'bg-[#D8D4CC]',
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Cultivating balance.',
    icon: Leaf,
    // Muted Clay / Terra
    color: 'bg-[#D4C5B8]',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Building trust.',
    icon: TrendingUp,
    // Slate / Stone
    color: 'bg-[#B8C0C4]',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    description: 'Crafting memorable stays.',
    icon: Armchair,
    // Warm Sand
    color: 'bg-[#CDC7B6]',
  },
]

// Sub-component to handle individual scroll transforms
function SectorCard({ sector, index, containerRef, isMobile }: { sector: any, index: number, containerRef: React.RefObject<HTMLElement>, isMobile: boolean }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start animation when the top of the section hits the bottom of the viewport
    // End animation when the card is well into view
    offset: ["start end", "center center"]
  })

  // Stagger the movement
  // Adjusted spacing so all cards fit within the [0, 1] scroll progress
  // Index 4 (last card) will start at 0.6 and end at 0.95
  const startOffset = index * 0.15
  const endOffset = startOffset + 0.35

  const y = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [isMobile ? 100 : 350, 0] // Reduce movement on mobile
  )

  const opacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15],
    [0, 1]
  )

  // Add spring physics for that "really really smooth" feel
  // Damping 25, Stiffness 80 is a nice heavy/smooth setting
  const smoothY = useSpring(y, { damping: 25, stiffness: 80 })

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
        <sector.icon strokeWidth={1} size={28} />
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 bg-[#F0EBE5] overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px]">
      {/* Increased max-width for wider cards */}
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {sectors.map((sector, index) => (
            <SectorCard
              key={sector.id}
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
