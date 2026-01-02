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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-choc mb-2">Brands</h1>
          <p className="text-dark-choc/60">Manage your brand portfolio</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </Link>
      </div>

      {brands.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/40" />
          <input
            type="text"
            placeholder="Search brands by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent bg-white"
          />
        </div>
      )}

      {filteredBrands.length === 0 ? (
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
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-earl-gray/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Brand</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-choc/10">
                {filteredBrands.map((brand) => (
                  <tr
                    key={brand._id}
                    className="hover:bg-earl-gray/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brand.image?.url && (
                          <img
                            src={brand.image.url}
                            alt={brand.name}
                            className="w-12 h-12 object-cover rounded-lg border border-dark-choc/10"
                          />
                        )}
                        <span className="font-medium text-dark-choc">{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-electric-blue/10 text-electric-blue">
                        {brand.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-choc">{brand.order || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/brands/${brand._id}`}
                          className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(brand._id, brand.name)}
                          disabled={deletingId === brand._id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

