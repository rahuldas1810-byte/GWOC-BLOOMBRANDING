'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function SectionReveal({
  children,
  delay = 0,
  direction = 'up',
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
        y: direction === 'up' ? 12 : direction === 'down' ? -12 : 0,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
