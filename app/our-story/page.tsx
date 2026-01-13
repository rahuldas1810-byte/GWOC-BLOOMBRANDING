'use client'

import SectionReveal from '@/components/SectionReveal'
import Image from 'next/image'
import HorizontalMarquee from '@/components/HorizontalMarquee'
import HoverCard from '@/components/HoverCard'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { getOurStory, getSiteSettings } from '@/lib/content'
import FoundersMap from '@/components/FoundersMap'
import { Target, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react'



export default function OurStory() {
  const [ourStoryData, setOurStoryData] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<any>(null)

  // Parallax Logic for Hero
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Purpose Parallax
  const purposeRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: purposeProgress } = useScroll({
    target: purposeRef,
    offset: ["start end", "end start"]
  })
  const purposeY = useTransform(purposeProgress, [0, 1], ["-20%", "10%"])

  // Philosophy State
  const [activeCard, setActiveCard] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, settings] = await Promise.all([
          getOurStory(),
          getSiteSettings(),
        ])
        if (data) {
          // Ensure purposeStats is properly structured with numbers
          // Use explicit checks to handle 0 values correctly (don't use || which treats 0 as falsy)
          setOurStoryData({
            ...data,
            purposeStats: data.purposeStats ? {
              brandsBuilt: data.purposeStats.brandsBuilt !== undefined && data.purposeStats.brandsBuilt !== null
                ? Number(data.purposeStats.brandsBuilt)
                : 30,
              satisfaction: data.purposeStats.satisfaction !== undefined && data.purposeStats.satisfaction !== null
                ? Number(data.purposeStats.satisfaction)
                : 100,
            } : { brandsBuilt: 30, satisfaction: 100 },
          })
        }
        if (settings) {
          setSiteSettings(settings)
        }
      } catch (error) {
        console.error('Error fetching Our Story data:', error)
      }
    }
    fetchData()

    // Refresh every 3 seconds to catch admin updates quickly
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  // Merge API data with fallback, ensuring proper structure
  const data = {
    heroLabel: ourStoryData?.heroLabel || 'Established 2024',
    heroTitle: ourStoryData?.heroTitle || 'OUR STORY',
    heroSubtitle: ourStoryData?.heroSubtitle || 'Building brands that leave a legacy through clarity, confidence, and craft.',
    heroBackgroundImage: ourStoryData?.heroBackgroundImage || { url: '/who-we-are.jpg' },
    purposeTitle: ourStoryData?.purposeTitle || 'A studio built on clarity.',
    purposeDescription: ourStoryData?.purposeDescription || 'Bloom Branding is a strategic branding agency for those ready to make a noise.',
    purposeStats: {
      brandsBuilt: ourStoryData?.purposeStats?.brandsBuilt !== undefined
        ? Number(ourStoryData.purposeStats.brandsBuilt)
        : 30,
      satisfaction: ourStoryData?.purposeStats?.satisfaction !== undefined
        ? Number(ourStoryData.purposeStats.satisfaction)
        : 100,
    },
    philosophyTitle: ourStoryData?.philosophyTitle || 'Our Philosophy',
    philosophyDescription: ourStoryData?.philosophyDescription || 'What we believe.',
    philosophyCards: ourStoryData?.philosophyCards || [
      { id: '01', title: 'Clarity Over Complexity', description: 'The best brands are simple, clear, and easy to understand. We strip away the noise.' },
      { id: '02', title: 'Strategy First', description: 'Every design decision we make is backed by strategic thinking. We create brands that work.' },
      { id: '03', title: 'Confidence, Not Flash', description: 'Premium doesn\'t mean flashy. We build brands that represent quiet confidence.' },
    ],
  }

  // Ensure philosophyCards have proper structure
  const philosophyCards = (data.philosophyCards && data.philosophyCards.length > 0
    ? data.philosophyCards.map((card: any) => ({
      id: card.id || card._id || '01',
      title: card.title || '',
      description: card.description || card.text || '',
    }))
    : [
      { id: '01', title: 'Clarity Over Complexity', description: 'The best brands are simple, clear, and easy to understand. We strip away the noise.' },
      { id: '02', title: 'Strategy First', description: 'Every design decision we make is backed by strategic thinking. We create brands that work.' },
      { id: '03', title: 'Confidence, Not Flash', description: 'Premium doesn\'t mean flashy. We build brands that represent quiet confidence.' },
    ])

  return (
    <div className="min-h-screen">

      {/* ================= CINEMATIC HERO ================= */}
      <section ref={containerRef} className="relative h-[55vh] min-h-[380px] sm:h-[60vh] sm:min-h-[450px] md:h-[90vh] md:min-h-[700px] overflow-hidden flex items-center justify-center bg-dark-choc">

        {/* Parallax Background Image */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={data.heroBackgroundImage?.url || "/who-we-are.jpg"}
            alt="Bloom Branding studio"
            fill
            className="object-cover opacity-50"
            priority
            unoptimized={data.heroBackgroundImage?.url?.startsWith('http') || false}
            sizes="100vw"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-choc via-dark-choc/30 to-transparent" />
        </motion.div>

        {/* Content Layer */}
        <div className="container-custom relative z-10 w-full pt-20">
          <motion.div
            style={{ opacity }}
            className="flex flex-col items-center text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="label-text mb-8 tracking-[0.4em] text-earl-gray/80"
            >
              {data.heroLabel}
            </motion.p>

            {/* Massive Editorial Title */}
            <h1 className="font-serif text-earl-gray leading-[0.85]">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[12vw] md:text-[15vw] lg:text-[14rem]"
                >
                  {data.heroTitle.split(' ')[0]}
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[12vw] md:text-[15vw] lg:text-[14rem] italic pl-[5vw] md:pl-[10vw] lg:pl-32"
                >
                  {data.heroTitle.split(' ').slice(1).join(' ')}
                </motion.span>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="body-text text-base sm:text-lg md:text-xl lg:text-2xl max-w-lg mt-6 sm:mt-8 md:mt-12 text-earl-gray/80 px-5 sm:px-4 md:px-0"
            >
              {data.heroSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are - REFINED */}
      <section className="section-padding bg-white relative z-20 rounded-t-[2rem] sm:rounded-t-[3rem] -mt-12 sm:-mt-20">
        <div className="container-custom">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-16 lg:gap-28 items-start pt-4 sm:pt-6 md:pt-10">

            {/* Sticky Left Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
              <SectionReveal>
                <p className="label-text mb-8 text-dark-choc/60">{siteSettings?.ourStoryAdditional?.whoWeAreLabel || 'Who We Are'}</p>
              </SectionReveal>

              <div className="overflow-hidden mb-8">
                <motion.h2
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="heading-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-dark-choc"
                >
                  {data.purposeTitle}
                </motion.h2>
              </div>

              {/* Animated Scale Line */}
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="h-[2px] w-24 bg-dark-choc/20"
              />
            </div>

            {/* Scrollable Right Content */}
            <div className="lg:col-span-6 lg:col-start-7 space-y-12 lg:pt-32">
              <SectionReveal delay={0.2}>
                <p className="body-text text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed text-dark-choc pl-4 sm:pl-6 md:pl-12">
                  {data.purposeDescription}
                </p>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <p className="body-text text-lg md:text-xl leading-relaxed text-dark-choc/70">
                  {siteSettings?.ourStoryAdditional?.additionalParagraph || 'We work with startups, D2C brands, and creators who are ready to make a real impact. Our team combines strategic thinking with clean, confident design. We don\'t chase trends. We build brands that stand the test of time.'}
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-dark-choc/10">
                  <div>
                    <span className="block text-4xl font-serif text-electric-blue mb-2">{data.purposeStats.brandsBuilt}+</span>
                    <span className="text-sm font-mono uppercase tracking-wider text-dark-choc/60">Brands Built</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-serif text-electric-blue mb-2">{data.purposeStats.satisfaction}%</span>
                    <span className="text-sm font-mono uppercase tracking-wider text-dark-choc/60">Satisfaction</span>
                  </div>
                </div>
              </SectionReveal>
            </div>

          </div>
        </div>
      </section>



      {/* ================= FOUNDERS MAP ================= */}
      <FoundersMap />

      {/* Philosophy - INTERACTIVE CARDS */}
      <section className="section-padding bg-earl-gray relative z-20">
        <div className="container-custom">

          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <p className="label-text mb-5 text-dark-choc/60">{data.philosophyTitle}</p>
            <h2 className="heading-2 text-dark-choc">{data.philosophyDescription}</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {philosophyCards.map((item: any, i: number) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                animate={{
                  flex: activeCard === item.id ? 2 : 1,
                  transition: { duration: 0.4, ease: "easeInOut" }
                }}
                viewport={{ once: true, margin: "-10%" }}
                onClick={() => setActiveCard(activeCard === item.id ? null : item.id)}
                className={`group px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:p-12 border-t border-dark-choc/10 hover:border-transparent min-h-[280px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[450px] w-full md:w-auto flex flex-col justify-between 
                           cursor-pointer transition-colors duration-500 overflow-hidden relative
                           ${activeCard === item.id
                    ? 'bg-electric-blue text-white border-transparent'
                    : 'bg-white hover:bg-electric-blue hover:text-white'}`}
              >
                <motion.div layout="position">
                  <span className={`block text-4xl sm:text-5xl md:text-6xl font-serif mb-4 sm:mb-6 md:mb-8 transition-colors duration-500
                                    ${activeCard === item.id
                      ? 'text-white/30'
                      : 'text-dark-choc/20 group-hover:text-white/30'}`}>
                    {item.id}
                  </span>
                </motion.div>

                <motion.div layout="position">
                  <motion.h3
                    layout="position"
                    className={`heading-3 mb-6 transition-colors duration-500
                                  ${activeCard === item.id
                        ? 'text-white'
                        : 'text-dark-choc group-hover:text-white'}`}>
                    {item.title}
                  </motion.h3>
                  <motion.p
                    layout="position"
                    className={`body-text transition-opacity duration-500
                                  ${activeCard === item.id
                        ? 'opacity-90 text-white'
                        : 'opacity-80 group-hover:opacity-90 group-hover:text-white'}`}>
                    {item.description || item.text}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <SectionReveal>
        <section className="py-16 sm:py-24 md:py-32 bg-dark-choc overflow-hidden border-t border-dark-choc/5">
          <div className="container-custom mb-16 text-center">
            <p className="label-text mb-6 text-earl-gray/60">Culture</p>
            <h2 className="heading-2 text-earl-gray">Life at Bloom</h2>
          </div>
          <HorizontalMarquee
            gradientClass="from-dark-choc"
            images={[
              '/2.jpg', '/4.jpg', '/5.jpg',
              '/6.jpg', '/7.jpg', '/8.jpg', '/9.jpg'
            ]}
          />
        </section>
      </SectionReveal>

      {/* Why We Exist - EDITORIAL OVERLAP */}
      <section ref={purposeRef} className="section-padding bg-white relative overflow-hidden py-12 sm:py-16 md:py-32 lg:py-48">
        <div className="container-custom relative z-10">

          <div className="relative">
            {/* Parallax Image - Large & Cinematic */}
            <div className="lg:w-[75%] relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-2xl group">
              <motion.div style={{ y: purposeY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                <Image
                  src="/27.jpg"
                  alt="Bloom Branding purpose"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
                <div className="absolute inset-0 bg-dark-choc/10 mix-blend-multiply" />
              </motion.div>

              {/* Image Curtain Reveal */}
              <motion.div
                initial={{ height: "100%" }}
                whileInView={{ height: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 bg-electric-blue z-20 top-auto bottom-0"
              />
            </div>

            {/* Overlapping Content Card - FAANG TILT */}
            <TiltCard
              className="bg-white/95 backdrop-blur-md p-5 sm:p-6 md:p-10 lg:p-16 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-dark-choc/5
                            relative mt-[-8%] sm:mt-[-10%] mx-auto w-[92%] sm:w-[90%]
                            lg:absolute lg:right-0 lg:bottom-[10%] lg:w-[45%] lg:mt-0 lg:ml-0 overflow-hidden group/card"
            >
              {/* Rotating Badge */}
              <div className="absolute -top-12 -right-12 w-48 h-48 opacity-10 md:opacity-100 hidden md:block pointer-events-none z-20">
                <div className="w-full h-full animate-[spin_10s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <defs>
                      <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text fontSize="11" fill="currentColor" className="text-dark-choc font-mono uppercase tracking-[0.2em]">
                      <textPath href="#circlePath" startOffset="0%">
                        Strategy • Clarity • Design •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              <span className="block w-12 h-1 bg-electric-blue mb-8 relative z-10" />

              <div className="relative z-10 transform-gpu preserve-3d">
                <p className="label-text mb-6 text-dark-choc/60">Our Purpose</p>
                <h2 className="heading-2 mb-8">Why We Exist</h2>

                <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-dark-choc mb-6 md:mb-8 leading-tight">
                  No jargon. No fluff. <span className="text-dark-choc/40 italic">Just clarity.</span>
                </p>

                {/* Scroll Highlight Text */}
                <ScrollHighlightText
                  text="The branding industry is full of agencies that overcomplicate things to justify fees. We exist to destroy that noise. We help companies build brand identities that are strategic, clear, and built to last."
                />
              </div>
            </TiltCard>
          </div>

        </div>
      </section>

      {/* What Tells Us Apart - HIGH END 3D UPGRADE */}
      <section className="section-padding bg-earl-gray relative overflow-hidden">

        {/* Infinite Grid Background Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(98, 74, 65, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(98, 74, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0px 0px', '60px 60px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: 'inherit',
              backgroundSize: 'inherit'
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="mb-20">
            <p className="label-text mb-5 text-dark-choc/60 font-mono tracking-[0.3em]">Our Philosophy</p>
            <h2 className="font-serif text-5xl md:text-7xl text-dark-choc leading-none">
              What Tells Us Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <HoverCard
              variant="earl-gray"
              iconVariant="chocolate"
              Icon={Target}
              title="Focused Approach"
              description="We don't try to be everything to everyone. We specialize in strategic brand identity that scales."
            />
            <HoverCard
              variant="earl-gray"
              iconVariant="chocolate"
              Icon={ShieldCheck}
              title="No Jargon"
              description="Strategic clarity delivered through honest, clear communication. No buzzwords, just results."
            />
            <HoverCard
              variant="earl-gray"
              iconVariant="chocolate"
              Icon={TrendingUp}
              title="Results-Driven"
              description="Every creative decision we make is backed by data and designed to achieve your business goals."
            />
            <HoverCard
              variant="earl-gray"
              iconVariant="chocolate"
              Icon={Sparkles}
              title="Long-Term Thinking"
              description="We build brands that are timeless. We create legacies that grow along with your vision."
            />
          </div>
        </div>
      </section>

    </div >
  )
}

function ScrollHighlightText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.6"]
  })

  const words = text.split(" ")

  return (
    <p ref={containerRef} className="body-text text-lg leading-relaxed flex flex-wrap gap-x-1.5">
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + (1 / words.length)
        // eslint-disable-next-line
        const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1])

        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className="text-dark-choc"
          >
            {word}
          </motion.span>
        )
      })}
    </p>
  )
}

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Physics for Smooth Tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"])

  // Spotlight gradient position
  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set((clientX - left) / width - 0.5)
    y.set((clientY - top) / height - 0.5)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className={className}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover/card:opacity-100 transition duration-500 z-30"
        style={{
          background: useMotionTemplate`radial-gradient(
               650px circle at ${spotlightX} ${spotlightY},
               rgba(255,255,255,0.4),
               transparent 80%
             )`
        }}
      />
      {children}
    </motion.div>
  )
}
function PhilosophyCard({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spotlight position
  const spotlightX = useTransform(x, [-0.5, 0.5], ["0%", "100%"])
  const spotlightY = useTransform(y, [-0.5, 0.5], ["0%", "100%"])

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set((clientX - left) / width - 0.5)
    y.set((clientY - top) / height - 0.5)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      animate={{
        flex: isActive ? 1.5 : 1,
        transition: { duration: 0.4, ease: "easeInOut" }
      }}
      viewport={{ once: true, margin: "-10%" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`group px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:p-12 border-t border-dark-choc/10 hover:border-transparent min-h-[280px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[450px] w-full md:w-auto flex flex-col justify-between 
                 cursor-pointer transition-colors duration-500 overflow-hidden relative
                 ${isActive
          ? 'bg-dark-choc text-white border-transparent'
          : 'bg-white hover:bg-dark-choc hover:text-white'}`}
    >
      {/* Blue Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 z-0"
        style={{
          background: useMotionTemplate`radial-gradient(
             600px circle at ${spotlightX} ${spotlightY},
             rgba(44, 68, 148, 0.2),
             transparent 80%
           )`
        }}
      />

      <motion.div layout="position" className="relative z-10">
        <span className={`block text-4xl sm:text-5xl md:text-6xl font-serif mb-4 sm:mb-6 md:mb-8 transition-colors duration-500
                          ${isActive
            ? 'text-white/30'
            : 'text-dark-choc/20 group-hover:text-white/30'}`}>
          {item.id}
        </span>
      </motion.div>

      <motion.div layout="position" className="relative z-10">
        <motion.h3
          layout="position"
          className={`heading-3 mb-6 transition-colors duration-500
                        ${isActive
              ? 'text-white'
              : 'text-dark-choc group-hover:text-white'}`}>
          {item.title}
        </motion.h3>
        <motion.p
          layout="position"
          className={`body-text transition-opacity duration-500
                        ${isActive
              ? 'opacity-90 text-white'
              : 'opacity-80 group-hover:opacity-90 group-hover:text-white'}`}>
          {item.description || item.text}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
