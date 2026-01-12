"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

// Dummy Data
const FOUNDERS = [
    {
        id: 1,
        name: "Meghna",
        role: "Co-Founder",
        email: "meghna@bloombranding.com",
        bio: "Strategic vision and brand leadership.",
        fullBio: "Meghna drives the strategic direction of Bloom, ensuring every brand we build has a strong foundation and a clear path to growth.",
        top: "20%",
        left: "20%",
        connection: "bottom-right",
        image: "/team/meghna.png",
    },
    {
        id: 2,
        name: "Anushi",
        role: "Co-Founder",
        email: "anushi@bloombranding.com",
        bio: "Creative direction and visual storytelling.",
        fullBio: "Anushi leads the creative team, transforming abstract concepts into compelling visual identities that resonate with audiences.",
        top: "70%",
        left: "80%",
        connection: "top-left",
        image: "/team/anushi.png",
    },
    {
        id: 3,
        name: "Kavya",
        role: "Production Manager",
        email: "kavya@bloombranding.com",
        bio: "Operational excellence and execution.",
        fullBio: "Kavya ensures smooth sailing for all projects, managing timelines, resources, and ensuring every deliverable meets our high standards.",
        top: "25%",
        left: "80%",
        connection: "bottom-left",
        image: "/team/kavya.png",
    },
    {
        id: 4,
        name: "Sanya",
        role: "Creative Strategist",
        email: "sanya@bloombranding.com",
        bio: "Bridging strategy and design.",
        fullBio: "Sanya works at the intersection of strategy and design, ensuring our creative solutions are not just beautiful, but effective.",
        top: "75%",
        left: "20%",
        connection: "top-right",
        image: "/team/team_member_4.png",
    },
    {
        id: 5,
        name: "Diya",
        role: "Senior Brand Manager",
        email: "diya@bloombranding.com",
        bio: "Managing brand excellence.",
        fullBio: "Diya oversees brand strategy and ensures consistent messaging across all campaigns and touchpoints.",
        top: "15%",
        left: "50%",
        connection: "bottom",
        image: "/team/diya.jpg",
    },
    {
        id: 6,
        name: "Dhanvi",
        role: "Content Writer",
        email: "dhanvi@bloombranding.com",
        bio: "Crafting compelling narratives.",
        fullBio: "Dhanvi weaves words into stories that captivate audiences and give a voice to our clients' brands.",
        top: "85%",
        left: "50%",
        connection: "top",
        image: "/team/dhanvi.png",
    },
];

