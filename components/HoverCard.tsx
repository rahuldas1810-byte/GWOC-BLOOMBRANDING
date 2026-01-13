'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type CardVariant = 'white' | 'earl-gray' | 'near-black' | 'electric-blue' | 'butter-yellow' | 'dark-choc'
type IconVariant = 'blue' | 'chocolate' | 'yellow' | 'white'

interface HoverCardProps {
    title: string
    description: string
    Icon: LucideIcon
    variant?: CardVariant
    iconVariant?: IconVariant
}

export default function HoverCard({
    title,
    description,
    Icon,
    variant = 'white',
    iconVariant = 'blue'
}: HoverCardProps) {
    const [isClicked, setIsClicked] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Smooth springs for magnetic tilt
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 }
    const mouseXSpring = useSpring(x, springConfig)
    const mouseYSpring = useSpring(y, springConfig)
    const depthSpring = useSpring(0, springConfig)

    // Map mouse position to rotation
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    // Colors
    const colors = {
        white: {
            bg: "bg-white",
            text: "text-dark-choc",
            desc: "text-near-black/70",
            border: "border-dark-choc/5",
            shadow: "rgba(98, 74, 65, 0.08)",
            lightSpot: false
        },
        'earl-gray': {
            bg: "bg-earl-gray",
            text: "text-dark-choc",
            desc: "text-dark-choc/70",
            border: "border-dark-choc/10",
            shadow: "rgba(98, 74, 65, 0.12)",
            lightSpot: false
        },
        'near-black': {
            bg: "bg-near-black",
            text: "text-white",
            desc: "text-white/70",
            border: "border-white/5",
            shadow: "rgba(0, 0, 0, 0.5)",
            lightSpot: true
        },
        'electric-blue': {
            bg: "bg-electric-blue",
            text: "text-white",
            desc: "text-white/80",
            border: "border-white/10",
            shadow: "rgba(44, 68, 148, 0.4)",
            lightSpot: true
        },
        'butter-yellow': {
            bg: "bg-butter-yellow",
            text: "text-dark-choc",
            desc: "text-dark-choc/80",
            border: "border-dark-choc/10",
            shadow: "rgba(189, 175, 98, 0.3)",
            lightSpot: false
        },
        'dark-choc': {
            bg: "bg-dark-choc",
            text: "text-earl-gray",
            desc: "text-earl-gray/80",
            border: "border-white/5",
            shadow: "rgba(98, 74, 65, 0.5)",
            lightSpot: true
        },
        blue: {
            box: "bg-electric-blue",
            icon: "text-white",
            beam: "bg-electric-blue"
        },
        chocolate: {
            box: "bg-dark-choc",
            icon: "text-white",
            beam: "bg-dark-choc"
        },
        yellow: {
            box: "bg-butter-yellow",
            icon: "text-dark-choc",
            beam: "bg-butter-yellow"
        },
        white: {
            box: "bg-white",
            icon: "text-dark-choc",
            beam: "bg-white"
        }
    }

    const currentVariant = isClicked ? 'dark-choc' : variant
    const cv = colors[currentVariant as CardVariant]
    const iv = colors[isClicked ? 'yellow' : iconVariant as IconVariant]

    // Dynamic shadow
    const shadowValue = useTransform(depthSpring, [0, 1], [
        `0 10px 30px ${cv.shadow}`,
        `0 40px 80px ${cv.shadow}`
    ])

    // Parallax offsets
    const iconZ = useTransform(depthSpring, [0, 1], [0, 40])
    const contentZ = useTransform(depthSpring, [0, 1], [0, 15])

    // Spotlight position
    const spotlightX = useTransform(x, [-0.5, 0.5], ["0%", "100%"])
    const spotlightY = useTransform(y, [-0.5, 0.5], ["0%", "100%"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
        depthSpring.set(1)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        depthSpring.set(0)
    }

    return (
        <div className="perspective-[1000px] w-full h-full" style={{ perspective: '1000px' }}>
            <motion.div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsClicked(!isClicked)}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    boxShadow: shadowValue,
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative ${cv.bg} rounded-[24px] p-6 md:p-10 min-h-[320px] lg:min-h-[380px] w-full h-full cursor-pointer flex flex-col justify-between overflow-hidden border ${cv.border} transition-colors duration-500 hover:bg-dark-choc hover:text-white hover:border-white/5`}
            >
                {/* Spotlight Overlay */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 z-0"
                    style={{
                        background: useMotionTemplate`radial-gradient(
                            600px circle at ${spotlightX} ${spotlightY},
                            rgba(98, 74, 65, 0.15),
                            transparent 80%
                        )`
                    }}
                />

                <div className="relative z-10 flex flex-col gap-8 h-full" style={{ transformStyle: "preserve-3d" }}>

                    {/* 1. ICON BOX (Z +40px) */}
                    <motion.div style={{ translateZ: iconZ }} className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl ${iv.box} flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 shadow-lg ${cv.lightSpot ? 'shadow-black/40' : 'shadow-black/10'}`}>
                            <Icon className={`w-8 h-8 ${iv.icon} transition-transform duration-500 ease-out group-hover:scale-110 group-hover:text-white`} />
                        </div>
                    </motion.div>

                    {/* 2. CONTENT LAYER (Z +15px) */}
                    <motion.div style={{ translateZ: contentZ }} className="flex flex-col gap-4 flex-grow">
                        <h3 className={`font-serif text-3xl md:text-3xl lg:text-4xl ${cv.text} leading-tight group-hover:text-white`}>
                            {title}
                        </h3>
                        <p className={`font-sans ${cv.desc} text-base md:text-lg leading-relaxed max-w-[90%] group-hover:text-white/80`}>
                            {description}
                        </p>
                    </motion.div>

                    {/* 3. CTA BEAM */}
                    <div className="mt-8 flex flex-col gap-2 group/cta">
                        <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${cv.text} font-bold opacity-60 group-hover:opacity-100 group-hover:text-white transition-opacity`}>
                            Explore
                        </span>
                        <div className="h-[2px] w-12 bg-white/10 relative overflow-hidden">
                            <div className={`absolute inset-0 ${iv.beam} origin-left scale-x-0 group-hover/cta:scale-x-full transition-transform duration-500 ease-out`} />
                        </div>
                    </div>

                </div>
            </motion.div>
        </div >
    )
}
