'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

interface ScrollHorizontalMarqueeProps {
  images: string[]
}

export default function ScrollHorizontalMarquee({ images }: ScrollHorizontalMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])

  return (
    <div ref={ref} className="relative w-full min-h-[60vh]
 overflow-hidden">
      <motion.div
        style={{ x }}
        className="flex items-center gap-10 w-max"
      >
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="min-w-[32vw] md:min-w-[28vw] lg:min-w-[24vw]
                       rounded-3xl overflow-hidden bg-black/5"
          >
            <Image
              src={src}
              alt="Instagram storytelling visual"
              width={1080}
              height={1350} // Instagram 4:5 ratio
              className="w-full h-full object-contain object-center"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

