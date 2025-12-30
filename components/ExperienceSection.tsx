'use client'

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { La_Belle_Aurore } from 'next/font/google'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getSiteSettings } from '@/lib/content'

const handwriting = La_Belle_Aurore({
    weight: '400',
    subsets: ['latin'],
})

function CountUp({ to, duration = 2 }: { to: number; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))

    useEffect(() => {
        if (inView) {
            animate(count, to, { duration, ease: "easeOut" })
        }
    }, [inView, count, to, duration])

    useEffect(() => {
        return rounded.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toString()
            }
        })
    }, [rounded])

    return <span ref={ref} />
}

export default function ExperienceSection() {
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

    const stats = settings?.experienceStats || {
        years: 4,
        clients: 75,
        projects: 100,
    }

    return (
        <section className="py-16 md:py-20 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/experience-bg.png"
                    alt="Experience Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="container-custom relative z-10">

                {/* Header */}
                <div className="text-center mb-10 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className={`${handwriting.className} text-3xl md:text-4xl text-dark-choc block mb-2`}>
                            what is our
                        </span>
                        <h2 className="font-serif text-5xl md:text-7xl text-electric-blue uppercase tracking-tight font-light">
                            Experience
                        </h2>
                    </motion.div>
                </div>

                {/* Venn Diagram Circles */}
                <div className="flex flex-col md:flex-row justify-center items-center relative min-h-[500px] md:h-[350px]">

                    {/* Left Circle */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="
              relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] 
              rounded-full border border-dark-choc/30 
              flex flex-col justify-center items-center text-center p-6
              bg-transparent z-10
              mb-[-40px] md:mb-0 md:mr-[-40px]
            "
                    >
                        <span className="font-serif text-5xl md:text-6xl text-electric-blue font-bold mb-2">
                            <CountUp to={stats.years} />+
                        </span>
                        <span className="font-sans text-sm md:text-base tracking-widest text-near-black uppercase font-medium">
                            Years of<br />Experience<br />in the Industry
                        </span>
                    </motion.div>

                    {/* Middle Circle */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="
              relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] 
              rounded-full border border-dark-choc/30 
              flex flex-col justify-center items-center text-center p-6
              bg-transparent z-20
              mb-[-40px] md:mb-0
            "
                    >
                        <span className="font-sans text-sm md:text-base tracking-widest text-near-black uppercase font-medium mb-2">
                            Worked On
                        </span>
                        <span className="font-serif text-5xl md:text-6xl text-electric-blue font-bold mb-2">
                            <CountUp to={stats.clients} />+
                        </span>
                        <span className="font-sans text-sm md:text-base tracking-widest text-near-black uppercase font-medium">
                            Clients
                        </span>
                    </motion.div>

                    {/* Right Circle */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="
              relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] 
              rounded-full border border-dark-choc/30 
              flex flex-col justify-center items-center text-center p-6
              bg-transparent z-10
              md:ml-[-40px]
            "
                    >
                        <span className="font-serif text-5xl md:text-6xl text-electric-blue font-bold mb-2">
                            <CountUp to={stats.projects} />+
                        </span>
                        <span className="font-sans text-sm md:text-base tracking-widest text-near-black uppercase font-medium">
                            Branding &<br />Production<br />Projects
                        </span>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
