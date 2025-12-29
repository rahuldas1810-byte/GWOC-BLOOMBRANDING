'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await api.getBrands()
      if (response.success && response.data) {
        setBrands(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return

    try {
      const response = await api.deleteBrand(id)
      if (response.success) {
        fetchBrands()
      }
    } catch (error) {
      console.error('Failed to delete brand:', error)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading brands...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-choc">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-earl-gray">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Order</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-choc/10">
            {brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-dark-choc/60">
                  No brands found. Create your first brand!
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-earl-gray/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {brand.image?.url && (
                        <img
                          src={brand.image.url}
                          alt={brand.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <span className="font-medium text-dark-choc">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-choc">{brand.category}</td>
                  <td className="px-6 py-4 text-dark-choc">{brand.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/brands/${brand._id}`}
                        className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(brand._id)}
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
  )
}

