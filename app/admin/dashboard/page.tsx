'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Users, MessageSquare, Mail, Film, FileText, Briefcase } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

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
    { label: 'Brands', value: stats?.brands || 0, icon: Users, color: 'bg-electric-blue', href: '/admin/brands' },
    { label: 'Services', value: stats?.services || 0, icon: Briefcase, color: 'bg-purple-500', href: '/admin/services' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, color: 'bg-butter-yellow', href: '/admin/testimonials' },
    { label: 'Clients', value: stats?.clients || 0, icon: Users, color: 'bg-dark-choc', href: '/admin/clients' },
    { label: 'Media Files', value: stats?.media || 0, icon: Film, color: 'bg-green-500', href: '/admin/media' },
    { label: 'New Enquiries', value: stats?.newEnquiries || 0, icon: Mail, color: 'bg-red-500', href: '/admin/enquiries' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-dark-choc/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-choc mb-2">Dashboard</h1>
        <p className="text-dark-choc/60">Welcome to Bloom Branding CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const CardContent = (
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-dark-choc/10 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-dark-choc/60 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-dark-choc">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          )

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {CardContent}
            </Link>
          ) : (
            <div key={stat.label}>{CardContent}</div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-dark-choc/10">
        <h2 className="text-xl font-bold text-dark-choc mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/brands/new"
            className="p-5 border-2 border-dark-choc/10 rounded-xl hover:border-electric-blue hover:bg-electric-blue/5 transition-all text-center group"
          >
            <FileText className="w-8 h-8 mx-auto mb-3 text-electric-blue group-hover:scale-110 transition-transform" />
            <span className="text-dark-choc font-medium block">Add Brand</span>
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="p-5 border-2 border-dark-choc/10 rounded-xl hover:border-electric-blue hover:bg-electric-blue/5 transition-all text-center group"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-electric-blue group-hover:scale-110 transition-transform" />
            <span className="text-dark-choc font-medium block">Add Testimonial</span>
          </Link>
          <Link
            href="/admin/services/new"
            className="p-5 border-2 border-dark-choc/10 rounded-xl hover:border-electric-blue hover:bg-electric-blue/5 transition-all text-center group"
          >
            <Briefcase className="w-8 h-8 mx-auto mb-3 text-electric-blue group-hover:scale-110 transition-transform" />
            <span className="text-dark-choc font-medium block">Add Service</span>
          </Link>
          <Link
            href="/admin/media"
            className="p-5 border-2 border-dark-choc/10 rounded-xl hover:border-electric-blue hover:bg-electric-blue/5 transition-all text-center group"
          >
            <Film className="w-8 h-8 mx-auto mb-3 text-electric-blue group-hover:scale-110 transition-transform" />
            <span className="text-dark-choc font-medium block">Upload Media</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
