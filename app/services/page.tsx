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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-electric-blue/20 border-t-electric-blue rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-dark-choc/60 font-mono text-xs uppercase tracking-wider">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">{hero?.label || 'What We Do'}</p>
              <h1 className="heading-1 mb-10">{hero?.title || 'Our Services'}</h1>
              <p className="body-text max-w-2xl">
                {hero?.description || 'Strategic branding services designed for companies ready to make an impact.'}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* DESKTOP SPLIT */}
      <section className="hidden lg:flex relative items-start bg-white">
        {/* LEFT STICKY */}
        <div className="w-1/2 sticky top-0 h-screen flex flex-col justify-center px-12 xl:px-24 border-r border-dark-choc/5 bg-earl-gray z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeServiceIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg"
            >
              <span className="font-mono text-xs text-dark-choc/30 mb-6 block tracking-[0.2em]">
                0{activeServiceIndex + 1}
              </span>
              <h2 className="heading-2 mb-8">
                {displayServices[activeServiceIndex]?.title}
              </h2>
              <p className="body-text">
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
              className={`min-h-[100vh] flex flex-col justify-center px-12 xl:px-24 py-24 relative ${index % 2 === 0 ? 'bg-white' : 'bg-earl-gray'
                }`}
              onViewportEnter={() => setActiveServiceIndex(index)}
              viewport={{ amount: 0.55 }}
            >
              <div className="relative z-10">
                {/* 4 IMAGES */}
                    {service.images && service.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-16">
                    {service.images.slice(0, 4).map((src: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        className="relative h-40 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      >
                        <Image 
                          src={src} 
                          alt={`${service.title} - Image ${i + 1}`} 
                          fill 
                          className="object-cover transition-transform duration-500 hover:scale-110" 
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                <p className="label-text mb-8">What&apos;s Included</p>
                <ul className="space-y-4">
                  {service.details?.map((detail: string) => (
                    <li key={detail} className="flex items-start">
                      <span className="text-electric-blue mr-4 mt-1 text-xs">●</span>
                      <span className="body-text">{detail}</span>
                    </li>
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
            <div className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-earl-gray'}`}>
              <div className="container-custom">
                <span className="font-mono text-xs text-dark-choc/30 mb-6 block tracking-[0.2em]">
                  0{index + 1}
                </span>
                <h2 className="heading-2 mb-8">{service.title}</h2>
                <p className="body-text mb-12">{service.description}</p>

                {service.images && service.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-12">
                    {service.images.slice(0, 4).map((src: string, i: number) => (
                      <MagneticButton key={i}>
                        <div className="relative h-40 rounded-xl overflow-hidden">
                          <Image src={src} alt="" fill className="object-cover" />
                        </div>
                      </MagneticButton>
                    ))}
                  </div>
                )}

                <p className="label-text mb-6">What&apos;s Included</p>
                <ul className="space-y-4">
                  {service.details?.map((detail: string) => (
                    <li key={detail} className="flex items-start">
                      <span className="text-electric-blue mr-4 mt-1 text-xs">—</span>
                      <span className="body-text">{detail}</span>
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
