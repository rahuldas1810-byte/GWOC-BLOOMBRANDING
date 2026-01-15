"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import ExperienceSection from "@/components/ExperienceSection";
import { getTestimonials, getClients, getHomepageContent, getServices, getSiteSettings } from "@/lib/content";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import SkewedClients from "@/components/homepage/SkewedClients";
import type { Testimonial, Client } from "@/types";
import TextMarquee from "@/components/TextMarquee";

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=2070&auto=format&fit=crop", // Brand Identity
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", // Visual Design
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop", // Social Media
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", // Content Strategy
  "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2070&auto=format&fit=crop", // Creative Direction
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", // Marketing
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [homepageContent, setHomepageContent] = useState({
    heroHeadline: 'We craft brand identities that resonate.',
    heroSubheading: 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
    aboutPreview: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
    tagline: 'Helping Brands Bloom',
    heroVideo: null as string | null,
    backgroundVideo: null as string | null,
    sectionVideo: null as string | null,
    clientsLabel: 'Our Clients',
    clientsTitle: 'Trusted By',
    testimonialsLabel: 'Testimonials',
    testimonialsHeading: 'What Clients Say',
    sections: {
      hero: { enabled: true, order: 1 },
      services: { enabled: true, order: 3 },
      clients: { enabled: true, order: 4 },
      about: { enabled: true, order: 2 },
      testimonials: { enabled: true, order: 5 }
    },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bloom+Branding+Studio+Surat+Gujarat',
  });
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundVideoReady, setBackgroundVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const lastPlayedVideoRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsData, clientsData, homepageData, servicesData, siteSettings] = await Promise.all([
          getTestimonials(),
          getClients(),
          getHomepageContent(),
          getServices(),
          getSiteSettings(),
        ]);

        setClients(clientsData || []);

        // Transform services for homepage (only title and description)
        if (servicesData && servicesData.length > 0) {
          const homepageServices = servicesData.slice(0, 6).map((service: any) => ({
            title: service.title,
            description: service.description,
          }));
          setServices(homepageServices);
        } else {
          // Fallback services
          setServices([
            { title: "Brand Identity", description: "Complete visual identity systems that define who you are." },
            { title: "Visual Design", description: "Stunning design that communicates your brand story." },
            { title: "Social Media Branding", description: "Cohesive brand presence across all social platforms." },
            { title: "Content Strategy", description: "Strategic messaging that resonates with your audience." },
            { title: "Creative Direction", description: "End-to-end creative vision for your brand." },
            { title: "Marketing Campaigns", description: "Data-driven campaigns designed to amplify reach and impact." },
          ]);
        }

        // Use API data for homepage content - always update from API
        if (homepageData) {
          const heroVideoUrl = typeof homepageData.heroVideo === 'string' ? homepageData.heroVideo : (homepageData.heroVideo?.url || null);
          setHomepageContent({
            heroHeadline: homepageData.heroHeadline || 'We craft brand identities that resonate.',
            heroSubheading: homepageData.heroSubheading || 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
            aboutPreview: homepageData.aboutPreview || 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
            tagline: homepageData.tagline || 'Helping Brands Bloom',
            heroVideo: heroVideoUrl,
            backgroundVideo: typeof homepageData.backgroundVideo === 'string' ? homepageData.backgroundVideo : (homepageData.backgroundVideo?.url || null),
            sectionVideo: typeof homepageData.sectionVideo === 'string' ? homepageData.sectionVideo : (homepageData.sectionVideo?.url || null),
            clientsLabel: siteSettings?.homepageSections?.clientsLabel || 'Our Clients',
            clientsTitle: siteSettings?.homepageSections?.clientsTitle || 'Trusted By',
            testimonialsLabel: homepageData.testimonialsLabel !== undefined && homepageData.testimonialsLabel !== null ? homepageData.testimonialsLabel : 'Testimonials',
            testimonialsHeading: homepageData.testimonialsHeading !== undefined && homepageData.testimonialsHeading !== null ? homepageData.testimonialsHeading : 'What Clients Say',
            sections: homepageData.sections || {
              hero: { enabled: true, order: 1 },
              services: { enabled: true, order: 3 },
              clients: { enabled: true, order: 4 },
              about: { enabled: true, order: 2 },
              testimonials: { enabled: true, order: 5 }
            },
            googleMapsUrl: siteSettings?.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Bloom+Branding+Studio+Surat+Gujarat',
          });

          // Filter testimonials based on homepage selection
          if (homepageData.homepageTestimonialIds && Array.isArray(homepageData.homepageTestimonialIds) && homepageData.homepageTestimonialIds.length > 0) {
            // Show only selected testimonials
            const selectedTestimonials = testimonialsData.filter((t: any) =>
              homepageData.homepageTestimonialIds?.includes(t._id || t.id)
            );
            setTestimonials(selectedTestimonials);
          } else {
            // If no selection, show all active testimonials (backward compatible)
            setTestimonials(testimonialsData);
          }

          // Mark content as loaded
          setContentLoaded(true);
          // If no hero video, show content immediately
          if (!heroVideoUrl) {
            setVideoEnded(true);
            setIsInitialLoad(false);
            setHeroVideoReady(true); // Mark as ready since there's no video
          } else {
            // If hero video exists, but it's the one we just played, don't reset
            if (heroVideoUrl === lastPlayedVideoRef.current) {
              // keep current state (which should be ended)
            } else {
              // If it's a new video, or first load, keep content hidden
              // setVideoEnded(false); // DO NOT reset here, let the effect handle it
              // setIsInitialLoad(true);
              setHeroVideoReady(false); // Will be set to true when video loads
            }
          }
        } else {
          // If no data, mark as loaded but keep content hidden
          setContentLoaded(true);
          setVideoEnded(false);
          setIsInitialLoad(true);
          setHeroVideoReady(false);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };
    fetchData();

    // Refresh data every 30 seconds to catch admin updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle video sequencing - reset when videos change
  useEffect(() => {
    // Only process if content has been loaded
    if (!contentLoaded) return;

    // If there's no hero video but there's a background video, show background immediately
    if (!homepageContent.heroVideo && homepageContent.backgroundVideo) {
      setVideoEnded(true);
      setHeroVideoReady(true);
      setIsInitialLoad(false);
      setIsTransitioning(false);
      return;
    }

    // If there's no hero video at all, show content immediately
    if (!homepageContent.heroVideo) {
      setVideoEnded(true);
      setHeroVideoReady(true);
      setIsInitialLoad(false);
      setIsTransitioning(false);
      return;
    }

    // Checking if we already played this video
    if (homepageContent.heroVideo === lastPlayedVideoRef.current) {
      return;
    }

    // Reset states when hero video changes - hero video should play first
    // Always start with hero video playing, background video hidden
    setVideoEnded(false);
    setIsInitialLoad(true);
    setIsTransitioning(false);
    setHeroVideoReady(false); // Reset to false so black background shows while loading

    // Ensure background video is paused and reset when hero video is present
    if (backgroundVideoRef.current && homepageContent.heroVideo) {
      backgroundVideoRef.current.pause();
      backgroundVideoRef.current.currentTime = 0;
    }
  }, [homepageContent.heroVideo, homepageContent.backgroundVideo, contentLoaded]);

  // Handle hero video events and ensure it plays
  useEffect(() => {
    if (!homepageContent.heroVideo) return;
    
    // If we've already played this video, don't set up listeners to restart it
    if (homepageContent.heroVideo === lastPlayedVideoRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoaded = () => {
      setHeroVideoReady(true);
      // Ensure video plays when loaded
      video.play().catch((error) => {
        console.error('Error playing hero video:', error);
      });
    };

    const handleVideoCanPlay = () => {
      setHeroVideoReady(true);
      // Ensure video plays when it can play
      video.play().catch((error) => {
        console.error('Error playing hero video:', error);
      });
    };

    const handleVideoEnd = () => {
      // Mark this video as played so we don't play it again
      lastPlayedVideoRef.current = homepageContent.heroVideo;
      
      // Start smooth transition
      setIsTransitioning(true);
      // Small delay to ensure background video is ready, then complete transition
      setTimeout(() => {
        setVideoEnded(true);
        setIsInitialLoad(false);
        setIsTransitioning(false);
      }, 200);
    };

    const handleVideoError = () => {
      // If video fails to load, show content after a short delay
      setHeroVideoReady(true);
      setTimeout(() => {
        setVideoEnded(true);
        setIsInitialLoad(false);
      }, 500);
    };

    video.addEventListener("loadeddata", handleVideoLoaded);
    video.addEventListener("canplay", handleVideoCanPlay);
    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("error", handleVideoError);

    // Immediately try to play the video
    const attemptPlay = () => {
      if (video.paused) {
        video.play().catch((error) => {
          // Video might not be ready yet, that's okay
          console.log('Video play attempt:', error.message);
        });
      }
    };

    // Check if video is already loaded and play it immediately
    if (video.readyState >= 2) {
      setHeroVideoReady(true);
      attemptPlay();
    } else if (video.readyState >= 1) {
      // Video has metadata, try to play
      attemptPlay();
    } else {
      // Try to load and play
      video.load();
    }

    // Multiple play attempts to ensure video starts
    const forcePlayTimeout1 = setTimeout(() => {
      attemptPlay();
    }, 50);

    const forcePlayTimeout2 = setTimeout(() => {
      if (video.paused && video.readyState >= 1) {
        attemptPlay();
      }
    }, 200);

    const forcePlayTimeout3 = setTimeout(() => {
      if (video.paused) {
        attemptPlay();
      }
    }, 500);

    return () => {
      clearTimeout(forcePlayTimeout1);
      clearTimeout(forcePlayTimeout2);
      clearTimeout(forcePlayTimeout3);
      video.removeEventListener("loadeddata", handleVideoLoaded);
      video.removeEventListener("canplay", handleVideoCanPlay);
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("error", handleVideoError);
    };
  }, [homepageContent.heroVideo]);

  // Preload and prepare background video while hero video is playing
  useEffect(() => {
    const bgVideo = backgroundVideoRef.current;
    if (!bgVideo || !homepageContent.backgroundVideo) return;

    if (homepageContent.heroVideo && !videoEnded) {
      // Preload background video while hero is playing for smooth transition
      bgVideo.preload = "auto";
      bgVideo.load();

      // Prepare video to be ready when needed
      const handleCanPlay = () => {
        setBackgroundVideoReady(true);
        // Keep it paused but ready
        if (!bgVideo.paused) {
          bgVideo.pause();
        }
      };

      bgVideo.addEventListener("canplay", handleCanPlay, { once: true });

      return () => {
        bgVideo.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [homepageContent.heroVideo, homepageContent.backgroundVideo, videoEnded]);

  // Handle background video playback - start smoothly when hero ends
  useEffect(() => {
    const bgVideo = backgroundVideoRef.current;
    if (!bgVideo || !homepageContent.backgroundVideo) return;

    if (videoEnded || !homepageContent.heroVideo) {
      // Start background video smoothly
      const startBackgroundVideo = () => {
        if (bgVideo.readyState >= 2) {
          // Video is ready, play it
          bgVideo.play().catch((error) => {
            console.error('Error playing background video:', error);
          });
        } else {
          // Wait for video to be ready
          const handleReady = () => {
            bgVideo.play().catch(console.error);
          };
          bgVideo.addEventListener("canplay", handleReady, { once: true });
          bgVideo.load();
        }
      };

      // Start slightly before hero ends for seamless transition, or immediately if no hero
      if (isTransitioning || !homepageContent.heroVideo) {
        startBackgroundVideo();
      } else {
        const playTimeout = setTimeout(startBackgroundVideo, 100);
        return () => clearTimeout(playTimeout);
      }
    } else {
      // Reset background video if hero video is playing
      if (!bgVideo.paused) {
        bgVideo.pause();
      }
      bgVideo.currentTime = 0;
    }
  }, [videoEnded, homepageContent.heroVideo, homepageContent.backgroundVideo, isTransitioning]);

  return (
    <div className="min-h-screen relative">
      {/* ================= HERO SECTION ================= */}
      {homepageContent.sections.hero.enabled && (
        <section className="relative w-full h-auto md:min-h-screen overflow-hidden flex flex-col justify-center">
          {/* Hero Video - plays first, then fades out smoothly when it ends */}
          {homepageContent.heroVideo && (
            <video
              ref={videoRef}
              className={`relative w-full h-auto md:absolute md:inset-0 md:h-full object-contain md:object-cover z-40 transition-opacity duration-[1500ms] ease-in-out ${videoEnded || isTransitioning ? "opacity-0 pointer-events-none z-0" : "opacity-100 z-40"
                }`}
              autoPlay
              muted
              playsInline
              preload="auto"
              style={{
                transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: videoEnded ? 'hidden' : 'visible',
                display: 'block', // Always block to maintain height on mobile
                zIndex: videoEnded || isTransitioning ? 0 : 40
              }}
              onLoadStart={() => {
                // Video started loading - try to play immediately
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(() => {
                    // Ignore errors, will retry when ready
                  });
                }
              }}
              onLoadedMetadata={() => {
                // Video metadata loaded - try to play
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(() => {
                    // Ignore errors, will retry when ready
                  });
                }
              }}
              onLoadedData={() => {
                setHeroVideoReady(true);
                // Ensure video plays immediately when loaded
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onCanPlay={() => {
                setHeroVideoReady(true);
                // Force play when video can play
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onCanPlayThrough={() => {
                setHeroVideoReady(true);
                // Video can play through - ensure it's playing
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onPlaying={() => {
                setHeroVideoReady(true);
              }}
              onTimeUpdate={() => {
                // Start transition slightly before video ends for seamless crossfade
                if (videoRef.current && !isTransitioning && !videoEnded && videoRef.current.duration) {
                  const timeRemaining = videoRef.current.duration - videoRef.current.currentTime;
                  // Start transition 0.8 seconds before end for smooth crossfade
                  if (timeRemaining <= 0.8 && timeRemaining > 0.1) {
                    setIsTransitioning(true);
                  }
                }
              }}
            >
              <source src={homepageContent.heroVideo} type="video/mp4" />
              <source src={homepageContent.heroVideo} type="video/webm" />
            </video>
          )}

          {/* Background Video - fades in smoothly after hero video ends */}
          {homepageContent.backgroundVideo && (
            <video
              ref={backgroundVideoRef}
              className={`absolute inset-0 w-full h-full object-cover scale-[1.35] z-10 transition-opacity duration-[1500ms] ease-in-out ${videoEnded || isTransitioning || !homepageContent.heroVideo ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              autoPlay={!homepageContent.heroVideo || videoEnded || isTransitioning}
              loop
              muted
              playsInline
              preload={homepageContent.heroVideo ? "auto" : "auto"}
              style={{
                transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: homepageContent.heroVideo && !videoEnded && !isTransitioning ? 'hidden' : 'visible',
                display: homepageContent.heroVideo && !videoEnded && !isTransitioning ? 'none' : 'block',
                pointerEvents: homepageContent.heroVideo && !videoEnded && !isTransitioning ? 'none' : 'auto'
              }}
              onCanPlay={() => {
                setBackgroundVideoReady(true);
                // If we're transitioning or video has ended, ensure it plays
                if ((isTransitioning || videoEnded || !homepageContent.heroVideo) && backgroundVideoRef.current?.paused) {
                  backgroundVideoRef.current.play().catch(console.error);
                }
              }}
            >
              <source src={homepageContent.backgroundVideo} type="video/mp4" />
              <source src={homepageContent.backgroundVideo} type="video/webm" />
            </video>
          )}

          {/* Fallback: Only show gradient if no videos at all AND content is loaded AND we've confirmed no hero video */}
          {contentLoaded && !homepageContent.heroVideo && !homepageContent.backgroundVideo && videoEnded && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-dark-choc via-earl-gray to-butter-yellow z-10" />
          )}

          {/* Content - fades in smoothly after hero video ends or if no hero video (and content is loaded) */}
          <div
            className={`absolute inset-0 md:relative z-20 h-full flex items-center transition-opacity duration-[1500ms] ease-in-out ${contentLoaded && (
              (homepageContent.heroVideo && (videoEnded || isTransitioning)) ||
              (!homepageContent.heroVideo && !isInitialLoad)
            ) ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            style={{
              transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              visibility: contentLoaded && (
                (homepageContent.heroVideo && (videoEnded || isTransitioning)) ||
                (!homepageContent.heroVideo && !isInitialLoad)
              ) ? 'visible' : 'hidden',
              display: contentLoaded && (
                (homepageContent.heroVideo && (videoEnded || isTransitioning)) ||
                (!homepageContent.heroVideo && !isInitialLoad)
              ) ? 'flex' : 'none'
            }}
          >
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={
                  contentLoaded && (
                    (homepageContent.heroVideo && (videoEnded || isTransitioning)) ||
                    (!homepageContent.heroVideo && !isInitialLoad)
                  ) ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="max-w-5xl"
              >
                <p className="label-text mb-3 sm:mb-4 md:mb-8 text-dark-choc/70 text-[9px] sm:text-[10px] md:text-xs">
                  {homepageContent.tagline}
                </p>
                <h1
                  className="font-serif text-dark-choc leading-[1.1] mb-4 sm:mb-6 md:mb-10"
                  style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}
                >
                  {homepageContent.heroHeadline || 'We craft brand identities that resonate.'}
                </h1>
                <p className="body-text max-w-xl mb-6 sm:mb-8 md:mb-14 text-dark-choc/80 text-sm sm:text-base md:text-lg">
                  {homepageContent.heroSubheading}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="btn-primary bg-[#892F1A] border-[#892F1A] hover:bg-[#6d2514] hover:border-[#6d2514] inline-block text-[10px] sm:text-xs px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5"
                  >
                    Start Your Project
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVICES ================= */}
      {homepageContent.sections.services.enabled && (
        <div className="-mt-[1px] relative z-20">
          <SectionReveal>
            <section className="bg-earl-gray relative overflow-hidden pb-8 sm:pb-10 pt-12 sm:pt-16 md:pt-20">

              {/* MARQUEE */}
              <div className="mb-8 sm:mb-12 md:mb-20">
                {/* <TextMarquee text="WHY BRANDS CHOOSE US • BLOOM BRANDING • " /> */}
              </div>

              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
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
              </div>

              <div className="w-full max-w-[95%] mx-auto px-4 sm:px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">

                  {/* LEFT COLUMN: Grid of Services */}
                  <div className="lg:col-span-7 flex flex-col pt-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-8 border-t border-dark-choc/20 pt-6 sm:pt-6 md:pt-8">
                      {services.map((service, index) => (
                        <motion.div
                          key={service.title}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          onClick={() => setHoveredService(index)}
                          onHoverStart={() => setHoveredService(index)}
                          className={`group relative border border-dark-choc/20 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 cursor-pointer transition-all duration-500 h-full flex flex-col justify-between min-h-[160px] sm:min-h-[180px] ${hoveredService === index ? "bg-dark-choc shadow-xl scale-[1.01]" : "hover:bg-dark-choc/5 hover:border-dark-choc/40"}`}
                        >
                          <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
                            {/* Header Group */}
                            <div className="flex items-center justify-between">
                              <span className={`font-serif text-base sm:text-lg md:text-xl transition-all duration-300 ${hoveredService === index ? "text-earl-gray/30" : "text-dark-choc/40"}`}>
                                0{index + 1}
                              </span>
                              {/* Arrow (Visible on hover/active) */}
                              <motion.div
                                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border transition-all duration-300 ${hoveredService === index ? "border-earl-gray bg-earl-gray text-dark-choc" : "border-dark-choc/20 text-dark-choc/40 group-hover:border-dark-choc group-hover:text-dark-choc opacity-50 group-hover:opacity-100"}`}
                                animate={{
                                  rotate: hoveredService === index ? -45 : 0,
                                }}
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.div>
                            </div>

                            <h3 className={`heading-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all duration-300 leading-tight ${hoveredService === index ? "text-earl-gray" : "text-dark-choc"}`}>
                              {service.title}
                            </h3>

                            {/* Mobile-Only Context Image - Restores visual parity with desktop - Reveal on Tap */}
                            {hoveredService === index && (
                              <div className="relative w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden mt-2 lg:hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                <Image
                                  src={SERVICE_IMAGES[index % SERVICE_IMAGES.length]}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 0vw"
                                />
                                <div className="absolute inset-0 bg-dark-choc/5" />
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div className="mt-4 sm:mt-6">
                            <p className={`body-text text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed transition-all duration-300 ${hoveredService === index ? "text-earl-gray/80" : "text-dark-choc/60 line-clamp-3"}`}>
                              {service.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Dynamic Image (Sticky) */}
                  <div className="hidden lg:flex lg:col-span-5 sticky top-0 h-screen flex-col justify-center">
                    <div className="relative w-full h-[60vh] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-dark-choc/5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={hoveredService || 0}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={SERVICE_IMAGES[(hoveredService || 0) % SERVICE_IMAGES.length]}
                            alt="Service visualization"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 0vw, 50vw"
                          />
                          {/* Subtle Overlay */}
                          <div className="absolute inset-0 bg-dark-choc/10 mix-blend-multiply" />

                          {/* Text Overlay */}
                          <div className="absolute bottom-10 left-10 z-10 w-3/4">
                            <motion.p
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="font-serif text-4xl md:text-5xl text-white/90 leading-tight"
                            >
                              {services[hoveredService || 0]?.title}
                            </motion.p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </SectionReveal>
        </div>
      )}

      {/* ================= VIDEO BREAK ================= */}
      {homepageContent.sectionVideo && (
        <section className="w-full h-[50vh] md:h-screen overflow-hidden bg-black">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={homepageContent.sectionVideo} type="video/mp4" />
            <source src={homepageContent.sectionVideo} type="video/webm" />
          </video>
        </section>
      )}

      {/* ================= CLIENTS ================= */}
      {homepageContent.sections.clients.enabled && (
        <SkewedClients
          clients={clients}
          label={homepageContent.clientsLabel}
        />
      )}

      {/* ================= EXPERIENCE ================= */}
      {homepageContent.sections.about.enabled && (
        <SectionReveal>
          <ExperienceSection />
        </SectionReveal>
      )}

      {/* ================= TESTIMONIALS SLIDER ================= */}
      {homepageContent.sections.testimonials.enabled && (
        <TestimonialsSection
          testimonials={testimonials}
          label={homepageContent.testimonialsLabel}
          heading={homepageContent.testimonialsHeading}
        />
      )}

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
                Visit Our Studio
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              {/* Address */}
              <motion.div
                className="flex flex-col justify-center relative z-20"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="bg-white/80 backdrop-blur-md p-6 sm:p-10 md:p-12 border border-dark-choc/5 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
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
                      href={homepageContent.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary mt-8 w-full md:w-auto"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Open in Google Maps
                    </motion.a>
                  </address>
                </div>
              </motion.div>

              {/* Google Maps Embed */}
              <motion.div
                className="relative w-full h-[280px] sm:h-[350px] md:h-[500px]"
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
                  className="w-full h-full rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                  title="Bloom Branding Studio Location"
                />
                
                {/* Clickable Overlay for Map */}
                <div 
                  className="absolute inset-0 z-20 cursor-pointer"
                  onClick={() => window.open(homepageContent.googleMapsUrl, "_blank", "noopener,noreferrer")}
                  aria-label="Open Google Maps"
                ></div>

                {/* Red Location Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <div className="relative">
                    {/* Pin Shadow */}
                    <div className="absolute top-[42px] left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black/20 blur-md rounded-full"></div>
                    {/* Red Pin */}
                    <svg
                      width="40"
                      height="48"
                      viewBox="0 0 40 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-lg"
                    >
                      <path
                        d="M20 0C10.06 0 2 8.06 2 18C2 29 20 48 20 48C20 48 38 29 38 18C38 8.06 29.94 0 20 0Z"
                        fill="#dc2626"
                        className="animate-pulse"
                      />
                      <path
                        d="M20 12C16.69 12 14 14.69 14 18C14 21.31 16.69 24 20 24C23.31 24 26 21.31 26 18C26 14.69 23.31 12 20 12Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div >
  );
}
