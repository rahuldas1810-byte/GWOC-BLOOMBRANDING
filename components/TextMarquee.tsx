'use client'
import { motion } from 'framer-motion'

interface TextMarqueeProps {
  text: string
  className?: string
  repeat?: number
}

export default function TextMarquee({ text, className = "", repeat = 4 }: TextMarqueeProps) {
  return (
    <div className={`relative w-full overflow-hidden border-b border-dark-choc/20 py-4 ${className}`}>
      <motion.div
        className="flex whitespace-nowrap gap-16"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          ease: 'linear',
          duration: 30,
          repeat: Infinity,
        }}
      >
        {Array.from({ length: repeat * 2 }).map((_, index) => (
          <span key={index} className="font-mono text-4xl md:text-64xl tracking-widest text-dark-choc uppercase opacity-80">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
