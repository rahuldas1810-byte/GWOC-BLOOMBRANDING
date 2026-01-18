"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Linkedin, Facebook, Instagram } from "lucide-react";
import { Playfair_Display, Inter, Bodoni_Moda } from "next/font/google";

import { getSiteSettings } from "@/lib/content";

// 1. Setup Fonts
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap"
});



// Data Arrays
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
  { title: "Contact", lines: ["comercial@bloombranding.com"] }, // Removed Phone Number
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://www.instagram.com/bloom.branding_/",
    linkedin: "https://in.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency",
    facebook: "https://www.facebook.com/hello.bloombranding/"
  });
  const pathname = usePathname();

  // Scroll State
  const [isVisible, setIsVisible] = useState(true); // For mobile hide/show
  const [isScrolled, setIsScrolled] = useState(false); // For desktop opacity
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const fetchLinks = async () => {
      const settings = await getSiteSettings();
      if (settings?.socialLinks) {
        setSocialLinks({
          instagram: settings.socialLinks.instagram || "https://www.instagram.com/bloom.branding_/",
          linkedin: settings.socialLinks.linkedin || "https://in.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency",
          facebook: settings.socialLinks.facebook || "https://www.facebook.com/hello.bloombranding/"
        });
      }
    };
    fetchLinks();
  }, []);

  // Smart Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Desktop: Check if scrolled past threshold for opacity
      setIsScrolled(currentScrollY > 50);

      // Mobile: Smart Hide/Show
      // Visible if scrolling UP or at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling DOWN -> Hide
        setIsVisible(false);
      } else {
        // Scrolling UP -> Show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


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
         --- Top Navigation Bar --- 
      */}
      <nav 
        className={`fixed top-0 left-0 w-full z-[60] px-6 md:px-12 py-6 md:py-8 flex justify-between items-center transition-all duration-300
          ${/* Mobile: Hide/Show transformation */ ""}
          ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}
          
          ${/* Desktop: Bg Opacity logic */ ""}
          ${isScrolled ? 'md:bg-[#F3F0E7] md:shadow-sm' : 'bg-transparent'}
          
          ${/* Blend mode: Only use difference when NOT scrolled/opaque on desktop (to see logo over hero images) */ ""}
          ${isScrolled ? 'text-[#3E2B26]' : 'mix-blend-mode-difference text-[#3E2B26]'}
          
          pointer-events-none
        `}
      >

        {/* Logo */}
        <Link href="/" className="pointer-events-auto">
          <Image
            src="/bloom-logo.png"
            alt="Bloom Branding"
            width={400}
            height={100}
            className="h-12 md:h-24 w-auto object-contain"
            priority
          />
        </Link>

        {/* Header Controls - Squiggle & Wave Pills */}
        <div className={`flex items-center gap-3 pointer-events-auto ${isScrolled ? '' : 'mix-blend-normal'}`}>

          {/* Pill 1: Decorative Squiggle (Outlined) */}
          <div className="hidden md:flex items-center justify-center w-[72px] h-[44px] rounded-full border border-[#3E2B26] text-[#3E2B26] bg-transparent transition-all duration-300">
            <svg
              width="28"
              height="16"
              viewBox="0 0 28 16"
              fill="none"
            >
              <path
                d="M2 8C4 8 5 4 8 4C11 4 12 12 15 12C18 12 19 4 22 4C24 4 25 8 26 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />
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

          {/* Pill 3: Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-24 h-[44px] rounded-full bg-[#3E2B26] text-[#F3F0E7] border-none transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
              animate={{ height: "85vh", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="fixed top-0 left-0 w-full bg-[#EAE8DC] text-[#3E2B26] rounded-b-[3rem] shadow-2xl z-50 overflow-hidden flex flex-col"
            >

              {/* Inner Header - Invisible Ghost Logo */}
              <div className="flex justify-between items-center px-6 md:px-12 py-8 w-full shrink-0">
                <Link href="/" onClick={() => setIsOpen(false)} className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-[#3E2B26] invisible">BLOOM BRANDING</Link>
              </div>

              {/* Grid Layout Content */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 px-6 md:px-12 pb-12 pt-0 h-full overflow-y-auto lg:overflow-visible content-start lg:content-stretch">

                {/* 
                  MOBILE ORDER CHANGE:
                  1. Navigation Links (Top on mobile)
                  2. Branding & Visuals (Bottom Right on mobile)
                  3. Info Details (Bottom Left on mobile but grouped)
                */}

                {/* --- NAVIGATION LINKS --- */}
                {/* Order 1 on Mobile, Col-span-5 on Desktop */}
                <div className="order-1 lg:order-2 col-span-1 lg:col-span-5 flex flex-col justify-start lg:justify-center lg:pl-12 lg:border-l border-[#3E2B26]/10 py-6 lg:py-0">
                  <ul className="flex flex-col pl-2 md:pl-16 space-y-2 lg:space-y-0">
                    {menuItems.map((item, idx) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.label} className="group relative">
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`block transition-all duration-500 antialiased font-light tracking-[-0.02em] leading-[1.1] py-1
                              ${/* Mobile Font: Serif (Playfair), Smaller */ ""}
                              font-serif lg:font-bodoni
                              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                              ${isActive
                                ? "text-[#3E2B26] opacity-100 translate-x-2 md:translate-x-4 italic"
                                : "text-[#3E2B26] opacity-60 lg:opacity-30 hover:opacity-100 hover:translate-x-2 md:hover:translate-x-4"
                              }`}
                          >
                            <span className="inline-block relative">
                              {/* Arrow Indicator */}
                              {isActive && (
                                <span className="absolute -left-5 lg:-left-14 top-1/2 -translate-y-[45%] text-2xl lg:text-4xl font-light text-[#3E2B26]">
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

                {/* --- BRANDING & SOCIALS --- */}
                {/* Order 2 on Mobile (Grouped below nav for easy access or visual hierarchy), Col-span-3 on Desktop */}
                <div className="order-2 lg:order-1 flex lg:col-span-3 flex-col h-full lg:pr-8 justify-end pb-8 lg:pb-24 gap-6 lg:gap-10 mt-8 lg:mt-0">
                  
                  {/* Top: Copyright (Bodoni) -> Right aligned on mobile */}
                  <div className="order-2 lg:order-1 w-full flex flex-col lg:items-start items-end text-right lg:text-left">
                    <h2 className="font-bodoni text-2xl lg:text-3xl mb-2"><span className="mr-1 font-sans text-lg relative -top-[2px]">©</span>2026</h2>
                    <p className="text-[10px] lg:text-xs text-[#3E2B26]/70 w-3/4 lg:w-3/4 leading-relaxed font-sans">
                      Bloom Branding Industries. All rights reserved.
                    </p>
                  </div>

                  {/* Middle: Socials -> Right aligned on mobile */}
                  <div className="order-1 lg:order-2 flex gap-4 w-full justify-end lg:justify-start">
                    {[
                      { Icon: Linkedin, href: socialLinks.linkedin },
                      { Icon: Facebook, href: socialLinks.facebook },
                      { Icon: Instagram, href: socialLinks.instagram }
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

                  {/* Bottom: Image (Desktop Only) */}
                  <div className="hidden lg:block w-full max-w-[270px] aspect-video rounded-lg relative overflow-hidden shadow-sm group cursor-pointer lg:order-3">
                    <Image
                      src="/bloom-1.jpg"
                      alt="Bloom Branding Visual"
                      fill
                      className="object-cover group-hover:scale-105 transition duration-700 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                </div>

                {/* --- CONTACT INFO --- */}
                {/* Order 3 on Mobile, Col-span-3 on Desktop */}
                <div className="order-3 flex lg:col-span-3 flex-col justify-end lg:justify-center lg:pl-16 space-y-6 lg:space-y-4 text-[#3E2B26] border-t lg:border-t-0 border-[#3E2B26]/10 pt-8 lg:pt-0 mt-4 lg:mt-0">
                  {contactInfo.map((info) => {
                     // Filter out phone number manually if it matches the known phone pattern, 
                     // OR just render the updated array. 
                     // Since I removed it from the data array below, this map just renders what's there.
                     return (
                      <div key={info.title}>
                        <h3 className="font-sans text-[10px] lg:text-xs text-[#3E2B26]/50 mb-1 lg:mb-0 uppercase tracking-widest">
                          {info.title}
                        </h3>
                        {info.lines.map((line, i) => (
                          <p key={i} className="font-sans text-base lg:text-lg md:text-xl text-[#3E2B26] font-light leading-tight">
                            {line}
                          </p>
                        ))}
                      </div>
                     )
                  })}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}