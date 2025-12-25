"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out
          ${isScrolled
            ? "bg-[#F6F4F1] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            : "bg-transparent py-6"
          }`}
      >
        <div className="w-full pl-10 pr-6 lg:pl-16 lg:pr-12">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="relative z-50 group block">
              <motion.div
                animate={{ scale: isScrolled ? 1.0 : 1.15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative origin-left"
              >
                {/* Nested div for independent hover scaling */}
                <div className="group-hover:scale-[1.02] transition-transform duration-300 ease-out origin-left">
                  <Image
                    src="/bloom-logo.png"
                    alt="Bloom Branding Logo"
                    width={260}
                    height={70}
                    className="h-full max-h-[56px] w-auto object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 ml-10">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative group py-2"
                  >
                    <motion.span
                      className={`block text-[14px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${isScrolled
                          ? isActive
                            ? "text-[#2E4AA7]"
                            : "text-[#4B4B4B] group-hover:text-[#2E4AA7]"
                          : isActive
                            ? "text-[#2E4AA7]"
                            : "text-[#3b2f2f] group-hover:text-[#2E4AA7]"
                        }`}

                      whileHover={{ y: -2 }}
                    >
                      {item.label}
                    </motion.span>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#2E4AA7]/30"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-6 ml-auto">
              <Link
                href="/contact"
                className={`hidden lg:inline-block px-8 py-2.5 text-[12px] font-medium uppercase tracking-[0.25em] transition-all duration-300
                  ${isScrolled
                    ? "border border-[#2E4AA7] text-[#2E4AA7] hover:bg-[#2E4AA7] hover:text-white"
                    : "border border-[#3b2f2f]/30 text-[#3b2f2f] hover:bg-[#3b2f2f] hover:text-white"
                  }
                `}

              >
                Let's Talk
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#6B6B6B] z-50 relative hover:text-[#2E4AA7] transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden border-t border-black/[0.05] bg-[#F6F4F1]/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container-custom py-10 space-y-6 flex flex-col items-start px-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-300 ${pathname === item.href
                        ? "text-[#2E4AA7]"
                        : "text-[#6B6B6B] hover:text-[#2E4AA7]"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-4"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-white bg-[#2E4AA7] px-8 py-3.5 hover:bg-opacity-90 transition-colors"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
