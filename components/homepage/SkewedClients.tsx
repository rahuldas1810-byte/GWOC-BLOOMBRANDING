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

    // Duplicate list for seamless marquee loop (exactly 2 for % based animation)
    const marqueeClients = [...displayClients, ...displayClients];

    return (
        <section className="bg-earl-gray py-24 sm:py-32 overflow-hidden relative border-y border-dark-choc/5">
            {/* Global Organic Grain Texture (Ultra Subtle) */}
            <div
                className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"
                style={{ backgroundSize: '100px 100px' }}
            />

            {/* Subtle Background Pattern (Existing) */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #2C4494 10px,
            #2C4494 11px
          )`,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Background Animated Typography Strips (Round 5) */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between opacity-[0.06] mix-blend-multiply py-10">
                {[
                    { text: "BRANDING • STRATEGY • TRUST • ", duration: 45 },
                    { text: "GROWTH • IDENTITY • BLOOM • ", duration: 35 },
                    { text: "STRATEGY • TRUST • BRANDING • ", duration: 50 },
                    { text: "IDENTITY • BLOOM • GROWTH • ", duration: 42 },
                    { text: "TRUST • BRANDING • STRATEGY • ", duration: 38 },
                ].map((strip, i) => (
                    <motion.div
                        key={i}
                        className="whitespace-nowrap flex w-full"
                        animate={{ x: ["-20%", "0%"] }} // Gentle rightward drift
                        transition={{
                            duration: strip.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...Array(6)].map((_, j) => (
                            <span key={j} className="font-serif font-black text-[clamp(4rem,8vw,8rem)] text-dark-choc leading-none tracking-tighter px-4">
                                {strip.text}
                            </span>
                        ))}
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 mb-16 sm:mb-24 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-dark-choc font-serif italic font-medium tracking-tight"
                    style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.9 }}
                >
                    <span className="block text-xl sm:text-2xl font-sans font-normal tracking-widest uppercase opacity-60 mb-2 not-italic">
                        Expertise
                    </span>
                    {label}
                </motion.h2>
            </div>

            {/* Single Moving Stripe Container */}
            <div className="relative w-full py-12 sm:py-24">

                <div
                    className="relative py-8 sm:py-12 transform -skew-y-[3deg] sm:-skew-y-[6deg] origin-center z-10 overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] bg-[#1E3570]"
                    style={{ width: '140%', marginLeft: '-20%' }}
                >
                    {/* Subtle Vertical Gradient for Depth (No Shine) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1E3570] to-[#152648] z-0" />

                    {/* Top/Bottom Borders for definition */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 z-10" />

                    {/* Marquee Motion Container */}
                    <motion.div
                        className="relative z-10 flex items-center gap-16 sm:gap-32 md:gap-40 whitespace-nowrap px-4"
                        animate={{ x: ["0%", "-50%"] }}
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
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                                >
                                    <span
                                        className="font-serif italic font-medium tracking-wide text-[#F2EBE3] transition-colors duration-300 block capitalize"
                                        style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)' }}
                                    >
                                        {client.name}
                                    </span>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
