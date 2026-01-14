"use client";

import { motion } from "framer-motion";
import { Client } from "@/types";

interface SkewedClientsProps {
    clients: Client[];
    label?: string;
}

const transition = {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
};

export default function SkewedClients({ clients, label = "TRUSTED BY" }: SkewedClientsProps) {
    if (!clients || clients.length === 0) return null;

    // Manual fallback for the 5 requested dummy names if clients is empty
    const displayClients = clients.length > 0 ? clients : [
        { name: "Artisian" },
        { name: "Nexus" },
        { name: "Creative" },
        { name: "Urban" },
        { name: "Wellness" }
    ];

    // Duplicate list for seamless marquee loop
    const marqueeClients = [...displayClients, ...displayClients, ...displayClients];

    return (
        <section className="bg-earl-gray py-20 sm:py-32 overflow-hidden relative border-y border-dark-choc/5">
            {/* Subtle Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #624A41 10px,
            #624A41 11px
          )`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="container mx-auto px-4 mb-4 sm:mb-8 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-dark-choc font-serif italic text-xl sm:text-2xl md:text-3xl font-black tracking-tighter uppercase"
                >
                    {label}
                </motion.h2>
            </div>

            {/* Single Moving Stripe Container */}
            <div className="relative w-full py-12 sm:py-20">
                <div
                    className="bg-[#0a0a0a] border-y border-[#BDAF62]/40 py-3 sm:py-5 transform -skew-y-[4deg] origin-center relative z-10 overflow-hidden shadow-2xl"
                    style={{ width: '120%', marginLeft: '-10%' }}
                >
                    {/* Marquee Motion Container */}
                    <motion.div
                        className="flex items-center gap-10 sm:gap-20 md:gap-24 whitespace-nowrap px-4"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {marqueeClients.map((client, i) => (
                            <motion.div
                                key={i}
                                className="relative group inline-block"
                            >
                                <motion.div
                                    className="px-4 py-2 cursor-default"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-[#BDAF62] transition-colors duration-300 block drop-shadow-[0_0_10px_rgba(189,175,98,0.3)]">
                                        {client.name}
                                    </span>
                                </motion.div>

                                {/* Subtle Hover Glow */}
                                <motion.div
                                    className="absolute inset-0 bg-[#BDAF62]/20 -z-10 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Decorative Background Glows - Adjusted for light theme */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-full max-w-xl h-64 bg-butter-yellow/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-full max-w-xl h-64 bg-butter-yellow/10 rounded-full blur-[120px] pointer-events-none" />
            </div>
        </section>
    );
}
