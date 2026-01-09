"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Facebook, Mail, MapPin } from "lucide-react";

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
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            initial={false}
            className={`border rounded-xl transition-all duration-300 overflow-hidden group ${isOpen ? "bg-white border-electric-blue/20 shadow-lg" : "bg-white/50 border-dark-choc/10 hover:border-dark-choc/30"}`}
          >
            <motion.button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-start justify-between gap-4 text-left p-6"
              aria-expanded={isOpen}
            >
              <h3 className={`font-serif text-lg md:text-xl pr-8 transition-colors duration-200 leading-snug ${isOpen ? "text-electric-blue" : "text-dark-choc group-hover:text-electric-blue"}`}>
                {item.question}
              </h3>
              <motion.div
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${isOpen ? "bg-electric-blue text-white" : "bg-dark-choc/5 text-dark-choc group-hover:bg-electric-blue/10 group-hover:text-electric-blue"}`}
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
            </motion.button>
            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0">
                <p className="body-text text-dark-choc/70">
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
      formData.append("company", data.company || "");
      formData.append("message", data.message);

      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-earl-gray scroll-smooth">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src={backgroundImageUrl}
            alt="Bloom Branding background"
            fill
            className="object-cover object-center"
            priority
            unoptimized={backgroundImageUrl?.startsWith("http") || false}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-dark-choc/40 backdrop-blur-[2px]" />

        {/* Content - Removed text content, keeping only background image */}

      </section>

      {/* Main Content */}
      <section className="section-padding relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* LEFT COLUMN: FAQ & Contact Info */}
            <div className="flex flex-col gap-20">

              {/* FAQ Section */}
              <SectionReveal>
                <div>
                  <div className="mb-10">
                    <p className="label-text mb-4">FAQ</p>
                    <h2 className="heading-2 mb-6">Frequently Asked Questions</h2>
                  </div>
                  <FAQ items={(data.faqs && data.faqs.length > 0) ? data.faqs : defaultFaqs} />
                </div>
              </SectionReveal>

              {/* Contact Details */}
              <SectionReveal delay={0.2}>
                <div className="flex flex-col gap-12 pt-10 border-t border-dark-choc/10">
                  {/* Email */}
                  <div>
                    <h3 className="label-text mb-4">DIRECT CONTACT</h3>
                    <a
                      href={`mailto:${siteSettings?.contactEmail || data.email}`}
                      className="font-serif text-2xl md:text-3xl text-dark-choc hover:text-electric-blue transition-colors duration-300 relative group inline-block"
                    >
                      {siteSettings?.contactEmail || data.email}
                      <span className="absolute left-0 bottom-1 w-0 h-[1px] bg-electric-blue transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </div>

                  {/* Socials */}
                  <div>
                    <h3 className="label-text mb-6">SOCIAL</h3>
                    <div className="flex gap-6">
                      {(siteSettings?.socialMedia?.instagram || data.socialLinks?.instagram) && (
                        <Link
                          href={siteSettings?.socialMedia?.instagram || data.socialLinks?.instagram}
                          target="_blank"
                          className="w-12 h-12 rounded-full border border-dark-choc/20 flex items-center justify-center text-dark-choc hover:bg-dark-choc hover:text-white transition-all duration-300"
                        >
                          <Instagram className="w-5 h-5" />
                        </Link>
                      )}
                      {(siteSettings?.socialMedia?.linkedin || data.socialLinks?.linkedin) && (
                        <Link
                          href={siteSettings?.socialMedia?.linkedin || data.socialLinks?.linkedin}
                          target="_blank"
                          className="w-12 h-12 rounded-full border border-dark-choc/20 flex items-center justify-center text-dark-choc hover:bg-dark-choc hover:text-white transition-all duration-300"
                        >
                          <Linkedin className="w-5 h-5" />
                        </Link>
                      )}
                      {(siteSettings?.socialMedia?.facebook || data.socialLinks?.facebook) && (
                        <Link
                          href={siteSettings?.socialMedia?.facebook || data.socialLinks?.facebook}
                          target="_blank"
                          className="w-12 h-12 rounded-full border border-dark-choc/20 flex items-center justify-center text-dark-choc hover:bg-dark-choc hover:text-white transition-all duration-300"
                        >
                          <Facebook className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="label-text mb-4">VISIT US</h3>
                    <div className="flex gap-4 items-start">
                      <MapPin className="w-6 h-6 text-electric-blue flex-shrink-0 mt-1" />
                      <address className="body-text not-italic text-lg">
                        {siteSettings?.address ? (
                          <>
                            {siteSettings.address.line1}<br />
                            {siteSettings.address.line2 && <>{siteSettings.address.line2}<br /></>}
                            {siteSettings.address.city}, {siteSettings.address.state} {siteSettings.address.zip}<br />
                            {siteSettings.address.country}
                          </>
                        ) : (
                          <>
                            {data.address.line1}<br />
                            {data.address.line2}<br />
                            {data.address.line3}<br />
                            {data.address.line4}
                          </>
                        )}
                      </address>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* RIGHT COLUMN: Contact Form */}
            <SectionReveal delay={0.1}>
              <div className="sticky top-32">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-dark-choc/5 border border-dark-choc/5 relative overflow-hidden">
                  {/* Decor element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

                  <h2 className="heading-3 mb-4">{data.formTitle}</h2>
                  <p className="body-text mb-10 text-dark-choc/70">
                    {data.formDescription}
                  </p>

                  {submitStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-100"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-2xl mb-2">Message Sent!</h3>
                      <p className="text-green-700">
                        Thank you for reaching out. We'll get back to you shortly.
                      </p>
                      <button
                        onClick={() => setSubmitStatus("idle")}
                        className="mt-6 text-sm font-bold uppercase tracking-widest text-green-700 border-b border-green-300 hover:text-green-900 transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-semibold text-dark-choc/70">Name</label>
                          <input
                            type="text"
                            id="name"
                            {...register("name")}
                            className="w-full px-4 py-4 bg-earl-gray/30 border border-dark-choc/10 rounded-lg outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/20 transition-all text-dark-choc placeholder:text-dark-choc/30"
                            placeholder="Enter Your Name"
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-semibold text-dark-choc/70">Email</label>
                          <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="w-full px-4 py-4 bg-earl-gray/30 border border-dark-choc/10 rounded-lg outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/20 transition-all text-dark-choc placeholder:text-dark-choc/30"
                            placeholder="name@company.com"
                          />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="company" className="text-sm font-semibold text-dark-choc/70">Company <span className="font-normal text-dark-choc/40">(Optional)</span></label>
                          <input
                            type="text"
                            id="company"
                            {...register("company")}
                            className="w-full px-4 py-4 bg-earl-gray/30 border border-dark-choc/10 rounded-lg outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/20 transition-all text-dark-choc placeholder:text-dark-choc/30"
                            placeholder="Your Company Ltd."
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-semibold text-dark-choc/70">Message</label>
                          <textarea
                            id="message"
                            {...register("message")}
                            rows={4}
                            className="w-full px-4 py-4 bg-earl-gray/30 border border-dark-choc/10 rounded-lg outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/20 transition-all text-dark-choc placeholder:text-dark-choc/30 resize-none"
                            placeholder="Tell us about your project..."
                          />
                          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-center gap-3">
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary w-full justify-center py-4 text-base"
                      >
                        {isPending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
