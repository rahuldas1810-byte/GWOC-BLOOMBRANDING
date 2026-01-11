"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Linkedin, Facebook, Instagram } from "lucide-react";
import { Playfair_Display, Inter, Bodoni_Moda } from "next/font/google";

// 1. Setup Fonts
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap"
});

// Updated Menu Data
const menuItems = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Services", href: "/services" },
  { label: "Clients", href: "/clients" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

const contactInfo = [
  { title: "Bloom Industries", lines: ["Solarium Business Centre, 515,", "beside Times Corner, Surat, Gujarat 395007"] },
  { title: "Factory Hours", lines: ["Monday to Friday", "08:00h – 17:30h*"] },
  { title: "Customer Service", lines: ["Service by appointment*"] },
  { title: "Contact", lines: ["comercial@bloombranding.com", "(+351) 933 209 045"] },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Determine current page label
  const getCurrentPageLabel = () => {
    if (pathname === "/") return "HOME";
    const label = pathname.replace("/", "").replace(/[-_]/g, " ").toUpperCase();
    return label || "HOME";
  };

  // --- Change Set 3: Pills Color Behavior ---
  const pillBaseClasses = "bg-[#F3F0E7] text-[#3E2B26] border-[#3E2B26]";
  const pillActiveClasses = "bg-[#3E2B26] text-[#F3F0E7] border-[#3E2B26]";

  const showpieceClass = pillBaseClasses;
  const controlPillClass = isOpen ? pillActiveClasses : pillBaseClasses;

  return (
    <div className={`${playfair.variable} ${inter.variable} ${bodoni.variable} font-sans`}>
      {/* 
         --- Top Navigation Bar (Always Visible) --- 
      */}
      <nav className="fixed top-0 left-0 w-full z-[60] px-6 md:px-12 py-8 flex justify-between items-center bg-transparent mix-blend-mode-difference text-[#3E2B26] pointer-events-none">

        {/* Logo */}
        <Link href="/" className="pointer-events-auto">
          <Image
            src="/bloom-logo.png"
            alt="Bloom Branding"
            width={400}
            height={100}
            className="h-16 md:h-24 w-auto object-contain"
            priority
          />
        </Link>

        {/* Header Controls - Squiggle & Wave Pills */}
        <div className="flex items-center gap-3 pointer-events-auto mix-blend-normal">

          {/* Pill 1: Decorative Squiggle (Outlined) - Vein Pulse Animation */}
          <div className="hidden md:flex items-center justify-center w-[72px] h-[44px] rounded-full border border-[#3E2B26] text-[#3E2B26] bg-transparent transition-all duration-300">
            <svg
              width="28"
              height="16"
              viewBox="0 0 28 16"
              fill="none"
            >
              {/* Base wave - static vein */}
              <path
                d="M2 8C4 8 5 4 8 4C11 4 12 12 15 12C18 12 19 4 22 4C24 4 25 8 26 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />
              {/* Pulse traveling through the vein */}
              <motion.path
                d="M2 8C4 8 5 4 8 4C11 4 12 12 15 12C18 12 19 4 22 4C24 4 25 8 26 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 30"
                initial={{ strokeDashoffset: 36 }}
                animate={{
                  strokeDashoffset: [36, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  opacity: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            </svg>
          </div>

          {/* Pill 2: Page Label (Removed per request) */}

          {/* Pill 3: Menu Toggle (Solid, Double Wave) */}
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-24 h-[44px] rounded-full bg-[#3E2B26] text-[#F3F0E7] border-none transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Double Wave/Stream Icon */}
              <path d="M4 9C7 9 9 11 12 11C15 11 17 9 20 9" />
              <path d="M4 15C7 15 9 17 12 17C15 17 17 15 20 15" />
            </svg>
          </button>
        </div>
      </nav>

      {/* --- The Menu Overlay --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />

            {/* Menu Container */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "70vh", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="fixed top-0 left-0 w-full bg-[#EAE8DC] text-[#3E2B26] rounded-b-[3rem] shadow-2xl z-50 overflow-hidden flex flex-col"
            >

              {/* Inner Header - Invisible Ghost Logo */}
              <div className="flex justify-between items-center px-6 md:px-12 py-8 w-full shrink-0">
                <Link href="/" onClick={() => setIsOpen(false)} className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-[#3E2B26] invisible">BLOOM BRANDING</Link>
              </div>

              {/* Grid Layout Content */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 px-6 md:px-12 pb-12 pt-4 h-full overflow-y-auto lg:overflow-visible">

                {/* Column 1: Branding & Visuals (Grouped at Bottom) */}
                <div className="flex lg:col-span-3 flex-col h-full lg:pr-8 justify-end pb-8 lg:pb-24 gap-6 lg:gap-10">
                  {/* Top: Copyright (Bodoni) */}
                  <div className="order-2 lg:order-1">
                    <h2 className="font-bodoni text-2xl lg:text-3xl mb-2"><span className="mr-1 font-sans text-lg relative -top-[2px]">©</span>2026</h2>
                    <p className="text-[10px] lg:text-xs text-[#3E2B26]/70 w-full lg:w-3/4 leading-relaxed font-sans">
                      Bloom Branding Industries. All rights reserved.
                    </p>
                  </div>

                  {/* Middle: Socials (Real Links) */}
                  <div className="flex gap-4 order-1 lg:order-2">
                    {[
                      { Icon: Linkedin, href: "https://in.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency" },
                      { Icon: Facebook, href: "https://www.facebook.com/hello.bloombranding/" },
                      { Icon: Instagram, href: "https://www.instagram.com/bloom.branding_/" }
                    ].map(({ Icon, href }, i) => (
                      <Link
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-[#3E2B26] text-[#F3F0E7] flex items-center justify-center hover:bg-[#5A4238] transition duration-300"
                      >
                        <Icon size={18} strokeWidth={1.5} />
                      </Link>
                    ))}
                  </div>

                  {/* Bottom: Image (Replaces Video) */}
                  <div className="hidden lg:block w-full max-w-[270px] aspect-video rounded-lg relative overflow-hidden shadow-sm group cursor-pointer lg:order-3">
                    <Image
                      src="/bloom-1.jpg"
                      alt="Bloom Branding Visual"
                      fill
                      className="object-cover group-hover:scale-105 transition duration-700 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                </div>

                {/* Column 2: Navigation Links (No Italic Active) */}
                <div className="col-span-1 lg:col-span-5 flex flex-col justify-center lg:pl-12 lg:border-l border-[#3E2B26]/10 py-8 lg:py-0">
                  <ul className="flex flex-col pl-4 md:pl-16">
                    {menuItems.map((item, idx) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.label} className="group relative">
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`font-bodoni block transition-all duration-500 antialiased font-light tracking-[-0.02em] leading-[1.1] py-1
                              text-4xl md:text-5xl lg:text-6xl
                              ${isActive
                                ? "text-[#3E2B26] opacity-100 translate-x-2 md:translate-x-4 italic"
                                : "text-[#3E2B26] opacity-30 hover:opacity-100 hover:translate-x-2 md:hover:translate-x-4"
                              }`}
                          >
                            <span className="inline-block relative">
                              {/* Arrow Indicator */}
                              {isActive && (
                                <span className="absolute -left-7 md:-left-14 top-1/2 -translate-y-[45%] text-3xl md:text-4xl font-light text-[#3E2B26]">
                                  ›
                                </span>
                              )}
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Column 3: Info Details (Compact Typography) */}
                <div className="flex lg:col-span-3 flex-col justify-center lg:pl-16 space-y-6 lg:space-y-4 text-[#3E2B26] border-t lg:border-t-0 border-[#3E2B26]/10 pt-8 lg:pt-0">
                  {contactInfo.map((info) => (
                    <div key={info.title}>
                      {/* Label: Very Small, Muted, Sans, Uppercase */}
                      <h3 className="font-sans text-[10px] lg:text-xs text-[#3E2B26]/50 mb-1 lg:mb-0 uppercase tracking-widest">
                        {info.title}
                      </h3>
                      {/* Value: Medium-Large, Clean, Sans */}
                      {info.lines.map((line, i) => (
                        <p key={i} className="font-sans text-base lg:text-lg md:text-xl text-[#3E2B26] font-light leading-tight">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}