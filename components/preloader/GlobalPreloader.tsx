'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useLoader } from '@/contexts/LoaderContext'
import Image from 'next/image'

const MIN_DISPLAY_TIME = 2500;

export default function GlobalPreloader() {
    const pathname = usePathname()
    const { isHeroVideoReady, setIsInitialLoadComplete, isInitialLoadComplete } = useLoader()

    useEffect(() => {
        const startTime = Date.now();

        const checkConditions = () => {
            const isHome = pathname === '/'
            const elapsedTime = Date.now() - startTime
            const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime)

            if (document.readyState === 'complete') {
                if (isHome) {
                    // Skip preloader on homepage
                    completeLoading()
                } else {
                    setTimeout(() => completeLoading(), remainingTime)
                }
            }
        }

        const completeLoading = () => {
            setIsInitialLoadComplete(true)
        }

        window.addEventListener('load', checkConditions)
        const checkInterval = setInterval(checkConditions, 200)
        checkConditions()

        const safety = setTimeout(completeLoading, 6000)

        return () => {
            window.removeEventListener('load', checkConditions)
            clearInterval(checkInterval)
            clearTimeout(safety)
        }
    }, [pathname, isHeroVideoReady, setIsInitialLoadComplete])

    // --- GENERATE CSS FOR PARTICLES ---
    // Radius of orbit
    const LOADER_SIZE = 120; // px
    const ITEM_SIZE = 24; // px (Bolder)
    const COLOR = '#0047bb'; // Bloom Blue

    const cssStyles = `
        @keyframes bloom-center {
            0%, 10%, 90%, 100% { transform: scale(0.7); opacity: 0.8; }
            45%, 55% { transform: scale(1); opacity: 1; }
        }

        .bloom-center {
            animation: bloom-center 3.2s ease-in-out infinite;
            will-change: transform, opacity;
        }

        ${[...Array(8)].map((_, i) => {
        const index = i + 1; // 1-based
        const rotation = index * 45;
        const delay = 0 + (index * 0.2);

        return `
                @keyframes bloom-anim-${index} {
                    0%, 60%, 100% {
                        transform: rotate(${rotation}deg) translateX(${LOADER_SIZE}px) scale(1);
                        opacity: 0.5;
                    }
                    10%, 50% {
                        transform: rotate(${rotation}deg) translateX(0) scale(1.5);
                        opacity: 1;
                    }
                }
                
                .bloom-item-${index} {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: ${ITEM_SIZE}px;
                    height: ${ITEM_SIZE}px;
                    margin-top: -${ITEM_SIZE / 2}px; 
                    margin-left: -${ITEM_SIZE / 2}px;
                    background-color: ${COLOR};
                    border-radius: 50%;
                    animation: bloom-anim-${index} 3.2s ease-in-out infinite;
                    animation-delay: ${delay}s;
                    animation-fill-mode: backwards;
                    box-shadow: 0 0 20px ${COLOR}; /* Stronger Glow */
                    will-change: transform;
                }
            `;
    }).join('\n')}
    `;

    return (
        <AnimatePresence mode='wait'>
            {!isInitialLoadComplete && pathname !== '/' && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#E8E6D8]"
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                >
                    <style>{cssStyles}</style>

                    <div className="relative w-64 h-64 flex items-center justify-center">

                        {/* Center Logo */}
                        <div className="relative w-56 h-56 z-20 bloom-center">
                            <Image
                                src="/bloom-symbol.png"
                                alt="Bloom Branding"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Orbiting Particles */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={`bloom-item-${i + 1}`} />
                        ))}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
