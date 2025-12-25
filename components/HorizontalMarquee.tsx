'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HorizontalMarqueeProps {
  images: string[]
  gradientClass?: string
}

export default function HorizontalMarquee({ images, gradientClass = "from-white" }: HorizontalMarqueeProps) {
  return (
    <div className="relative w-full overflow-hidden group">

      {/* LEFT EDGE FADE */}
      <div className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-32
                      bg-gradient-to-r ${gradientClass} to-transparent`} />

      {/* RIGHT EDGE FADE */}
      <div className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-32
                      bg-gradient-to-l ${gradientClass} to-transparent`} />

      <motion.div
        className="flex gap-10 w-max"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          ease: 'linear',
          duration: 120,
          repeat: Infinity,
        }}
        style={{
          animationPlayState: 'running',
        }}
        whileHover={{
          animationPlayState: 'paused',
        }}
      >
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw]
                       rounded-3xl overflow-hidden
                       shadow-[0_40px_120px_rgba(0,0,0,0.18)]"
          >
            <Image
              src={src}
              alt="Bloom Branding work"
              width={1600}
              height={900}
              className="w-full h-[70vh] object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
