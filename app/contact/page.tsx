"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Facebook } from "lucide-react";

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
          <div
            key={index}
            className="border-b border-dark-choc/10 pb-4 last:border-b-0 last:pb-0"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-start justify-between gap-4 text-left group"
              aria-expanded={isOpen}
            >
              <h3 className="font-sans text-base md:text-lg text-near-black pr-8 group-hover:text-dark-choc transition-colors duration-150">
                {item.question}
              </h3>
              <span className="flex-shrink-0 font-mono text-xl text-dark-choc/60 group-hover:text-dark-choc transition-all duration-150 mt-0.5">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-150 ease-in-out ${
                isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              <p className="font-sans text-sm md:text-base text-near-black/70 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
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

const faqData: FAQItem[] = [
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
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT COLUMN */}
            <div>
              {/* FAQs */}
              <p className="label-text mb-5">FAQ</p>
              <h2 className="heading-2 mb-6">Frequently Asked Questions</h2>
              <FAQ items={faqData} />

              {/* Send us a message */}
              <div className="mt-12">
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
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex items-start justify-end">
              <div className="w-full max-w-md">
                {/* Contact Info */}
                <div className="mb-6 space-y-4">
                  {data.email && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                        Email
                      </p>
                      <p className="font-sans text-lg text-near-black">
                        {data.email}
                      </p>
                    </div>
                  )}
                  {data.socialLinks?.instagram && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                        Instagram
                      </p>
                      <Link
                        href={data.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 font-sans text-lg text-near-black"
                      >
                        <Instagram
                          size={18}
                          strokeWidth={1.5}
                          className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <span className="relative">
                          {data.socialLinks.instagram.includes("instagram.com/")
                            ? "@" +
                              data.socialLinks.instagram
                                .split("instagram.com/")[1]
                                ?.replace("/", "")
                            : "@bloom.branding_"}
                          <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-near-black transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </div>
                  )}
                  {data.socialLinks?.linkedin && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                        LinkedIn
                      </p>
                      <Link
                        href={data.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 font-sans text-lg text-near-black"
                      >
                        <Linkedin
                          size={18}
                          strokeWidth={1.5}
                          className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <span className="relative">
                          {data.socialLinks.linkedin.includes("linkedin.com/")
                            ? data.socialLinks.linkedin
                                .split("linkedin.com/")[1]
                                ?.replace("/", "")
                            : data.socialLinks.linkedin}
                          <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-near-black transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </div>
                  )}
                  {data.socialLinks?.facebook && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                        Facebook
                      </p>
                      <Link
                        href={data.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 font-sans text-lg text-near-black"
                      >
                        <Facebook
                          size={18}
                          strokeWidth={1.5}
                          className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <span className="relative">
                          {data.socialLinks.facebook.includes("facebook.com/")
                            ? data.socialLinks.facebook
                                .split("facebook.com/")[1]
                                ?.replace("/", "")
                            : data.socialLinks.facebook}
                          <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-near-black transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </div>
                  )}
                  {data.address && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-dark-choc/60 mb-3">
                        Address
                      </p>
                      <address className="font-sans text-lg text-near-black not-italic">
                        {data.address.line1 && <p>{data.address.line1}</p>}
                        {data.address.line2 && <p>{data.address.line2}</p>}
                        {data.address.line3 && <p>{data.address.line3}</p>}
                        {data.address.line4 && <p>{data.address.line4}</p>}
                      </address>
                    </div>
                  )}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
