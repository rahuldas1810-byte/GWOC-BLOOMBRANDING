"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Add email submission logic
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
    }, 1000);
  };

  return (
    <footer className="bg-white text-near-black">
      {/* Thin divider line above footer */}
      <div className="border-t border-near-black/10"></div>

      <div className="container-custom py-4 md:py-6">
        {/* CTA Section */}
        <div className="mb-6 md:mb-8">
          <h3 className="font-serif text-xl md:text-2xl text-near-black mb-3 text-center md:text-left">
            Ready to elevate your brand?
          </h3>
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block font-sans text-sm text-near-black/70 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-1.5 border border-near-black/20 rounded-sm focus:outline-none focus:border-near-black/40 transition-colors duration-300 font-sans text-near-black bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 bg-electric-blue text-white font-mono text-xs uppercase tracking-[0.15em] hover:bg-electric-blue-dark transition-colors duration-300 rounded-sm disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center mb-4">
          {/* Left: Logo */}
          <div className="flex items-start">
            <Link href="/" className="inline-block">
              <Image
                src="/bloom-logo.png"
                alt="Bloom Branding Logo"
                width={180}
                height={70}
                className="object-contain opacity-100 hover:opacity-100 -mt-1"
                priority
              />
            </Link>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex flex-nowrap justify-end items-center gap-x-5">

            <Link
              href="/our-story"
              className="font-sans text-xs md:text-[13px] uppercase tracking-wide whitespace-nowrap text-near-black/80 hover:text-near-black transition-all duration-300 font-medium"


            >
              OUR STORY
            </Link>
            <Link
              href="/services"
              className="font-sans text-xs md:text-sm uppercase tracking-wide text-near-black/80 hover:text-near-black transition-all duration-300 font-medium"

            >
              SERVICES
            </Link>
            <Link
              href="/clients"
              className="font-sans text-xs md:text-sm uppercase tracking-wide text-near-black/80 hover:text-near-black transition-all duration-300 font-medium"

            >
              CLIENTS
            </Link>
            <Link
              href="/testimonials"
              className="font-sans text-xs md:text-sm uppercase tracking-wide text-near-black/80 hover:text-near-black transition-all duration-300 font-medium"

            >
              TESTIMONIALS
            </Link>
            <Link
              href="/contact"
              className="font-sans text-sx md:text-sm uppercase tracking-tight text-near-black/80 hover:text-near-black hover:-translate-y-0.5 transition-all duration-300 font-medium"
            >
              CONTACT
            </Link>
          </div>
        </div>

        {/* Bottom: Divider, Social Icons, and Copyright */}
        <div className="pt-3 border-t-2 border-near-black/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-near-black/60 font-medium">
              &copy; {new Date().getFullYear()} Bloom Branding. All rights
              reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/bloom.branding_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-near-black/60 hover:text-near-black hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/hello.bloombranding/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-near-black/60 hover:text-near-black hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-near-black/60 hover:text-near-black hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
