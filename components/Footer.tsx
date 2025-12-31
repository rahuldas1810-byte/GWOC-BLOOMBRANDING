'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { Inter, Cinzel_Decorative } from 'next/font/google'

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
    <footer className={`relative overflow-hidden pt-20 pb-0 ${inter.variable} font-sans text-[#FDF6EE]`}>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer-bg.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        {/* Optional overlay if needed for text readability, but not requested */}
      </div>

      <div className="container-custom relative z-10">

        {/* Top Row: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 md:mb-32">

          {/* Column 1: Come by */}
          <div className="flex flex-col gap-6">
            <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-[#FDF6EE]">
              Come by
            </h3>
            <address className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 not-italic">
              Bloom Branding Studio<br />
              Bloom Branding, Solarium<br />
              Business Centre, 515,<br />
              beside Times Corner, Surat,<br />
              Gujarat 395007
            </address>
          </div>

          {/* Column 2: Say hello */}
          <div className="flex flex-col gap-6">
            <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-[#FDF6EE]">
              Say hello
            </h3>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@bloombranding.com" className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Email us
              </a>
              <a
                href="https://www.instagram.com/bloom.branding_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 hover:text-white transition-colors inline-block"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Column 3: Explore */}
          <div className="flex flex-col gap-6">
            <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-[#FDF6EE]">
              Explore
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Home
              </Link>
              <Link href="/our-story" className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Our Story
              </Link>
              <Link href="/services" className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Services
              </Link>
              <Link href="/clients" className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Clients
              </Link>
              <Link href="/testimonials" className="font-[family-name:var(--font-inter)] font-normal text-[15px] leading-[1.6] text-white/85 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Testimonials
              </Link>
            </nav>
          </div>

          {/* Column 4: Tagline + CTA */}
          <div className="flex flex-col gap-8 md:pl-4">
            <div className="flex flex-col gap-2">
              <Image
                src="/bloom-logo.png"
                alt="Bloom Branding"
                width={240}
                height={80}
                className="w-56 h-auto object-contain brightness-0 invert"
              />
              <p className="font-serif italic font-normal text-[24px] md:text-[28px] leading-[1.3] text-[#FFF6EC]">
                Helping brands bloom
              </p>
            </div>
            <div>
              <Link
                href="/contact"
                className="inline-block bg-[#1A1A1A] hover:bg-black text-[#FDF6EE] font-[family-name:var(--font-inter)] font-medium text-[14px] px-7 py-[14px] rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Wordmark */}
        <div className="relative w-full flex justify-center pb-4 md:pb-8">
          <h1 className={`${cinzel.className} font-normal text-[clamp(72px,10vw,120px)] tracking-[0.08em] leading-none text-white text-center uppercase whitespace-nowrap`}>
            Bloom Branding
          </h1>
        </div>
      </div>
    </footer>
  )
}
