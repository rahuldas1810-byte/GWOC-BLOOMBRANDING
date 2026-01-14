"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Client } from "@/types";

interface ClientScrollListProps {
    clients: Client[];
    label?: string;
}

function ClientName({ name, side }: { name: string, side: 'left' | 'right' }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 95%", "center 50%", "end 5%"]
    });

    // Smooth out the scroll progress for a cinematic feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001
    });

    // Opacity: Fade in from 0 to 1 back to 0
    const opacity = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

    // Y: ONLY vertical translation (No X movement allowed)
    const y = useTransform(smoothProgress, [0, 0.5, 1], [40, 0, -40]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y }}
            className={`py-1.5 sm:py-2 flex ${side === 'left' ? 'justify-end' : 'justify-start'}`}
        >
            <span className={`font-mono text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight text-black uppercase leading-none ${side === 'left' ? 'text-right' : 'text-left'}`}>
                {name}
            </span>
        </motion.div>
    );
}

export default function ClientScrollList({ clients, label = "OUR CLIENTS" }: ClientScrollListProps) {
    if (!clients || clients.length === 0) return null;

    // Split clients into two columns
    const midPoint = Math.ceil(clients.length / 2);
    const leftClients = clients.slice(0, midPoint);
    const rightClients = clients.slice(midPoint);

    return (
        <section className="relative bg-white py-48 sm:py-64 md:py-80 overflow-hidden">
            <div className="container mx-auto max-w-4xl px-4 relative">

                {/* Sticky Header - No borders, no dividers */}
                <div className="sticky top-24 sm:top-32 left-0 w-full z-20 pointer-events-none mb-32 h-0 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="translate-y-[-50%]"
                    >
                        <h2 className="font-sans text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-black uppercase">
                            {label}
                        </h2>
                    </motion.div>
                </div>

                {/* Client Columns - Visually centered as a group */}
                <div className="flex justify-center gap-8 sm:gap-16 md:gap-24 mt-20 sm:mt-32">
                    {/* Left Column */}
                    <div className="flex flex-col w-1/2">
                        {leftClients.map((client, i) => (
                            <ClientName
                                key={client.id || i}
                                name={client.name}
                                side="left"
                            />
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col w-1/2">
                        {rightClients.map((client, i) => (
                            <ClientName
                                key={client.id || i}
                                name={client.name}
                                side="right"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
