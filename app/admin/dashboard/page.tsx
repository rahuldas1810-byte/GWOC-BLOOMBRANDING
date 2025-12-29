'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Users, MessageSquare, Image, Mail, Film, FileText } from 'lucide-react'

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
    { label: 'Brands', value: stats?.brands || 0, icon: Users, color: 'bg-electric-blue' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, color: 'bg-butter-yellow' },
    { label: 'Banners', value: stats?.banners || 0, icon: Image, color: 'bg-[#892F1A]' },
    { label: 'Clients', value: stats?.clients || 0, icon: Users, color: 'bg-dark-choc' },
    { label: 'Media Files', value: stats?.media || 0, icon: Film, color: 'bg-earl-gray' },
    { label: 'New Enquiries', value: stats?.newEnquiries || 0, icon: Mail, color: 'bg-red-500' },
  ]

  if (loading) {
    return <div className="text-dark-choc">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-choc mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-choc/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-dark-choc">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
        <h2 className="text-xl font-bold text-dark-choc mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/brands/new"
            className="p-4 border border-dark-choc/20 rounded-lg hover:bg-earl-gray transition-colors text-center"
          >
            <FileText className="w-6 h-6 mx-auto mb-2 text-electric-blue" />
            <span className="text-dark-choc">Add Brand</span>
          </a>
          <a
            href="/admin/testimonials/new"
            className="p-4 border border-dark-choc/20 rounded-lg hover:bg-earl-gray transition-colors text-center"
          >
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-electric-blue" />
            <span className="text-dark-choc">Add Testimonial</span>
          </a>
          <a
            href="/admin/media"
            className="p-4 border border-dark-choc/20 rounded-lg hover:bg-earl-gray transition-colors text-center"
          >
            <Film className="w-6 h-6 mx-auto mb-2 text-electric-blue" />
            <span className="text-dark-choc">Upload Media</span>
          </a>
          <a
            href="/admin/enquiries"
            className="p-4 border border-dark-choc/20 rounded-lg hover:bg-earl-gray transition-colors text-center"
          >
            <Mail className="w-6 h-6 mx-auto mb-2 text-electric-blue" />
            <span className="text-dark-choc">View Enquiries</span>
          </a>
        </div>
      </div>
    </div>
  )
}

