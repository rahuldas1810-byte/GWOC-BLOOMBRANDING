'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Users, MessageSquare, Mail, Film, FileText, Briefcase, Plus, Loader2, LayoutDashboard } from 'lucide-react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

const MotionLink = motion(Link)

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.5, ease: "easeOut" })
    return controls.stop
  }, [count, value])

  return <motion.span>{rounded}</motion.span>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])
  const [recentMedia, setRecentMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, enquiriesRes, mediaRes] = await Promise.all([
        api.getStats(),
        api.getEnquiries({ limit: 5 }),
        api.getMedia({ limit: 4 })
      ])

      if (statsRes.success) setStats(statsRes.data)
      if (enquiriesRes.success) setRecentEnquiries(enquiriesRes.data || [])
      if (mediaRes.success) setRecentMedia(mediaRes.data || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Brands', value: stats?.brands || 0, icon: Users, color: 'bg-electric-blue', href: '/admin/testimonials' },
    { label: 'Services', value: stats?.services || 0, icon: Briefcase, color: 'bg-purple-500', href: '/admin/services' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, color: 'bg-butter-yellow', href: '/admin/testimonials' },
    { label: 'Clients', value: stats?.clients || 0, icon: Users, color: 'bg-dark-choc', href: '/admin/clients' },
    { label: 'Media Files', value: stats?.media || 0, icon: Film, color: 'bg-green-500', href: '/admin/media' },
    { label: 'New Enquiries', value: stats?.newEnquiries || 0, icon: Mail, color: 'bg-red-500', href: '/admin/enquiries' },
  ]

  // No full-page blocking loader. Instead, show skeletons or empty states within the cards.
  // This ensures the sidebar and top bar (from layout) and dashboard title render instantly.

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Hero Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-electric-blue p-8 md:p-12 text-white shadow-2xl">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -right-1/4 w-[100%] h-[150%] bg-white/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1/2 -left-1/4 w-[100%] h-[150%] bg-butter-yellow/20 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <LayoutDashboard className="w-5 h-5 text-butter-yellow" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Command Center</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 tracking-tighter text-butter-yellow">
              Bloom Admin
            </h1>
            <p className="text-white/60 text-lg font-medium max-w-md leading-relaxed">
              Everything is in bloom. Your branding ecosystem is currently performing at its peak.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/admin/site-settings" className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all font-bold text-sm backdrop-blur-md">
              Settings
            </Link>
            <Link href="/" target="_blank" className="px-6 py-3 rounded-2xl bg-butter-yellow text-dark-choc hover:scale-105 transition-all font-black text-sm shadow-xl shadow-butter-yellow/20">
              View Website
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Actions */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={stat.href || '#'}>
                    <div className="bg-white rounded-3xl p-6 border border-dark-choc/5 shadow-xl shadow-dark-choc/5 hover:shadow-2xl transition-all group active:scale-95">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-3 rounded-2xl ${stat.color} shadow-lg shadow-black/5 text-white group-hover:rotate-6 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {loading && <Loader2 className="w-3 h-3 animate-spin text-dark-choc/20" />}
                      </div>
                      <p className="text-dark-choc/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-dark-choc tracking-tighter">
                          <AnimatedNumber value={stat.value} />
                        </p>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-dark-choc/5 shadow-xl shadow-dark-choc/5">
            <h2 className="text-xl font-black text-dark-choc mb-8 flex items-center gap-3">
              <Plus className="w-5 h-5 text-electric-blue" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Add Brand', href: '/admin/brands/new', icon: Plus, sub: 'New showcase' },
                { label: 'Testimonial', href: '/admin/testimonials/new', icon: MessageSquare, sub: 'Client feedback' },
                { label: 'New Service', href: '/admin/services/new', icon: Briefcase, sub: 'Expand offer' },
                { label: 'Upload Media', href: '/admin/media', icon: Film, sub: 'Gallery update' },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="p-6 bg-earl-gray/30 border border-transparent hover:border-electric-blue/20 hover:bg-white hover:shadow-xl transition-all rounded-3xl group active:scale-95"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-dark-choc/5 group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6 text-electric-blue" />
                  </div>
                  <span className="text-dark-choc text-sm font-bold block mb-1">{action.label}</span>
                  <span className="text-dark-choc/40 text-[10px] font-medium block">{action.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-4 space-y-8">
          {/* Latest Enquiries */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-dark-choc/5 shadow-xl shadow-dark-choc/5 h-full">
            <h2 className="text-xl font-black text-dark-choc mb-8 flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-500" />
              Recent Enquiries
            </h2>
            <div className="space-y-6">
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enquiry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <Link href={`/admin/enquiries/${enquiry._id}`} className="block">
                      <div className="flex items-start gap-4 p-3 -m-3 rounded-2xl hover:bg-earl-gray/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-earl-gray flex items-center justify-center flex-shrink-0 text-dark-choc/60 font-black text-xs">
                          {enquiry.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-dark-choc truncate">{enquiry.name}</p>
                          <p className="text-[11px] text-dark-choc/40 font-medium truncate mb-1">{enquiry.email}</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${enquiry.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {enquiry.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-dark-choc/30 text-sm font-medium">No recent enquiries</p>
                </div>
              )}
            </div>

            <Link href="/admin/enquiries" className="mt-8 pt-8 border-t border-dark-choc/5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-dark-choc/40 hover:text-electric-blue transition-colors">
              View All Enquiries
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
