'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/content'

export default function ClientApproach() {
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

  const approach = settings?.clientApproach || {
    eyebrow: 'Our Approach',
    title: 'Design meaningful connections.',
    statements: [
      'We partner directly with founders.',
      'We prioritize clarity over trends.',
      'We build brands that are ready to scale.',
    ],
  }

  return (
    <section className="py-24 md:py-32 bg-earl-gray overflow-hidden">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl pt-16 md:pt-24"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8 relative">
            
            {/* Animated Divider Line - 0% to 100% width */}
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="h-px bg-dark-choc/20 absolute top-0 left-0 hidden md:block"
            />
            {/* Mobile divider - centered */}
             <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="h-px bg-dark-choc/20 absolute top-0 left-1/2 -translate-x-1/2 md:hidden"
            />

            {/* Eyebrow */}
            <div className="pt-8 w-full"> {/* Padding to clear the absolute divider */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }} // Divider starts 0.1, this roughly follows
                className="font-mono text-xs uppercase tracking-widest text-dark-choc/60 block mb-6"
              >
                {approach.eyebrow}
              </motion.span>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }} // 0.15s after divider (0.1)
                className="font-serif text-3xl md:text-4xl text-dark-choc leading-tight mb-8"
              >
                {approach.title}
              </motion.h2>

              {/* Staggered Statements */}
              <div className="space-y-3 md:pl-1">
                {approach.statements.map((text: string, i: number) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + (i * 0.12), ease: 'easeOut' }} // Stagger 0.12s
                    className="font-sans text-lg text-near-black/80 font-medium"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
