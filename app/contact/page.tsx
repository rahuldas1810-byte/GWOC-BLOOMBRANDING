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
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            initial={false}
            className="border border-dark-choc/10 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200 overflow-hidden"
          >
            <motion.button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-start justify-between gap-4 text-left group p-4 md:p-5"
              aria-expanded={isOpen}
              whileHover={{ backgroundColor: "rgba(46, 74, 167, 0.02)" }}
              whileTap={{ scale: 0.998 }}
            >
              <h3 className="font-sans text-base md:text-lg text-near-black pr-8 group-hover:text-dark-choc transition-colors duration-200 font-medium flex-1">
                {item.question}
              </h3>
              <motion.span
                className="flex-shrink-0 font-mono text-2xl text-dark-choc/50 group-hover:text-electric-blue transition-colors duration-200 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full bg-dark-choc/5 group-hover:bg-electric-blue/10"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.span>
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
              <div className="px-4 md:px-5 pb-4 md:pb-5">
                <p className="font-sans text-sm md:text-base text-near-black/70 leading-relaxed pt-2">
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
    <div className="">
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-center bg-earl-gray">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt="Bloom Branding background"
            fill
            className="object-cover object-center opacity-100"
            priority
            unoptimized={backgroundImageUrl?.startsWith("http") || false}
          />
        </div>

        {/* Single soft overlay (NOT too strong) */}
        <div className="absolute inset-0 z-10 bg-earl-gray/70" />

        {/* Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-0 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* empty space to push text right */}
            <div className="hidden lg:block lg:col-span-8" />

            {/* text column */}
            <div className="lg:col-span-4">
              <SectionReveal>
                <div className="max-w-xl ml-auto">
                  <p className="label-text mb-6">{data.heroLabel}</p>

                  <h1 className="heading-1 mb-8 whitespace-nowrap">
                    {data.heroTitle}
                  </h1>

                  <p className="body-text">{data.heroDescription}</p>

                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/50 mt-8">
                    {siteSettings?.contactLabels?.heroSubtitle ||
                      "Projects • Collaborations • Brand Enquiries"}
                  </p>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
<<<<<<< HEAD
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT COLUMN: FAQs + Contact Info */}
            <div className="flex flex-col gap-12">
              {/* FAQs */}
              <div>
                <p className="label-text mb-5">FAQ</p>
                <h2 className="heading-2 mb-6">Frequently Asked Questions</h2>
                <FAQ items={(data.faqs && data.faqs.length > 0) ? data.faqs : defaultFaqs} />
=======
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
            {/* LEFT COLUMN */}
            <div className="space-y-12">
              {/* FAQs */}
              <div>
                <p className="label-text mb-4 text-dark-choc/60">FAQ</p>
                <h2 className="heading-2 mb-8">Frequently Asked Questions</h2>
                {data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0 ? (
                  <FAQ items={data.faqs} />
                ) : (
                  <FAQ items={faqData} />
                )}
              </div>

              {/* Send us a message */}
              <div className="pt-8 border-t border-dark-choc/10">
                <p className="label-text mb-4 text-dark-choc/60">
                  {siteSettings?.contactLabels?.formLabel || "Contact"}
                </p>

                <h2 className="heading-2 mb-6">
                  {siteSettings?.contactLabels?.formTitle ||
                    data.formTitle ||
                    "Send us a message."}
                </h2>

                <p className="body-text text-near-black/80 leading-relaxed">
                  {siteSettings?.contactLabels?.formDescription ||
                    data.formDescription ||
                    "Tell us about your project and we'll get back to you within 24 hours."}
                </p>
>>>>>>> 89c84e874b065174e9c2e019f3f598317560d459
              </div>

<<<<<<< HEAD
              {/* Contact Info (Moved here from Right Column) */}
              <div className="w-full max-w-md">
                <div className="space-y-4">
=======
            {/* RIGHT COLUMN */}
            <div className="flex items-start justify-end">
              <div className="w-full max-w-lg">
                {/* Contact Info */}
                <div className="mb-8 space-y-6 p-6 rounded-xl bg-earl-gray/30 border border-dark-choc/5">
