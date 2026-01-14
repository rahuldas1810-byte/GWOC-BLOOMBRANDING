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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-choc mb-2">Dashboard</h1>
          <p className="text-dark-choc/60 text-base">Welcome to the Bloom Branding Command Center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const CardContent = (
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-dark-choc/10 group cursor-pointer h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-dark-choc/5 to-transparent rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-dark-choc/40 text-[10px] font-black uppercase tracking-widest mb-3">{stat.label}</p>
                  <p className="text-4xl font-black text-dark-choc">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-all shadow-sm`}>
                  <Icon className="w-7 h-7 text-white" />
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

      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-dark-choc/10">
        <h2 className="text-xl font-bold text-dark-choc mb-8 flex items-center gap-2">
          <FileText className="w-6 h-6 text-electric-blue" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/admin/brands/new"
            className="p-6 bg-earl-gray/10 border border-dark-choc/5 rounded-2xl hover:border-electric-blue hover:bg-white hover:shadow-lg transition-all text-center group"
          >
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-sm font-bold block">Add Brand</span>
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="p-6 bg-earl-gray/10 border border-dark-choc/5 rounded-2xl hover:border-electric-blue hover:bg-white hover:shadow-lg transition-all text-center group"
          >
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-sm font-bold block">Add Testimonial</span>
          </Link>
          <Link
            href="/admin/services/new"
            className="p-6 bg-earl-gray/10 border border-dark-choc/5 rounded-2xl hover:border-electric-blue hover:bg-white hover:shadow-lg transition-all text-center group"
          >
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-sm font-bold block">Add Service</span>
          </Link>
          <Link
            href="/admin/media"
            className="p-6 bg-earl-gray/10 border border-dark-choc/5 rounded-2xl hover:border-electric-blue hover:bg-white hover:shadow-lg transition-all text-center group"
          >
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-dark-choc/5 group-hover:scale-110 transition-transform">
              <Film className="w-8 h-8 text-electric-blue" />
            </div>
            <span className="text-dark-choc text-sm font-bold block">Media Hub</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
