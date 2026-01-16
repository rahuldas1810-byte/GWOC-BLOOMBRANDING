'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function RouteLoader({ className }: { className?: string }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isVisible, setIsVisible] = useState(false)
    const [shouldExit, setShouldExit] = useState(false)
    const prevPathRef = useRef(pathname)

    // Detect route change
    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            setShouldExit(true)
            prevPathRef.current = pathname
        }
    }, [pathname, searchParams])

    // Exit logic
    useEffect(() => {
        if (shouldExit && isVisible) {
            const timeout = setTimeout(() => {
                setIsVisible(false)
                setShouldExit(false)
            }, 800)
            return () => clearTimeout(timeout)
        }
    }, [shouldExit, isVisible])

    // Trigger on link click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const anchor = target.closest('a')

            if (anchor && anchor.href && !anchor.target && !anchor.hasAttribute('download')) {
                const url = new URL(anchor.href)
                const currentUrl = new URL(window.location.href)

                if (url.origin === currentUrl.origin &&
                    (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) &&
                    !url.hash &&
                    url.pathname !== '/'
                ) {
                    setIsVisible(true)
                    setShouldExit(false)
                }
            }
        }
        window.addEventListener('click', handleClick, true)
        return () => window.removeEventListener('click', handleClick, true)
    }, [])

    // --- CSS GENERATION (Scaled Down) ---
    const LOADER_SIZE = 80;
    const ITEM_SIZE = 16; // Bolder
    const COLOR = '#0047bb';

    const cssStyles = `
        @keyframes route-center {
            0%, 10%, 90%, 100% { transform: scale(0.7); opacity: 0.8; }
            45%, 55% { transform: scale(1); opacity: 1; }
        }
        .route-center { 
            animation: route-center 2s ease-in-out infinite; 
            will-change: transform, opacity;
        }

        ${[...Array(8)].map((_, i) => {
        const index = i + 1;
        const rotation = index * 45;
        const delay = 0 + (index * 0.15); // Faster stagger for route

        return `
                @keyframes route-anim-${index} {
                    0%, 60%, 100% { transform: rotate(${rotation}deg) translateX(${LOADER_SIZE}px) scale(1); opacity: 0.5; }
                    10%, 50% { transform: rotate(${rotation}deg) translateX(0) scale(1.5); opacity: 1; }
                }
                .route-item-${index} {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: ${ITEM_SIZE}px; height: ${ITEM_SIZE}px;
                    margin-top: -${ITEM_SIZE / 2}px; margin-left: -${ITEM_SIZE / 2}px;
                    background-color: ${COLOR};
                    border-radius: 50%;
                    animation: route-anim-${index} 2s ease-in-out infinite;
                    animation-delay: ${delay}s;
                    animation-fill-mode: backwards;
                    box-shadow: 0 0 15px ${COLOR}; /* Stronger Glow */
                    will-change: transform;
                }
            `;
    }).join('\n')}
    `;

    return (
        <AnimatePresence mode='wait'>
            {isVisible && (
                <motion.div
                    className={className || "fixed inset-0 z-[9998] flex items-center justify-center bg-[#E8E6D8]"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                    <style>{cssStyles}</style>

                    <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Center */}
                        <div className="relative w-40 h-40 z-20 route-center">
                            <Image
                                src="/bloom-symbol.png"
                                alt="Loading"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Particles */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={`route-item-${i + 1}`} />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
