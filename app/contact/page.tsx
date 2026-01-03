"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Facebook, Mail, MapPin, Phone } from "lucide-react";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SectionReveal from "@/components/SectionReveal";
import { submitContactForm } from "@/app/actions/contact";
import { getContact, getSiteSettings } from "@/lib/content";

// FAQ Component
type FAQItem = {
  question: string;
  answer: string;
};

function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            initial={false}
            className="border border-slate-200 rounded-xl bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-300 overflow-hidden group"
            whileHover={{ y: -2 }}
          >
            <motion.button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-start justify-between gap-4 text-left p-5 md:p-6"
              aria-expanded={isOpen}
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
              whileTap={{ scale: 0.998 }}
            >
              <h3 className="font-sans text-base md:text-lg text-slate-900 pr-8 group-hover:text-blue-600 transition-colors duration-200 font-semibold flex-1 leading-snug">
                {item.question}
              </h3>
              <motion.div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors duration-200"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.svg
                  className="w-5 h-5 text-slate-600 group-hover:text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </motion.svg>
              </motion.div>
            </motion.button>
            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6">
                <p className="font-sans text-sm md:text-base text-slate-600 leading-relaxed pt-1">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const defaultFaqs: FAQItem[] = [
  {
    question: "What services does Bloom Branding offer?",
    answer:
      "We offer comprehensive branding services including brand identity design, logo creation, visual identity systems, brand strategy, content creation, and social media management. We work with businesses of all sizes to create cohesive brand experiences.",
  },
  {
    question: "Do you work with startups or only established brands?",
    answer:
      "We work with both startups and established brands. Whether you're just launching or looking to refresh your existing brand, we tailor our approach to meet your specific needs and goals.",
  },
  {
    question: "How long does a typical branding project take?",
    answer:
      "The timeline varies depending on the scope of the project. A complete brand identity typically takes 6-8 weeks, while smaller projects like logo design or content packages may take 2-4 weeks. We'll provide a detailed timeline after understanding your specific requirements.",
  },
  {
    question: "Can you handle only content or social media management?",
    answer:
      "Yes, we offer standalone content creation and social media management services. You can work with us for individual services or choose our comprehensive branding packages that include everything.",
  },
  {
    question: "Do you work with clients outside Surat?",
    answer:
      "Absolutely! While we're based in Surat, we work with clients across India and internationally. We conduct meetings via video calls and have streamlined processes to ensure smooth collaboration regardless of location.",
  },
  {
    question: "How do we start a project with Bloom Branding?",
    answer:
      "Simply fill out the contact form on this page or reach out via email. We'll schedule an initial consultation to discuss your project, understand your vision, and provide a customized proposal. From there, we'll guide you through our process step by step.",
  },
];

