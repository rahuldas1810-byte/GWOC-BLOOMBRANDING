"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import ExperienceSection from "@/components/ExperienceSection";
import { getTestimonials, getClients, getHomepageContent, getServices, getSiteSettings } from "@/lib/content";
import type { Testimonial, Client } from "@/types";

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
        setTestimonials(testimonialsData);
        setClients(clientsData);
        
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
          });
          // Mark content as loaded
          setContentLoaded(true);
          // If no hero video, show content immediately
          if (!heroVideoUrl) {
            setVideoEnded(true);
            setIsInitialLoad(false);
            setHeroVideoReady(true); // Mark as ready since there's no video
          } else {
            // If hero video exists, keep content hidden until video ends
            setVideoEnded(false);
            setIsInitialLoad(true);
            setHeroVideoReady(false); // Will be set to true when video loads
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
      <section className="relative h-screen overflow-hidden">
        {/* Hero Video - plays first, then fades out smoothly when it ends */}
        {homepageContent.heroVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover z-40 transition-opacity duration-[1500ms] ease-in-out ${
              videoEnded || isTransitioning ? "opacity-0 pointer-events-none z-0" : "opacity-100 z-40"
            }`}
            autoPlay
            muted
            playsInline
            preload="auto"
            style={{ 
              transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              visibility: videoEnded ? 'hidden' : 'visible',
              display: videoEnded ? 'none' : 'block',
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
            className={`absolute inset-0 w-full h-full object-cover scale-[1.35] z-10 transition-opacity duration-[1500ms] ease-in-out ${
              videoEnded || isTransitioning || !homepageContent.heroVideo ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
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
          className={`relative z-20 h-full flex items-center transition-opacity duration-[1500ms] ease-in-out ${
            contentLoaded && (
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
              <p className="label-text mb-8 text-dark-choc/70">
                {homepageContent.tagline}
              </p>
              <h1
                className="font-serif text-dark-choc leading-tight mb-10"
                style={{ fontSize: "clamp(6rem, 8vw, 8rem)" }}
              >
                {homepageContent.heroHeadline || 'We craft brand identities that resonate.'}
              </h1>
              <p className="body-text max-w-xl mb-14 text-dark-choc/80">
                {homepageContent.heroSubheading}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="btn-primary bg-[#892F1A] border-[#892F1A] hover:bg-[#6d2514] hover:border-[#6d2514] inline-block"
                >
                  Start Your Project
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <div className="-mt-[1px] relative z-20">
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

              <div className="flex flex-col border-t border-dark-choc/20">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onHoverStart={() => setHoveredService(index)}
                    onHoverEnd={() => setHoveredService(null)}
                    className="group relative border-b border-dark-choc/20 py-10 md:py-12 cursor-pointer transition-all duration-500 hover:bg-dark-choc hover:pl-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-12 relative z-10">
                      {/* Header Group */}
                      <div className="flex items-baseline gap-6 md:gap-10">
                        <span className={`font-serif text-lg transition-all duration-500 ${hoveredService === index ? "text-earl-gray/20 translate-x-1" : "text-dark-choc/40"}`}>
                          0{index + 1}
                        </span>
                        <h3 className={`heading-3 text-3xl md:text-5xl transition-all duration-500 ${hoveredService === index ? "text-earl-gray translate-x-2" : "text-dark-choc"}`}>
                          {service.title}
                        </h3>
                      </div>

                      {/* Arrow */}
                      <motion.div 
                        className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-500 ${hoveredService === index ? "border-earl-gray bg-earl-gray text-dark-choc" : "border-dark-choc/20 text-dark-choc/40"}`}
                        animate={{ 
                          rotate: hoveredService === index ? -45 : 0,
                          scale: hoveredService === index ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Expandable Description */}
                    <AnimatePresence>
                      {hoveredService === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 md:pl-20 max-w-2xl">
                            <p className="body-text text-lg text-earl-gray/70">
                              {service.description}
                            </p>
                            <Link href="/services" className="inline-block">
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-earl-gray font-semibold hover:text-white transition-colors"
                              >
                                Explore Service
                              </motion.div>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      </div>

      {/* ================= VIDEO BREAK ================= */}
      {homepageContent.sectionVideo && (
        <section className="w-screen h-screen overflow-hidden bg-black">
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
                  {homepageContent.clientsLabel || 'Our Clients'}
                </motion.p>
                <motion.h2
                  className="heading-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {homepageContent.clientsTitle || 'Trusted By'}
                </motion.h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
                {clients.map((client) => (
                  <span
                    key={client.id}
                    className="text-center font-serif text-xl text-dark-choc/40"
                  >
                    {client.name}
                  </span>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Address */}
              <motion.div
                className="flex flex-col justify-center relative z-20"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="bg-white/80 backdrop-blur-md p-10 md:p-12 border border-dark-choc/5 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
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
                className="w-full h-[400px] md:h-[500px] grayscale contrast-[0.9] sepia-[0.2]"
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
              </motion.div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div >
  );
}
