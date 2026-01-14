'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Users, MessageSquare, Mail, Film, FileText, Briefcase, Plus } from 'lucide-react'
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
    { label: 'Brands', value: stats?.brands || 0, icon: Users, color: 'bg-electric-blue', href: '/admin/testimonials' },
    { label: 'Services', value: stats?.services || 0, icon: Briefcase, color: 'bg-purple-500', href: '/admin/services' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, color: 'bg-butter-yellow', href: '/admin/testimonials' },
    { label: 'Clients', value: stats?.clients || 0, icon: Users, color: 'bg-dark-choc', href: '/admin/clients' },
    { label: 'Media Files', value: stats?.media || 0, icon: Film, color: 'bg-green-500', href: '/admin/media' },
    { label: 'New Enquiries', value: stats?.newEnquiries || 0, icon: Mail, color: 'bg-red-500', href: '/admin/enquiries' },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-dark-choc/40 font-medium">Syncing dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-dark-choc mb-2 tracking-tight">Dashboard</h1>
          <p className="text-dark-choc/50 font-medium">Welcome to the Bloom Branding Command Center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const CardContent = (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-dark-choc/5 hover:shadow-2xl hover:shadow-dark-choc/10 transition-all p-8 border border-dark-choc/5 group cursor-pointer h-full relative overflow-hidden active:scale-95">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dark-choc/5 to-transparent rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-dark-choc/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <p className="text-5xl font-black text-dark-choc tracking-tighter">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-5 rounded-3xl group-hover:rotate-6 transition-all shadow-lg shadow-black/5`}>
                  <Icon className="w-8 h-8 text-white" />
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

      <div className="bg-white rounded-[3rem] shadow-xl shadow-dark-choc/5 p-8 sm:p-12 border border-dark-choc/10">
        <h2 className="text-2xl font-black text-dark-choc mb-10 flex items-center gap-4">
          <div className="w-2 h-8 bg-electric-blue rounded-full" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <Link
            href="/admin/brands/new"
            className="p-8 bg-earl-gray/10 border border-dark-choc/5 rounded-[2rem] hover:border-electric-blue hover:bg-white hover:shadow-2xl transition-all text-center group active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <Plus className="w-10 h-10 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-xs font-black uppercase tracking-widest block">Add Brand</span>
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="p-8 bg-earl-gray/10 border border-dark-choc/5 rounded-[2rem] hover:border-electric-blue hover:bg-white hover:shadow-2xl transition-all text-center group active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-10 h-10 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-xs font-black uppercase tracking-widest block">Add Testimonial</span>
          </Link>
          <Link
            href="/admin/services/new"
            className="p-8 bg-earl-gray/10 border border-dark-choc/5 rounded-[2rem] hover:border-electric-blue hover:bg-white hover:shadow-2xl transition-all text-center group active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-10 h-10 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-xs font-black uppercase tracking-widest block">Add Service</span>
          </Link>
          <Link
            href="/admin/media"
            className="p-8 bg-earl-gray/10 border border-dark-choc/5 rounded-[2rem] hover:border-electric-blue hover:bg-white hover:shadow-2xl transition-all text-center group active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <Film className="w-10 h-10 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-xs font-black uppercase tracking-widest block">Media Hub</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
