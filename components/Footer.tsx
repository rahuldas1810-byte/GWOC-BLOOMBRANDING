import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-electric-blue text-white">
      <div className="container-custom py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-5">
            {/* Logo */}
            <div className="mb-8">
              <span className="font-serif text-4xl text-white">Bloom</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 ml-2">
                Branding
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-butter-yellow mb-5">
              Helping Brands Bloom
            </p>
            <p className="font-sans text-white/60 text-base leading-relaxed max-w-sm">
              Bringing synergy of aesthetics and expertise to help your brand bloom.
            </p>
          </div>
          
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-butter-yellow mb-8">Pages</h4>
            <ul className="space-y-5">
              <li>
                <Link href="/our-story" className="font-sans text-base text-white/60 hover:text-white transition-colors duration-500">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/services" className="font-sans text-base text-white/60 hover:text-white transition-colors duration-500">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/clients" className="font-sans text-base text-white/60 hover:text-white transition-colors duration-500">
                  Clients
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="font-sans text-base text-white/60 hover:text-white transition-colors duration-500">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-butter-yellow mb-8">Contact</h4>
            <Link
              href="/contact"
              className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-white border border-white/30 px-7 py-4 hover:bg-white hover:text-electric-blue transition-colors duration-500"
            >
              Get in Touch
            </Link>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            &copy; {new Date().getFullYear()} Bloom Branding
          </p>
          {/* Brand Mark */}
          <span className="font-serif text-3xl text-butter-yellow/70">
            Bb.
          </span>
        </div>
      </div>
    </footer>
  )
}
