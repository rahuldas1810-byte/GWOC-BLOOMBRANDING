'use client'

import SectionReveal from '@/components/SectionReveal'
import Image from 'next/image'

export default function OurStory() {
  return (
    <div className="min-h-screen">
{/* Hero */}
<section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
  <div className="container-custom">
    <SectionReveal>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* LEFT — TEXT */}
        <div className="lg:pr-12">
          <p className="label-text mb-8">About Bloom</p>
          <h1 className="heading-1 mb-10">Our Story</h1>
          <p className="body-text max-w-md">
            We believe in brands that are confident, clear, and built to last.
          </p>
        </div>

        {/* RIGHT — IMAGE */}
        <div className="flex justify-end lg:justify-center">
          <div className="relative w-full max-w-lg">

            {/* subtle editorial background */}
            <div className="absolute inset-0 rounded-2xl bg-dark-choc/5 -rotate-1"></div>

            {/* image card */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)] float-image">
              <Image
                src="/who-we-are.jpg"
                alt="Bloom Branding studio"
                width={1200}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>

          </div>
        </div>

      </div>
    </SectionReveal>
  </div>
</section>



      {/* Who We Are */}
      <SectionReveal>
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-28 items-start">

              <div className="lg:col-span-5">
                <p className="label-text mb-5">Who We Are</p>
                <h2 className="heading-2 leading-tight max-w-sm">
  A studio built on clarity.
</h2>

              </div>
              <div className="lg:col-span-6 lg:col-start-7 space-y-10">

                <p className="body-text">
                  Bloom Branding is a strategic branding agency focused on helping modern companies
                  build brand identities that matter. We work with startups, D2C brands, and creators
                  who are ready to make a real impact in their markets.
                </p>
                <p className="body-text">
                  Our team combines strategic thinking with clean, confident design. We don&apos;t chase trends.
                  We build brands that stand the test of time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

{/* Philosophy */}
<SectionReveal>
  <section className="section-padding bg-butter-yellow/40">
    <div className="container-custom">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <p className="label-text mb-5">Our Philosophy</p>
          <h2 className="heading-2">What we believe.</h2>
        </div>

        {/* Philosophy Items */}
        <div className="space-y-20">

          {/* Item 1 */}
          <SectionReveal delay={0.1}>
            <div className="relative pl-10 md:pl-12">
              <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-dark-choc/40" />
              <h3 className="heading-3 mb-6">Clarity Over Complexity</h3>
              <p className="body-text">
                The best brands are simple, clear, and easy to understand. We strip away the noise
                and focus on what truly matters—your core message and visual identity.
              </p>
            </div>
          </SectionReveal>

          {/* Item 2 */}
          <SectionReveal delay={0.2}>
            <div className="relative pl-10 md:pl-12">
              <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-dark-choc/40" />
              <h3 className="heading-3 mb-6">Strategy First</h3>
              <p className="body-text">
                Every design decision we make is backed by strategic thinking. We don&apos;t create
                beautiful things for the sake of it—we create brands that work.
              </p>
            </div>
          </SectionReveal>

          {/* Item 3 */}
          <SectionReveal delay={0.3}>
            <div className="relative pl-10 md:pl-12">
              <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-dark-choc/40" />
              <h3 className="heading-3 mb-6">Confidence, Not Flash</h3>
              <p className="body-text">
                Premium doesn&apos;t mean flashy. We build brands that are confident and refined,
                not attention-seeking. Your brand should feel like it belongs, not like it&apos;s trying too hard.
              </p>
            </div>
          </SectionReveal>

        </div>

      </div>
    </div>
  </section>
</SectionReveal>



{/* Why We Exist */}
<section className="section-padding bg-white">
  <div className="container-custom">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

      {/* IMAGE — reveals first */}
      <div className="lg:col-span-6 order-2 lg:order-1">
        <SectionReveal delay={0}>
          <div className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
            <Image
              src="/27.jpg"
              alt="Bloom Branding work showcase"
              width={1800}
              height={1000}
              className="w-full h-auto"
              priority
            />
          </div>
        </SectionReveal>
      </div>

      {/* TEXT — reveals slightly after */}
      <div className="lg:col-span-6 order-1 lg:order-2">
        <SectionReveal delay={0.15}>
          <p className="label-text mb-5">Our Purpose</p>
          <h2 className="heading-2 mb-10">Why We Exist</h2>

          <p className="body-text mb-8">
            The branding industry is full of agencies that overcomplicate things. They add layers
            of jargon, unnecessary features, and flashy designs that don&apos;t serve the brand.
          </p>

          <p className="body-text">
            We exist to do the opposite. We help companies build brand identities that are
            strategic, clear, and built to last. We focus on what matters: your story, your
            audience, and your goals. Everything else is noise.
          </p>
        </SectionReveal>
      </div>

    </div>
  </div>
</section>


      {/* What Makes Us Different */}
      <SectionReveal>
        <section className="section-padding bg-earl-gray">
          <div className="container-custom">
            <div className="mb-20">
              <p className="label-text mb-5">Our Difference</p>
              <h2 className="heading-2">What Sets Us Apart</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-dark-choc/5">
              <div className="bg-white p-12 md:p-16 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

                <h3 className="font-serif text-2xl text-dark-choc mb-6">Focused Approach</h3>
                <p className="body-text text-near-black/60">
                  We don&apos;t try to be everything to everyone. We focus on what we do best:
                  strategic brand identity for modern companies.
                </p>
              </div>
              <div className="bg-white p-12 md:p-16 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">


                <h3 className="font-serif text-2xl text-dark-choc mb-6">No Jargon</h3>
                <p className="body-text text-near-black/60">
                  We speak clearly and directly. No buzzwords, no fluff. Just honest
                  communication about your brand.
                </p>
              </div>
              <div className="bg-white p-12 md:p-16 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

                <h3 className="font-serif text-2xl text-dark-choc mb-6">Results-Driven</h3>
                <p className="body-text text-near-black/60">
                  Every brand we build is designed to help you achieve your goals.
                  We measure success by your success.
                </p>
              </div>
              <div className="bg-white p-12 md:p-16 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

                <h3 className="font-serif text-2xl text-dark-choc mb-6">Long-Term Thinking</h3>
                <p className="body-text text-near-black/60">
                  We build brands that last. Not trends that fade. Your brand should
                  grow with you, not against you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  )
}
