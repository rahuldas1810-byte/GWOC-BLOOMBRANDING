'use client'

import SectionReveal from '@/components/SectionReveal'
import Image from 'next/image'
import HorizontalMarquee from '@/components/HorizontalMarquee'
import HoverCard from '@/components/HoverCard'

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
                <div className="relative w-full lg:w-[180%] lg:-ml-[5%] max-w-none">
                  <div className="absolute inset-0 rounded-2xl bg-dark-choc/5 -rotate-1"></div>

                  <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)]
                    motion-safe:animate-[float_14s_ease-in-out_infinite]">
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

              <div className="text-center mb-20">
                <p className="label-text mb-5">Our Philosophy</p>
                <h2 className="heading-2">What we believe.</h2>
              </div>

              <div className="space-y-20">
                {[
                  {
                    title: 'Clarity Over Complexity',
                    text: 'The best brands are simple, clear, and easy to understand. We strip away the noise and focus on what truly matters.',
                  },
                  {
                    title: 'Strategy First',
                    text: 'Every design decision we make is backed by strategic thinking. We create brands that work.',
                  },
                  {
                    title: 'Confidence, Not Flash',
                    text: 'Premium doesn’t mean flashy. We build brands that are confident and refined.',
                  },
                ].map((item, i) => (
                  <SectionReveal key={i} delay={0.1 * (i + 1)}>
                    <div className="group relative pl-10 md:pl-12">
                      <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-dark-choc/40
                        transition-transform duration-300 group-hover:scale-125" />
                      <h3 className="heading-3 mb-6">{item.title}</h3>
                      <p className="body-text">{item.text}</p>
                    </div>
                  </SectionReveal>
                ))}
              </div>

            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Horizontal Marquee */}
      <section className="py-32 bg-white overflow-hidden">
        <HorizontalMarquee
          images={[
            '/2.jpg',
            '/3.jpg',
            '/4.jpg',
            '/5.jpg',
            '/6.jpg',
            '/7.jpg',
            '/8.jpg',
            '/9.jpg',
          ]}
        />
      </section>

      {/* Why We Exist */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

            <div className="lg:col-span-7 order-2 lg:order-1">
              <SectionReveal direction="left">
                <div className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
                  <Image
                    src="/27.jpg"
                    alt="Bloom Branding work showcase"
                    width={1800}
                    height={1000}
                    className="w-full h-auto"
                  />
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <SectionReveal direction="right" delay={0.2}>
                <p className="label-text mb-5">Our Purpose</p>
                <h2 className="heading-2 mb-10">Why We Exist</h2>
                <p className="body-text mb-8">
                  The branding industry is full of agencies that overcomplicate things.
                </p>
                <p className="body-text">
                  We help companies build brand identities that are strategic, clear, and built to last.
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
              <HoverCard
                title="Focused Approach"
                description="We don’t try to be everything to everyone. We focus on strategic brand identity."
              />
              <HoverCard
                title="No Jargon"
                description="Clear, honest communication without buzzwords or fluff."
              />
              <HoverCard
                title="Results-Driven"
                description="Every brand is designed to help you achieve measurable goals."
              />
              <HoverCard
                title="Long-Term Thinking"
                description="We build brands that grow with you, not trends that fade."
              />
            </div>

          </div>
        </section>
      </SectionReveal>

    </div>
  )
}