export default function Contact() {
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [contactData, setContactData] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [data, settings] = await Promise.all([
        getContact(),
        getSiteSettings(),
      ]);
      if (data) {
        setContactData(data);
      }
      if (settings) {
        setSiteSettings(settings);
      }
    };
    fetchData();

    // Refresh every 5 seconds to catch admin updates quickly
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fallback data
  const data = contactData || {
    heroLabel: "Let's Talk",
    heroTitle: "Get in Touch",
    heroDescription:
      "Ready to build your brand identity? Let's start a conversation.",
    heroBackgroundImage: { url: "/mainlogo.png", mediaId: null },
    formTitle: "Send us a message.",
    formDescription:
      "Tell us about your project and we'll get back to you within 24 hours.",
    email: "hello@bloombranding.com",
    socialLinks: {
      instagram: "https://www.instagram.com/bloom.branding_/",
    },
    address: {
      line1: "Bloom Branding, Solarium",
      line2: "Business Centre, 515,",
      line3: "beside Times Corner, Surat,",
      line4: "Gujarat 395007",
    },
  };

  // Safely get background image URL - handle both object and string formats
  const backgroundImageUrl = data?.heroBackgroundImage
    ? typeof data.heroBackgroundImage === "string"
      ? data.heroBackgroundImage
      : data.heroBackgroundImage?.url || "/mainlogo.png"
    : "/mainlogo.png";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.company) formData.append("company", data.company);
      formData.append("message", data.message);

      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus("success");
        reset();
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result.message || "Something went wrong. Please try again."
        );
      }
    });
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-[75vh] overflow-hidden flex items-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt="Bloom Branding background"
            fill
            className="object-cover object-center"
            priority
            unoptimized={backgroundImageUrl?.startsWith("http") || false}
          />
        </div>

        {/* Overlay for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60" />

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} />
          </div>
          {/* Gradient Orbs for Depth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content - Removed text content, keeping only background image */}
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT COLUMN: FAQs + Contact Info */}
            <div className="flex flex-col gap-16">
              {/* FAQs */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 mb-4 font-semibold">
                    FAQ
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-8 leading-tight font-light">
                    Frequently Asked Questions
                  </h2>
                </motion.div>
                <FAQ items={(data.faqs && data.faqs.length > 0) ? data.faqs : defaultFaqs} />
              </div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 mb-6 font-semibold">
                  Get in Touch
                </p>
                <div className="space-y-6">
                  {data.email && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                          Email
                        </p>
                      </div>
                      <a
                        href={`mailto:${data.email}`}
                        className="font-sans text-lg text-slate-900 hover:text-blue-600 transition-colors duration-200 inline-block"
                      >
                        {data.email}
                      </a>
                    </div>
                  )}
                  {data.socialLinks?.instagram && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <Instagram className="w-4 h-4 text-slate-400" />
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                          Instagram
                        </p>
                      </div>
                      <Link
                        href={data.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-sans text-lg text-slate-900 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span>
                          {data.socialLinks.instagram.includes("instagram.com/")
                            ? "@" +
                              data.socialLinks.instagram
                                .split("instagram.com/")[1]
                                ?.replace("/", "")
                            : "@bloom.branding_"}
                        </span>
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </Link>
                    </div>
                  )}
                  {data.address && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                          Address
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Address Text - Left Side */}
                        <address className="font-sans text-lg text-slate-900 not-italic leading-relaxed">
                          {data.address.line1 && <p>{data.address.line1}</p>}
                          {data.address.line2 && <p>{data.address.line2}</p>}
                          {data.address.line3 && <p>{data.address.line3}</p>}
                          {data.address.line4 && <p>{data.address.line4}</p>}
                        </address>
                        
                        {/* Map - Right Side */}
                        <div className="w-full h-48 md:h-full min-h-[200px] rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                          <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                              `${data.address.line1 || ''}, ${data.address.line2 || ''}, ${data.address.line3 || ''}, ${data.address.line4 || ''}`
                            )}&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Form Title/Desc + Form */}
            <div>
              {/* Form Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10"
              >
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 mb-4 font-semibold">
                  {siteSettings?.contactLabels?.formLabel || "Contact"}
                </p>

                <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-6 leading-tight font-light">
                  {siteSettings?.contactLabels?.formTitle ||
                    data.formTitle ||
                    "Send us a message."}
                </h2>

                <p className="font-sans text-lg text-slate-600 leading-relaxed">
                  {siteSettings?.contactLabels?.formDescription ||
                    data.formDescription ||
                    "Tell us about your project and we'll get back to you within 24 hours."}
                </p>
              </motion.div>

              {/* Premium Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/50"
              >
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-emerald-900 mb-1">
                          Message sent successfully!
                        </p>
                        <p className="font-sans text-sm text-emerald-700">
                          Thank you! We&apos;ll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-red-900 mb-1">
                          Error sending message
                        </p>
                        <p className="font-sans text-sm text-red-700">
                          {errorMessage ||
                            "Something went wrong. Please try again."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-sans text-sm font-semibold text-slate-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-lg outline-none transition-all duration-200 font-sans text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 font-sans text-sm text-red-600 flex items-center gap-1.5"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-sans text-sm font-semibold text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-lg outline-none transition-all duration-200 font-sans text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 font-sans text-sm text-red-600 flex items-center gap-1.5"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block font-sans text-sm font-semibold text-slate-700 mb-2"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      {...register("company")}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-200 font-sans text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Your company (optional)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block font-sans text-sm font-semibold text-slate-700 mb-2"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-lg outline-none transition-all duration-200 font-sans text-base text-slate-900 placeholder:text-slate-400 resize-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.message
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200"
                      }`}
                      placeholder="Tell us about your project..."
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 font-sans text-sm text-red-600 flex items-center gap-1.5"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.message.message}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={!isPending ? { scale: 1.01, y: -2 } : {}}
                    whileTap={!isPending ? { scale: 0.99 } : {}}
                    className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-sans font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isPending ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Start the Conversation
                          <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </motion.svg>
                        </>
                      )}
                    </span>
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
