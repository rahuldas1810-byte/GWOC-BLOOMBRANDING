"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CARDS = [
    {
        quote: "This branding strategy actually works! The identity we built using Bloom increased new customer sales by 6X in our most mature market.",
        author: "treatwell",
    },
    {
        quote: "We generate prospecting audiences using Bloom to drive incremental growth. Our ROI has been fantastic!",
        author: "REVOLUTION",
        sub: "BEAUTY LONDON"
    },
    {
        quote: "Bloom's strategy does its thing in the background: dynamically refreshing all of our audiences so that we convert new customers everyday, profitably.",
        author: "DEREK ROSE",
    }
];

export default function TestimonialsCTA() {
    return (
        <section className="bg-white pb-24 md:pb-32 pt-16 overflow-hidden">
            <div className="w-full pl-5 md:pl-10 pr-5 md:pr-10 lg:pr-24">
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                >

                    {/* Left Content */}
                    <div>
                        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-dark-choc mb-8">
                            Unlimited creativity.<br />
                            Unlimited success.
                        </h2>
                        <p className="body-text text-lg text-dark-choc/70 mb-10 max-w-md">
                            Generating, prioritising & experimenting with designs is the only way to find winners. If your brand has saturated, or performance has flatlined. You need a slice of Bloom.
                        </p>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 font-medium text-dark-choc hover:gap-5 transition-all duration-300 group"
                        >
                            <span className="border-b border-dark-choc pb-0.5 group-hover:border-electric-blue group-hover:text-electric-blue transition-colors">
                                Start a Project
                            </span>
                            <div className="w-8 h-8 rounded-full bg-dark-choc text-white flex items-center justify-center group-hover:bg-electric-blue transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>

                    {/* Right Cards Stack */}
                    <div className="relative flex flex-col gap-8 md:gap-10">
                        {CARDS.map((card, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
                                className={`
                  relative bg-white border-2 border-dark-choc p-8 md:p-10 
                  shadow-[8px_8px_0px_0px_#1E4DFF] 
                  hover:shadow-[4px_4px_0px_0px_#1E4DFF] 
                  transition-all duration-300 w-full max-w-md
                  ${index === 1 ? "lg:ml-24" : "lg:mr-auto"}
                `}
                            >
                                <p className="font-serif text-lg md:text-xl text-dark-choc mb-6 leading-relaxed">
                                    "{card.quote}"
                                </p>
                                <div>
                                    <h4 className="font-bold text-xl md:text-2xl font-serif text-dark-choc tracking-tight">
                                        {card.author}
                                    </h4>
                                    {card.sub && (
                                        <p className="text-[10px] uppercase tracking-widest text-dark-choc/60 mt-1">
                                            {card.sub}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
