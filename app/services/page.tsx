'use client'

import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import ScrollHorizontalMarquee from '@/components/ScrollHorizontalMarquee'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from '@/components/MagneticButton'
import { useState, useEffect } from 'react'
import { getServices, getSiteSettings } from '@/lib/content'

export default function Services() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)
  const [services, setServices] = useState<any[]>([])
  const [hero, setHero] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [servicesData, settingsData] = await Promise.all([
        getServices(),
        getSiteSettings(),
      ])
      
      // Transform API data to match component structure
      if (servicesData) {
        const transformed = servicesData.map((service: any) => ({
          title: service.title,
          description: service.description,
          details: service.details || [],
          images: service.images?.map((img: any) => img.url || img) || [],
        }))
        setServices(transformed)
      }
      
      if (settingsData?.servicesHero) {
        setHero(settingsData.servicesHero)
      }
    }
    fetchData()
    
    // Refresh data every 30 seconds to catch admin updates
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fallback services if API fails or empty
  const fallbackServices = [
    {
      title: 'Brand Identity',
      description:
        'Complete visual identity systems that define who you are. We create logos, color palettes, typography, and brand guidelines that work together to tell your story.',
      details: [
        'Logo design and variations',
        'Color palette and typography',
        'Brand guidelines document',
        'Visual identity system',
      ],
      images: [
        '/service1.jpeg',
        '/service2.jpeg',
        '/service3.jpeg',
        '/service4.jpeg',
      ],
    },
    {
      title: 'Visual Design',
      description:
        'Stunning design that communicates your brand story. From web design to print materials, we create visuals that resonate.',
      details: [
        'Web and digital design',
        'Print and packaging design',
        'Marketing materials',
        'Design system creation',
      ],
      images: [
        '/visual1.jpeg',
        '/visual2.jpeg',
        '/visual3.jpeg',
        '/visual4.jpeg',
      ],
    },
    {
      title: 'Social Media Branding',
      description:
        'Cohesive brand presence across all social platforms. We ensure your brand looks and feels consistent wherever your audience finds you.',
      details: [
        'Social media templates',
        'Content style guides',
        'Profile optimization',
        'Brand consistency audits',
      ],
      images: [
        '/23.jpg',
        '/24.jpg',
        '/25.jpg',
        '/26.jpg',
      ],
    },
    {
      title: 'Content Strategy',
      description:
        'Strategic messaging that resonates with your audience. We help you find your voice and communicate clearly.',
      details: [
        'Brand messaging framework',
        'Content guidelines',
        'Tone of voice development',
        'Messaging strategy',
      ],
      images: [
        '/content1.jpeg',
        '/content2.jpeg',
        '/content4.jpeg',
        '/content3.jpeg',
      ],
    },
    {
      title: 'Creative Direction',
      description:
        'End-to-end creative vision for your brand. We guide the entire creative process from concept to execution.',
      details: [
        'Creative strategy',
        'Art direction',
        'Campaign development',
        'Brand evolution planning',
      ],
      images: [
        '/creative1.jpeg',
        '/creative3.jpeg',
        '/11.jpg',
        '/12.jpg',
      ],
    },
  ]

  const displayServices = services.length > 0 ? services : fallbackServices

  if (displayServices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earl-gray to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue/20 border-t-electric-blue rounded-full mx-auto mb-6 animate-spin" />
          <p className="text-dark-choc/70 font-mono text-sm uppercase tracking-wider font-semibold">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-earl-gray via-white to-earl-gray">
      {/* HERO */}
      <section className="py-32 md:py-40 lg:py-48 bg-gradient-to-br from-earl-gray via-white to-butter-yellow/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(44,68,148,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <SectionReveal>
            <div className="max-w-5xl">
              <p className="font-mono text-electric-blue text-sm md:text-base mb-6 md:mb-8 uppercase tracking-[0.25em] font-semibold">
                {hero?.label || 'What We Do'}
              </p>
              <h1 className="font-serif text-dark-choc font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 md:mb-12 leading-[1.1] tracking-tight">
                {hero?.title || 'Our Services'}
              </h1>
              <p className="text-near-black/90 font-sans text-lg md:text-xl lg:text-2xl max-w-3xl leading-relaxed font-light">
                {hero?.description || 'Strategic branding services designed for companies ready to make an impact.'}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* DESKTOP SPLIT */}
      <section className="hidden lg:flex relative items-start bg-gradient-to-b from-white to-earl-gray/30">
        {/* LEFT STICKY */}
        <div className="w-1/2 sticky top-0 h-screen flex flex-col justify-center px-12 xl:px-24 border-r-2 border-dark-choc/10 bg-gradient-to-br from-earl-gray via-white to-butter-yellow/5 z-20 shadow-[4px_0_20px_rgba(0,0,0,0.02)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeServiceIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <span className="font-mono text-sm md:text-base text-electric-blue/70 mb-8 block tracking-[0.3em] font-semibold">
                0{activeServiceIndex + 1} / 0{displayServices.length}
              </span>
              <h2 className="font-serif text-dark-choc font-bold text-4xl xl:text-5xl mb-10 leading-tight tracking-tight">
                {displayServices[activeServiceIndex]?.title}
              </h2>
              <p className="text-near-black/85 font-sans text-lg xl:text-xl leading-relaxed font-light">
                {displayServices[activeServiceIndex]?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SCROLL */}
        <div className="w-1/2">
          {displayServices.map((service, index) => (
            <motion.div
              key={service.title || index}
              className={`min-h-[100vh] flex flex-col justify-center px-12 xl:px-24 py-32 relative ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-earl-gray/50 to-white'
                }`}
              onViewportEnter={() => setActiveServiceIndex(index)}
              viewport={{ amount: 0.55 }}
            >
              <div className="relative z-10">
                {/* 4 IMAGES */}
                    {service.images && service.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-6 mb-20">
                    {service.images.slice(0, 4).map((src: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.08, zIndex: 10, y: -5 }}
                        className="relative h-64 xl:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-choc/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                        <Image 
                          src={src} 
                          alt={`${service.title} - Image ${i + 1}`} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.15]" 
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                <p className="font-mono text-electric-blue text-sm uppercase tracking-[0.25em] mb-10 font-semibold">What&apos;s Included</p>
                <ul className="space-y-5">
                  {service.details?.map((detail: string) => (
                    <motion.li 
                      key={detail} 
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="text-electric-blue mr-5 mt-2 text-lg font-bold group-hover:scale-125 transition-transform duration-300">●</span>
                      <span className="text-near-black/90 font-sans text-lg xl:text-xl leading-relaxed font-light group-hover:text-dark-choc transition-colors duration-300">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MOBILE STACK */}
      <section className="lg:hidden">
        {displayServices.map((service, index) => (
          <SectionReveal key={service.title || index}>
            <div className={`py-20 md:py-28 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-earl-gray/50 to-white'}`}>
              <div className="container-custom">
                <span className="font-mono text-sm text-electric-blue/70 mb-6 block tracking-[0.3em] font-semibold">
                  0{index + 1} / 0{displayServices.length}
                </span>
                <h2 className="font-serif text-dark-choc font-bold text-3xl md:text-4xl mb-8 leading-tight tracking-tight">
                  {service.title}
                </h2>
                <p className="text-near-black/85 font-sans text-lg md:text-xl mb-12 leading-relaxed font-light">
                  {service.description}
                </p>

                {service.images && service.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:gap-6 mb-14">
                    {service.images.slice(0, 4).map((src: string, i: number) => (
                      <MagneticButton key={i}>
                        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <Image 
                            src={src} 
                            alt={`${service.title} - Image ${i + 1}`} 
                            fill 
                            className="object-cover transition-transform duration-500 hover:scale-110" 
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      </MagneticButton>
                    ))}
                  </div>
                )}

                <p className="font-mono text-electric-blue text-sm uppercase tracking-[0.25em] mb-8 font-semibold">What&apos;s Included</p>
                <ul className="space-y-5">
                  {service.details?.map((detail: string) => (
                    <li key={detail} className="flex items-start group">
                      <span className="text-electric-blue mr-4 mt-2 text-lg font-bold">●</span>
                      <span className="text-near-black/90 font-sans text-lg leading-relaxed font-light">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionReveal>
        ))}
      </section>
    </div>
  )
}
