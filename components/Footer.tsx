'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Linkedin, Facebook, Mail, MapPin, Phone } from 'lucide-react'
import { Inter, Cinzel_Decorative } from 'next/font/google'
import { motion } from 'framer-motion'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const cinzel = Cinzel_Decorative({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Footer() {
  return (
    <footer className={`relative overflow-hidden pt-16 pb-6 md:pt-20 md:pb-8 ${inter.variable} font-sans text-[#FDF6EE]`}>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer-bg.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Row: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16 md:mb-20">

          {/* Column 1: Come by */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-white tracking-wide uppercase">
              Come by
            </h3>
            <address className="font-[family-name:var(--font-inter)] font-normal text-[14px] leading-[1.6] text-white not-italic space-y-1">
              <p className="flex items-start gap-3 text-white">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-white/80" />
                <span className="text-white">Bloom Branding Studio<br />Bloom Branding, Solarium<br />Business Centre, 515,<br />beside Times Corner, Surat,<br />Gujarat 395007</span>
              </p>
            </address>
          </motion.div>

          {/* Column 2: Say hello */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-white tracking-wide uppercase">
              Say hello
            </h3>
            <div className="flex flex-col gap-3">
              <motion.a
                href="mailto:hello@bloombranding.com"
                className="group flex items-center gap-2.5 font-[family-name:var(--font-inter)] font-normal text-[14px] text-white/90 hover:text-white transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="relative">
                  Email us
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                </span>
              </motion.a>
              <div className="flex items-center gap-3">
                <motion.a
                  href="https://www.instagram.com/bloom.branding_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={16} strokeWidth={1.5} />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={16} strokeWidth={1.5} />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook size={16} strokeWidth={1.5} />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Explore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-white tracking-wide uppercase">
              Explore
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/our-story', label: 'Our Story' },
                { href: '/services', label: 'Services' },
                { href: '/clients', label: 'Clients' },
                { href: '/testimonials', label: 'Testimonials' },
                { href: '/contact', label: 'Contact' },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="group font-[family-name:var(--font-inter)] font-normal text-[14px] text-white/90 hover:text-white transition-all duration-300 inline-block"
                  >
                    <span className="relative">
                      {item.label}
                      <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Column 4: Tagline + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-5 lg:pl-4"
          >
            <div className="flex flex-col gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/bloom-logo.png"
                  alt="Bloom Branding"
                  width={240}
                  height={80}
                  className="w-48 md:w-56 h-auto object-contain brightness-0 invert"
                />
              </motion.div>
              <p className="font-serif italic font-light text-[22px] md:text-[26px] leading-[1.3] text-white/95">
                Helping brands bloom
              </p>
            </div>
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-[family-name:var(--font-inter)] font-semibold text-[13px] md:text-[14px] px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Book a Consultation</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Wordmark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full flex justify-center pb-4 md:pb-6"
        >
          <h1 className={`${cinzel.className} font-normal text-[clamp(40px,8vw,96px)] tracking-[0.1em] leading-none text-white/95 text-center uppercase whitespace-nowrap`}>
            Bloom Branding
          </h1>
        </motion.div>

        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-white/10 pt-4 md:pt-5 text-center"
        >
          <p className="font-[family-name:var(--font-inter)] text-[12px] md:text-[13px] text-white/60">
            © {new Date().getFullYear()} Bloom Branding. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
