"use client";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import ExperienceSection from "@/components/ExperienceSection";
import { getTestimonials, getClients } from "@/lib/content";
import { homepageContent } from "@/content/homepage";
import type { Testimonial, Client } from "@/types";

const services = [
  {
    title: "Brand Identity",
    description: "Complete visual identity systems that define who you are.",
  },
  {
    title: "Visual Design",
    description: "Stunning design that communicates your brand story.",
  },
  {
    title: "Social Media Branding",
    description: "Cohesive brand presence across all social platforms.",
  },
  {
    title: "Content Strategy",
    description: "Strategic messaging that resonates with your audience.",
  },
  {
    title: "Creative Direction",
    description: "End-to-end creative vision for your brand.",
  },
  {
    title: "Marketing Campaigns",
    description: "Data-driven campaigns designed to amplify reach and impact.",
  },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [testimonialsData, clientsData] = await Promise.all([
        getTestimonials(),
        getClients(),
      ]);
      setTestimonials(testimonialsData);
      setClients(clientsData);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#1f1b16]/45" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl"
            >
              <p className="label-text mb-8 text-white/70">
                Helping Brands Bloom
              </p>
              <h1 className="heading-1 mb-10 text-white">
                We craft brand
                <br />
                identities that
                <br />
                <span className="text-electric-blue">resonate.</span>
              </h1>
              <p className="body-text max-w-xl mb-14 text-white/80">
                {homepageContent.heroSubheading}
              </p>
              <Link href="/contact" className="btn-primary">
                Start Your Project
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <SectionReveal>
        <section className="section-padding bg-earl-gray relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-[0.03]">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-electric-blue rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.1, 1],
                x: ["50%", "45%", "50%"],
                y: ["-50%", "-55%", "-50%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-butter-yellow rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"
              animate={{
                scale: [1, 1.15, 1],
                x: ["-50%", "-45%", "-50%"],
                y: ["50%", "55%", "50%"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            ></motion.div>
          </div>
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #624A41 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="container-custom relative z-10">
            <div className="mb-20">
              <p className="label-text mb-5">What We Do</p>
              <h2 className="heading-2 mb-8">Our Services</h2>
              <p className="body-text max-w-2xl">
                Strategic branding services designed for companies ready to make
                an impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-dark-choc/5">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group relative bg-white p-10 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:bg-butter-yellow/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                >
                  <span className="pointer-events-none absolute inset-0 border border-electric-blue/0 transition-all duration-500 group-hover:border-electric-blue/40 scale-95 group-hover:scale-100" />
                  <h3 className="heading-3 mb-5 transition-colors group-hover:text-electric-blue">
                    {service.title}
                  </h3>
                  <p className="body-text text-near-black/60 group-hover:text-near-black/80">
                    {service.description}
                  </p>
                  <div className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-electric-blue opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    Explore →
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ================= VIDEO BREAK ================= */}
      <section className="w-screen h-screen overflow-hidden bg-black">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </motion.video>
      </motion.section>

      {/* ================= CLIENTS ================= */}
      {clients.length > 0 && (
        <SectionReveal>
          <section className="section-padding bg-white relative overflow-hidden">
            {/* Gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-earl-gray/20 via-transparent to-butter-yellow/10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            ></motion.div>
            {/* Subtle diagonal lines pattern */}
            <motion.div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  #624A41 10px,
                  #624A41 11px
                )`,
                backgroundSize: "40px 40px",
              }}
              animate={{
                backgroundPosition: ["0 0", "40px 40px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            ></motion.div>
            <div className="container-custom relative z-10">
              <div className="text-center mb-20">
                <motion.p
                  className="label-text mb-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Our Clients
                </motion.p>
                <motion.h2
                  className="heading-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Trusted By
                </motion.h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
                {clients.map((client) => (
                  <span
                    key={client.id}
                    className="text-center font-serif text-xl text-dark-choc/40"
                  >
                    {client.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      )}

      {/* ================= EXPERIENCE ================= */}
      <SectionReveal>
        <ExperienceSection />
      </SectionReveal>

      {/* ================= TESTIMONIALS SLIDER ================= */}
      {testimonials.length > 0 && (
        <SectionReveal>
          <section className="section-padding bg-butter-yellow/40 overflow-hidden relative">
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 via-transparent to-dark-choc/5"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            ></motion.div>
            {/* Decorative circles */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-electric-blue/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 bg-dark-choc/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, -25, 0],
                y: [0, 25, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            ></motion.div>
            <div className="container-custom relative z-10">
              <div className="mb-20">
                <motion.p
                  className="label-text mb-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Testimonials
                </motion.p>
                <motion.h2
                  className="heading-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  What Clients Say
                </motion.h2>
              </div>

              <motion.div
                className="flex gap-8"
                animate={{ x: ["0%", "-100%"] }}
                transition={{
                  duration: 40,
                  ease: "linear",
                  repeat: Infinity,
                }}
                drag="x"
                dragConstraints={{ left: -1000, right: 0 }}
              >
                {[...testimonials, ...testimonials].map((t, i) => (
                  <motion.div
                    key={`${t.id}-${i}`}
                    className="
                      relative min-w-[90%] md:min-w-[45%]
                      bg-white p-10 md:p-14
                      rounded-2xl
                      max-w-[520px]
                      border border-dark-choc/5
                      shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                      hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                      hover:-translate-y-1
                      transition-all duration-500
  "
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut", // ✅ CORRECT
                    }}
                  >
                    {/* Decorative Quote */}
                    <span className="absolute -top-6 -left-4 text-[6rem] leading-none font-serif text-electric-blue/10"></span>

                    <p className="font-serif text-[1.75rem] leading-snug text-dark-choc mb-10">
                      {t.quote}
                    </p>

                    <div className="border-t border-dark-choc/10 pt-6">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc">
                        {t.clientName}
                      </p>
                      <p className="text-sm text-near-black/50 mt-1">
                        {t.company}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </SectionReveal>
      )}

      {/* ================= LOCATION ================= */}
      <SectionReveal>
        <section className="section-padding bg-earl-gray relative overflow-hidden">
          {/* Subtle mesh gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-butter-yellow/20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          ></motion.div>
          {/* Dot pattern */}
          <motion.div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #624A41 1.5px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
            animate={{
              backgroundPosition: ["0 0", "30px 30px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"
            animate={{
              scale: [1, 1.2, 1],
              x: ["33.33%", "38%", "33.33%"],
              y: ["-33.33%", "-38%", "-33.33%"],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-72 h-72 bg-butter-yellow/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"
            animate={{
              scale: [1, 1.15, 1],
              x: ["-33.33%", "-28%", "-33.33%"],
              y: ["33.33%", "38%", "33.33%"],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          ></motion.div>
          <div className="container-custom relative z-10">
            <div className="mb-12 md:mb-16">
              <motion.p
                className="label-text mb-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Visit Us
              </motion.p>
              <motion.h2
                className="heading-2 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Our Location
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Address */}
              <motion.div
                className="flex flex-col justify-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <address className="body-text font-serif text-dark-choc not-italic">
                  <motion.p
                    className="heading-3 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Bloom Branding Studio
                  </motion.p>
                  {[
                    "Bloom Branding, Solarium",
                    "Business Centre, 515,",
                    "beside Times Corner, Surat,",
                    "Gujarat 395007",
                  ].map((line, index) => (
                    <motion.p
                      key={index}
                      className="mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + index * 0.1,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  <motion.a
                    href="https://maps.google.com/?q=Bloom+Branding+Studio,+Solarium+Business+Centre,+515,+beside+Times+Corner,+Surat,+Gujarat+395007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-electric-blue hover:text-electric-blue-dark transition-colors mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    whileHover={{ x: 5 }}
                  >
                    Open in Google Maps →
                  </motion.a>
                </address>
              </motion.div>

              {/* Google Maps Embed */}
              <motion.div
                className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.724388888889!2d72.8311!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d156b%3A0xfe4558290938b042!2sTimes%20Corner%2C%20Surat%2C%20Gujarat%20395007!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Bloom Branding Studio Location"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
  );
}