// Helper to generate orthogonal paths from center (50, 50) to target (x, y)
// coordinates are percentages (0-100)
const generatePath = (targetX: number, targetY: number) => {
    const startX = 50;
    const startY = 50;

    // Simple L-shape logic: Go vertical then horizontal, or vice versa depending on position
    // We want to avoid crossing the center too weirdly. 
    // Let's go Horizontal first half way, then Vertical, then Horizontal? 
    // Actually, Deed lines look like they exit the center block then turn.

    // Let's try: Center -> MidY -> TargetX -> TargetY
    const midX = (startX + targetX) / 2;
    const midY = (startY + targetY) / 2;

    // Path command: M startX startY L startX midY L targetX midY L targetX targetY
    // This creates a stepped path.
    // Using percentages in path d attribute is tricky without scaling, so we'll use a viewBox of 0 0 100 100
    return `M ${startX} ${startY} L ${startX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
};

export default function FoundersMap() {
    const [activePin, setActivePin] = useState<number | null>(null);
    const activeFounder = FOUNDERS.find(f => f.id === activePin);

    return (
        <section className="relative w-full flex flex-col md:block md:h-[900px] bg-[#1a1a1a] group/map">
            {/* Map Canvas - Preserves desktop layout */}
            <div className="relative w-full h-[600px] md:h-full flex-shrink-0 overflow-hidden flex items-center justify-center">

            {/* ================= BACKGROUND: CITY IMAGE ================= */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/map-background.png"
                    alt="City Grid Background"
                    fill
                    className="object-cover opacity-20"
                    quality={100}
                />
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1a1a1a]/40 to-[#1a1a1a] pointer-events-none" />

            {/* ================= SVG CONNECTIONS ================= */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {FOUNDERS.map((founder) => (
                    <motion.path
                        key={founder.id}
                        d={generatePath(parseFloat(founder.left), parseFloat(founder.top))}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="0.8"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    />
                ))}
                {/* Pulse effect on lines when active */}
                {FOUNDERS.map((founder) => (
                    <motion.path
                        key={`active-${founder.id}`}
                        d={generatePath(parseFloat(founder.left), parseFloat(founder.top))}
                        fill="none"
                        stroke={activePin === founder.id ? "#1E4DFF" : "transparent"}
                        strokeWidth="1.2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: activePin === founder.id ? 1 : 0,
                            opacity: activePin === founder.id ? 1 : 0
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                ))}
            </svg>


            {/* ================= CENTRAL NODE: BLOOM TEAM ================= */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                    {/* Glow */}
                    <div className="absolute inset-0 bg-electric-blue/20 blur-[60px] rounded-full scale-150" />

                    {/* Tag/Label */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="relative bg-[#1a1a1a] border border-electric-blue/30 px-6 py-3 rounded-lg shadow-2xl flex flex-col items-center"
                    >
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image
                                src="/favicon-blue.png"
                                alt="Bloom Branding"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Connecting Node Point */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-electric-blue rounded-full mt-2 ring-4 ring-[#1a1a1a]" />
                </div>
            </div>


            {/* ================= PINS LAYER ================= */}
            <div className="absolute inset-0 w-full h-full z-30">
                {FOUNDERS.map((founder) => {
                    const isActive = activePin === founder.id;

                    return (
                        <div
                            key={founder.id}
                            className="absolute"
                            style={{ top: founder.top, left: founder.left }}
                        >
                            {/* Position wrapper to center content on coordinates */}
                            <div className="relative -translate-x-1/2 -translate-y-1/2">

                                {/* THE PIN */}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setActivePin(isActive ? null : founder.id)}
                                    onMouseEnter={() => setActivePin(founder.id)}
                                    onMouseLeave={() => setActivePin(null)}
                                    className="cursor-pointer relative z-20 group"
                                >
                                    {/* Pin Shape */}
                                    <div className={`w-16 h-16 md:w-28 md:h-28 rounded-full border-[3px] p-1 transition-all duration-500 bg-[#1a1a1a] relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]
                                ${isActive ? 'border-electric-blue scale-110' : 'border-white/10 group-hover:border-white/30'}`}>

                                        <div className="w-full h-full rounded-full overflow-hidden relative transition-all duration-500">
                                            <Image
                                                src={founder.image}
                                                alt={founder.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Pin Point */}
                                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1a1a] border-r border-b rotate-45 transition-colors duration-500
                                     ${isActive ? 'border-electric-blue' : 'border-white/10 group-hover:border-white/30'}`}
                                        />
                                    </div>
                                </motion.div>


                                {/* INFO CARD (Pop-up) */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: parseFloat(founder.top) < 50 ? -15 : 15, scale: 0.95, x: "-50%" }}
                                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                                            exit={{ opacity: 0, y: parseFloat(founder.top) < 50 ? -10 : 10, scale: 0.95, x: "-50%" }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className={`hidden md:block absolute left-1/2 w-[280px] md:w-[320px] pointer-events-none z-50  
                                                        ${parseFloat(founder.top) < 50
                                                    ? 'top-[calc(100%+20px)] origin-top'
                                                    : 'bottom-[calc(100%+20px)] origin-bottom'
                                                }`}
                                        >
                                            <div className="bg-white rounded-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left relative overflow-hidden">
                                                {/* Decorative accent */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-electric-blue" />

                                                <div className="relative z-10">
                                                    <span className="inline-block px-2 py-1 rounded bg-electric-blue/10 text-electric-blue text-[10px] font-bold uppercase tracking-wider mb-3">
                                                        {founder.role}
                                                    </span>

                                                    <h3 className="text-xl font-serif text-dark-choc mb-2">{founder.name}</h3>

                                                    <p className="text-sm text-dark-choc/70 mb-4 leading-relaxed">
                                                        {founder.fullBio}
                                                    </p>

                                                    <div className="flex items-center gap-2 pt-4 border-t border-dark-choc/5">
                                                        <Mail className="w-3 h-3 text-electric-blue" />
                                                        <span className="text-xs font-mono text-dark-choc/50">{founder.email}</span>
                                                    </div>
                                                </div>

                                                {/* Little Arrow */}
                                                <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 transform
                                                            ${parseFloat(founder.top) < 50
                                                        ? '-top-2 border-l border-t border-black/5'
                                                        : '-bottom-2 border-r border-b border-black/5'
                                                    }`}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Overlay/Hint */}
            <div className="absolute bottom-5 left-0 w-full text-center md:hidden pointer-events-none z-40">
                <span className="text-[10px] uppercase tracking-widest text-white/40 bg-black/20 px-3 py-2 rounded-full backdrop-blur-md border border-white/5">
                    Tap faces to explore
                </span>
            </div>

            </div>{/* End Map Canvas */}

            {/* Mobile Info Panel - Safe Content Stage */}
            <AnimatePresence mode="wait">
                {activeFounder && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full bg-white md:hidden relative z-50 overflow-hidden"
                    >
                        <div className="p-8 border-t border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="inline-block px-2 py-1 rounded bg-electric-blue/10 text-electric-blue text-[10px] font-bold uppercase tracking-wider">
                                    {activeFounder.role}
                                </span>
                                <div className="h-px flex-1 bg-dark-choc/10" />
                            </div>

                            <h3 className="text-2xl font-serif text-dark-choc mb-3">{activeFounder.name}</h3>
                            <p className="text-base text-dark-choc/70 mb-5 leading-relaxed">
                                {activeFounder.fullBio}
                            </p>

                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-electric-blue" />
                                <span className="text-xs font-mono text-dark-choc/50">{activeFounder.email}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section >
    );
}
