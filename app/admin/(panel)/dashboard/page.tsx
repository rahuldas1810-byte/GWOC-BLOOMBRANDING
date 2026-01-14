'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Users, MessageSquare, Mail, Film, FileText, Briefcase } from 'lucide-react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

const MotionLink = motion(Link)

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: "easeOut" })
    return controls.stop
  }, [count, value])

  return <motion.span>{rounded}</motion.span>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Brands', value: stats?.brands || 0, icon: Users, href: '/admin/brands' },
    { label: 'Services', value: stats?.services || 0, icon: Briefcase, href: '/admin/services' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, href: '/admin/testimonials' },
    { label: 'Clients', value: stats?.clients || 0, icon: Users, href: '/admin/clients' },
    { label: 'Media Files', value: stats?.media || 0, icon: Film, href: '/admin/media' },
    { label: 'New Enquiries', value: stats?.newEnquiries || 0, icon: Mail, href: '/admin/enquiries' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
           animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="relative flex flex-col items-center justify-center"
        >
          <span className="text-8xl font-serif text-electric-blue-dark">B</span>
          <p className="mt-4 text-electric-blue-dark/60 font-medium tracking-widest text-sm uppercase">Loading Bloom CMS...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-10 relative"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      }}
    >
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-multiply" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
           }}
      />

      <motion.div className="mb-8 relative z-10" variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}>
        <h1 className="text-3xl font-extrabold text-dark-choc mb-2">Dashboard</h1>
        <p className="text-dark-choc/60">Welcome to Bloom Branding CMS</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const CardContent = (
            <div className="bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out p-6 border border-dark-choc/5 group cursor-pointer transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-electric-blue-dark/70 text-xs font-medium mb-2 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-5xl font-serif font-extrabold text-electric-blue-dark tabular-nums">
                    <AnimatedNumber value={stat.value} />
                  </p>
                </div>
                <div className="bg-earl-gray/50 p-4 rounded-xl group-hover:bg-electric-blue group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-dark-choc group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
            </div>
          )

          return (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
              {stat.href ? (
                <Link href={stat.href}>
                  {CardContent}
                </Link>
              ) : (
                CardContent
              )}
            </motion.div>
          )
        })}
      </div>

      <motion.div 
        className="bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] p-6 border border-dark-choc/5 relative z-10"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
        }}
      >
        <h2 className="text-xl font-extrabold text-dark-choc mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MotionLink
            href="/admin/brands/new"
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white border-2 border-dark-choc/5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-electric-blue hover:bg-electric-blue hover:text-white hover:-translate-y-[2px] transition-all duration-300 ease-out text-center group"
          >
            <FileText className="w-8 h-8 mx-auto mb-3 text-dark-choc/40 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="font-medium block">Add Brand</span>
          </MotionLink>
          <MotionLink
            href="/admin/testimonials/new"
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white border-2 border-dark-choc/5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-electric-blue hover:bg-electric-blue hover:text-white hover:-translate-y-[2px] transition-all duration-300 ease-out text-center group"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-dark-choc/40 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="font-medium block">Add Testimonial</span>
          </MotionLink>
          <MotionLink
            href="/admin/services/new"
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white border-2 border-dark-choc/5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-electric-blue hover:bg-electric-blue hover:text-white hover:-translate-y-[2px] transition-all duration-300 ease-out text-center group"
          >
            <Briefcase className="w-8 h-8 mx-auto mb-3 text-dark-choc/40 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="font-medium block">Add Service</span>
          </MotionLink>
          <MotionLink
            href="/admin/media"
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white border-2 border-dark-choc/5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-electric-blue hover:bg-electric-blue hover:text-white hover:-translate-y-[2px] transition-all duration-300 ease-out text-center group"
          >
            <Film className="w-8 h-8 mx-auto mb-3 text-dark-choc/40 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="font-medium block">Upload Media</span>
          </MotionLink>
        </div>
      </motion.div>
    </motion.div>
  )
}
