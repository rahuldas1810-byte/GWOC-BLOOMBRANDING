'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await api.getBanners()
      if (response.success && response.data) {
        setBanners(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateBanner(id, { isActive: !currentStatus })
      if (response.success) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const response = await api.deleteBanner(id)
      if (response.success) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Failed to delete banner:', error)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading banners...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-choc">Banners</h1>
          <Link
            href="/admin/banners/new"
            className="flex items-center gap-2 bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </Link>
        </div>

      <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-earl-gray">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Media</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Order</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-choc/10">
            {banners.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-dark-choc/60">
                  No banners found. Create your first banner!
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-earl-gray/50">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 capitalize">
                      {banner.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-dark-choc">{banner.title || 'Untitled'}</span>
                      {banner.subtitle && (
                        <p className="text-sm text-dark-choc/60 mt-1">{banner.subtitle}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {banner.image?.url && (
                        <div className="relative">
                          <img
                            src={banner.image.url}
                            alt={banner.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            I
                          </span>
                        </div>
                      )}
                      {banner.video?.url && (
                        <div className="relative">
                          <div className="w-12 h-12 bg-dark-choc/10 rounded flex items-center justify-center">
                            <span className="text-xs text-dark-choc">VID</span>
                          </div>
                          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            V
                          </span>
                        </div>
                      )}
                      {!banner.image?.url && !banner.video?.url && (
                        <span className="text-xs text-dark-choc/40">No media</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-choc">{banner.order || 0}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        banner.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(banner._id, banner.isActive)}
                        className={`p-2 rounded transition-colors ${
                          banner.isActive
                            ? 'text-gray-500 hover:bg-gray-100'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={banner.isActive ? 'Hide' : 'Show'}
                      >
                        {banner.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href={`/admin/banners/${banner._id}`}
                        className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </div>
  )
}

