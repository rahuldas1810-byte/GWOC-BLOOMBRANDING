"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-dark-choc/5"
    >
      <div className="container-custom pl-3 pr-4 md:pl-5 md:pr-7 lg:pl-6 lg:pr-10">
        <div className="flex items-center justify-between py-3.5 md:py-4">
<Link href="/" className="flex items-center h-full pr-6">
  <Image
    src="/bloom-logo.png"
    alt="Bloom Branding Logo"
    width={2200}
    height={1600}
    className="h-full max-h-[64px] md:max-h-80px] w-auto object-contain"
    priority
  />
</Link>


          <div className="flex-1 flex justify-center h-full">
            <div className="hidden lg:flex items-center h-full space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] font-medium uppercase tracking-[0.25em] transition-colors duration-500 ${
                    pathname === item.href
                      ? "text-electric-blue"
                      : "text-dark-choc/80 hover:text-electric-blue"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 h-full">
            <Link
              href="/contact"
              className="hidden lg:inline-block text-[12px] font-medium uppercase tracking-[0.25em] text-dark-choc border border-dark-choc px-10 py-2.5 hover:bg-dark-choc hover:text-white transition-colors duration-500"
            >
              Contact
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-dark-choc hover:text-electric-blue transition-colors duration-500"
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden border-t border-dark-choc/5 bg-earl-gray"
          >
            <div className="container-custom py-10 space-y-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-500 ${
                    pathname === item.href
                      ? "text-electric-blue"
                      : "text-dark-choc/70 hover:text-electric-blue"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-white bg-electric-blue px-7 py-4 mt-4"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