>>>>>>> 89c84e874b065174e9c2e019f3f598317560d459
                  {data.email && (
                    <motion.a
                      href={`mailto:${data.email}`}
                      className="group flex items-start gap-4"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/20 transition-colors">
                        <Mail
                          size={18}
                          strokeWidth={1.5}
                          className="text-electric-blue"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-1">
                          Email
                        </p>
                        <p className="font-sans text-base text-near-black break-all group-hover:text-electric-blue transition-colors">
                          {data.email}
                        </p>
                      </div>
                    </motion.a>
                  )}
<<<<<<< HEAD
=======
                  {data.phone && (
                    <motion.a
                      href={`tel:${data.phone}`}
                      className="group flex items-start gap-4"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/20 transition-colors">
                        <Phone
                          size={18}
                          strokeWidth={1.5}
                          className="text-electric-blue"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-1">
                          Phone
                        </p>
                        <p className="font-sans text-base text-near-black group-hover:text-electric-blue transition-colors">
                          {data.phone}
                        </p>
                      </div>
                    </motion.a>
                  )}
>>>>>>> 89c84e874b065174e9c2e019f3f598317560d459
                  {data.address && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                        <MapPin
                          size={18}
                          strokeWidth={1.5}
                          className="text-electric-blue"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-2">
                          Address
                        </p>
                        <address className="font-sans text-base text-near-black not-italic leading-relaxed space-y-1">
                          {data.address.line1 && <p>{data.address.line1}</p>}
                          {data.address.line2 && <p>{data.address.line2}</p>}
                          {data.address.line3 && <p>{data.address.line3}</p>}
                          {data.address.line4 && <p>{data.address.line4}</p>}
                        </address>
                      </div>
                    </div>
                  )}
                  {(data.socialLinks?.instagram || data.socialLinks?.linkedin || data.socialLinks?.facebook) && (
                    <div className="flex items-start gap-4 pt-2">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-electric-blue/20"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                          Follow Us
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                          {data.socialLinks?.instagram && (
                            <Link
                              href={data.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                <Instagram
                                  size={16}
                                  strokeWidth={1.5}
                                  className="text-dark-choc group-hover:text-electric-blue transition-colors"
                                />
                              </div>
                              <span className="font-sans text-sm text-near-black/70 group-hover:text-near-black transition-colors hidden sm:inline">
                                Instagram
                              </span>
                            </Link>
                          )}
                          {data.socialLinks?.linkedin && (
                            <Link
                              href={data.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                <Linkedin
                                  size={16}
                                  strokeWidth={1.5}
                                  className="text-dark-choc group-hover:text-electric-blue transition-colors"
                                />
                              </div>
                              <span className="font-sans text-sm text-near-black/70 group-hover:text-near-black transition-colors hidden sm:inline">
                                LinkedIn
                              </span>
                            </Link>
                          )}
                          {data.socialLinks?.facebook && (
                            <Link
                              href={data.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                <Facebook
                                  size={16}
                                  strokeWidth={1.5}
                                  className="text-dark-choc group-hover:text-electric-blue transition-colors"
                                />
                              </div>
                              <span className="font-sans text-sm text-near-black/70 group-hover:text-near-black transition-colors hidden sm:inline">
                                Facebook
                              </span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

<<<<<<< HEAD
            {/* RIGHT COLUMN: Form Title/Desc + Form */}
            <div>
              {/* Send us a message (Moved here from Left Column) */}
              <div className="mb-8">
                <p className="label-text mb-5">
                  {siteSettings?.contactLabels?.formLabel || "Contact"}
                </p>

                <h2 className="heading-2 mb-6 whitespace-nowrap">
                  {siteSettings?.contactLabels?.formTitle ||
                    data.formTitle ||
                    "Send us a message."}
                </h2>

                <p className="body-text mb-6">
                  {siteSettings?.contactLabels?.formDescription ||
                    data.formDescription ||
                    "Tell us about your project and we'll get back to you within 24 hours."}
                </p>
              </div>

              {/* Yellow Form */}
              <div className="relative bg-earl-gray p-5 md:p-6 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.12)]">
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-sans font-semibold text-green-800 mb-1">
                          Message sent successfully!
                        </p>
                        <p className="font-sans text-sm text-green-700">
                          Thank you! We&apos;ll get back to you within 24
                          hours.
                        </p>
=======
                {/* Form Container */}
                <div className="relative bg-earl-gray p-6 md:p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-sans font-semibold text-green-800 mb-1">
                            Message sent successfully!
                          </p>
                          <p className="font-sans text-sm text-green-700">
                            Thank you! We&apos;ll get back to you within 24
                            hours.
                          </p>
                        </div>
>>>>>>> 89c84e874b065174e9c2e019f3f598317560d459
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
                    className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
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
                      <div>
                        <p className="font-sans font-semibold text-red-800 mb-1">
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block label-text mb-3">
                      Name <span className="text-electric-blue">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`w-full px-0 py-4 bg-transparent border-0 border-b outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30 ${
                        errors.name
                          ? "border-red-400 focus:border-red-500"
                          : "border-dark-choc/20 focus:border-electric-blue"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 font-sans text-sm text-red-600 flex items-center gap-2"
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

<<<<<<< HEAD
                  <div>
                    <label htmlFor="email" className="block label-text mb-3">
                      Email <span className="text-electric-blue">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full px-0 py-4 bg-transparent border-0 border-b outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-dark-choc/20 focus:border-electric-blue"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 font-sans text-sm text-red-600 flex items-center gap-2"
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
                      className="block label-text mb-3"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      {...register("company")}
                      className="w-full px-0 py-4 bg-transparent border-0 border-b border-dark-choc/20 focus:border-electric-blue outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30"
                      placeholder="Your company (optional)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block label-text mb-3"
                    >
                      Message <span className="text-electric-blue">*</span>
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={4}
                      className={`w-full px-0 py-4 bg-transparent border-0 border-b outline-none transition-all duration-300 focus:pl-1 font-sans text-lg text-near-black placeholder:text-near-black/30 resize-none ${
                        errors.message
                          ? "border-red-400 focus:border-red-500"
                          : "border-dark-choc/20 focus:border-electric-blue"
                      }`}
                      placeholder="Tell us about your project..."
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 font-sans text-sm text-red-600 flex items-center gap-2"
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
                    whileHover={!isPending ? { scale: 1.02 } : {}}
                    whileTap={!isPending ? { scale: 0.98 } : {}}
                    className="btn-primary w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isPending ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
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
                            className="w-4 h-4"
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
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </motion.svg>
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
=======
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block label-text mb-3 text-dark-choc/80">
                        Name <span className="text-electric-blue">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register("name")}
                        className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 outline-none transition-all duration-300 focus:pl-2 font-sans text-base md:text-lg text-near-black placeholder:text-near-black/30 ${
                          errors.name
                            ? "border-red-400 focus:border-red-500"
                            : "border-dark-choc/20 focus:border-electric-blue"
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 font-sans text-sm text-red-600 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
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
                      <label htmlFor="email" className="block label-text mb-3 text-dark-choc/80">
                        Email <span className="text-electric-blue">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 outline-none transition-all duration-300 focus:pl-2 font-sans text-base md:text-lg text-near-black placeholder:text-near-black/30 ${
                          errors.email
                            ? "border-red-400 focus:border-red-500"
                            : "border-dark-choc/20 focus:border-electric-blue"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 font-sans text-sm text-red-600 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
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
                        className="block label-text mb-3 text-dark-choc/80"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        {...register("company")}
                        className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-dark-choc/20 focus:border-electric-blue outline-none transition-all duration-300 focus:pl-2 font-sans text-base md:text-lg text-near-black placeholder:text-near-black/30"
                        placeholder="Your company (optional)"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block label-text mb-3 text-dark-choc/80"
                      >
                        Message <span className="text-electric-blue">*</span>
                      </label>
                      <textarea
                        id="message"
                        {...register("message")}
                        rows={5}
                        className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 outline-none transition-all duration-300 focus:pl-2 font-sans text-base md:text-lg text-near-black placeholder:text-near-black/30 resize-none ${
                          errors.message
                            ? "border-red-400 focus:border-red-500"
                            : "border-dark-choc/20 focus:border-electric-blue"
                        }`}
                        placeholder="Tell us about your project..."
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 font-sans text-sm text-red-600 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
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
                      className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group py-4 md:py-5 text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
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
                              animate={{ x: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 17,
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </motion.svg>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </form>
                </div>
>>>>>>> 89c84e874b065174e9c2e019f3f598317560d459
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
