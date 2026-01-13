'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import EmptyState from '@/components/admin/EmptyState'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { toast } from '@/components/admin/Toast'

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [filteredBrands, setFilteredBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = brands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBrands(filtered)
    } else {
      setFilteredBrands(brands)
    }
  }, [searchQuery, brands])

  const fetchBrands = async () => {
    try {
      const response = await api.getBrands()
      if (response.success && response.data) {
        setBrands(response.data)
        setFilteredBrands(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error)
      toast.error('Failed to load brands')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    setDeletingId(id)
    try {
      const response = await api.deleteBrand(id)
      if (response.success) {
        toast.success('Brand deleted successfully')
        fetchBrands()
      } else {
        toast.error(response.message || 'Failed to delete brand')
      }
    } catch (error) {
      console.error('Failed to delete brand:', error)
      toast.error('Failed to delete brand')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-dark-choc/60">Loading brands...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc">Brands</h1>
          <p className="text-dark-choc/60 mt-1">Manage your brand portfolio</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-all font-semibold shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </Link>
      </div>

      {brands.length > 0 && (
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/30 group-focus-within:text-electric-blue transition-colors" />
          <input
            type="text"
            placeholder="Search brands by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border border-dark-choc/15 rounded-xl focus:ring-4 focus:ring-electric-blue/10 focus:border-electric-blue bg-white transition-all outline-none text-sm sm:text-base placeholder:text-dark-choc/30"
          />
        </div>
      )}

      {filteredBrands.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-dark-choc/5 shadow-sm">
          <EmptyState
            icon={Plus}
            title={brands.length === 0 ? "No brands yet" : "No brands found"}
            description={
              brands.length === 0
                ? "Get started by creating your first brand. Brands will appear on your testimonials page."
                : `No brands match "${searchQuery}". Try a different search term.`
            }
            actionLabel={brands.length === 0 ? "Create First Brand" : undefined}
            actionHref={brands.length === 0 ? "/admin/brands/new" : undefined}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-dark-choc/5 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-earl-gray/30 text-dark-choc/70 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5 text-left">Brand</th>
                  <th className="px-6 py-5 text-left">Category</th>
                  <th className="px-6 py-5 text-left w-24">Order</th>
                  <th className="px-6 py-5 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-choc/5">
                {filteredBrands.map((brand) => (
                  <tr
                    key={brand._id}
                    className="hover:bg-earl-gray/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg border border-dark-choc/10 overflow-hidden bg-white shrink-0">
                          {brand.image?.url ? (
                            <img
                              src={brand.image.url}
                              alt={brand.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full bg-earl-gray/20 flex items-center justify-center text-dark-choc/20">
                              <Plus className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-dark-choc group-hover:text-electric-blue transition-colors">{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-electric-blue/5 text-electric-blue border border-electric-blue/10">
                        {brand.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-dark-choc/60 font-mono font-medium">{brand.order || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/brands/${brand._id}`}
                          className="p-2 text-dark-choc/40 hover:text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(brand._id, brand.name)}
                          disabled={deletingId === brand._id}
                          className="p-2 text-dark-choc/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-dark-choc/5">
            {filteredBrands.map((brand) => (
              <div key={brand._id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl border border-dark-choc/10 overflow-hidden bg-white shrink-0 p-1">
                      {brand.image?.url ? (
                        <img
                          src={brand.image.url}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-earl-gray/20 flex items-center justify-center text-dark-choc/20">
                          <Plus className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-dark-choc truncate">{brand.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dark-choc/40">
                          Order: {brand.order || 0}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-dark-choc/20" />
                        <span className="text-xs font-semibold text-electric-blue">
                          {brand.category || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/brands/${brand._id}`}
                      className="p-2.5 text-dark-choc/40 bg-earl-gray/10 rounded-xl"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(brand._id, brand.name)}
                      disabled={deletingId === brand._id}
                      className="p-2.5 text-red-500 bg-red-50 rounded-xl disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

  )
}

