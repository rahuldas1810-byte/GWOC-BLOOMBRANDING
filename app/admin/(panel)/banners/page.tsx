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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Banners Management</h1>
          <p className="text-dark-choc/60 text-sm sm:text-base">Control hero media and marketing banners.</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="flex items-center justify-center gap-2 bg-dark-choc text-white px-8 py-3 rounded-xl hover:bg-dark-choc/90 transition-all shadow-sm active:scale-95 font-bold whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Banner
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earl-gray/30 text-dark-choc/70 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Content Details</th>
                <th className="px-6 py-5 text-center">Media Preview</th>
                <th className="px-6 py-5 text-center">Display Order</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-choc/5 text-sm">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-dark-choc/20">
                      <Plus className="w-12 h-12 mb-4 opacity-10" />
                      <p className="font-bold text-lg">No banners found</p>
                      <p className="text-sm">Start by creating your first hero media banner.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-earl-gray/10 group transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-electric-blue/5 text-electric-blue border border-electric-blue/10">
                        {banner.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[240px] truncate">
                        <span className="font-bold text-dark-choc group-hover:text-electric-blue transition-colors block truncate">{banner.title || 'Untitled Banner'}</span>
                        {banner.subtitle && (
                          <p className="text-[10px] text-dark-choc/40 font-medium truncate italic">{banner.subtitle}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {banner.image?.url && (
                          <div className="relative w-12 h-12 rounded-lg bg-white border border-dark-choc/10 p-0.5 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={banner.image.url}
                              alt={banner.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[8px] font-black text-white bg-blue-500 px-1 rounded-sm">IMG</span>
                            </div>
                          </div>
                        )}
                        {banner.video?.url && (
                          <div className="w-12 h-12 rounded-lg bg-dark-choc flex items-center justify-center border border-dark-choc/10 shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <div className="text-[8px] font-black text-white px-1 border border-white/20 rounded-sm">VIDEO</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-bold text-dark-choc/40">{banner.order || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(banner._id, banner.isActive)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${banner.isActive
                          ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                          }`}
                      >
                        {banner.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/banners/${banner._id}`}
                          className="p-2 text-dark-choc/20 hover:text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
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
  )
}

