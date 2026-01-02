'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import EmptyState from '@/components/admin/EmptyState'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { toast } from '@/components/admin/Toast'

export default function TestimonialsPage() {
  // Brands state
  const [brands, setBrands] = useState<any[]>([])
  const [filteredBrands, setFilteredBrands] = useState<any[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null)

  // Testimonials state
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
    fetchTestimonials()
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
      setBrandsLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await api.getTestimonials()
      if (response.success && response.data) {
        setTestimonials(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setTestimonialsLoading(false)
    }
  }

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    setDeletingBrandId(id)
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
      setDeletingBrandId(null)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateTestimonial(id, { isActive: !currentStatus })
      if (response.success) {
        toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchTestimonials()
      } else {
        toast.error('Failed to update testimonial')
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to update testimonial')
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await api.deleteTestimonial(id)
      if (response.success) {
        toast.success('Testimonial deleted successfully')
        fetchTestimonials()
      } else {
        toast.error('Failed to delete testimonial')
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-choc mb-2">Testimonials</h1>
        <p className="text-dark-choc/60">Manage brands and client testimonials</p>
      </div>

      {/* Section 1: Brands */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-dark-choc mb-1">Brands</h2>
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

        {brandsLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-dark-choc/60">Loading brands...</p>
            </div>
          </div>
        ) : (
          <>
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
                                onClick={() => handleDeleteBrand(brand._id, brand.name)}
                                disabled={deletingBrandId === brand._id}
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
          </>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-dark-choc/20 my-8"></div>

      {/* Section 2: Client Testimonials */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-dark-choc mb-1">Client Testimonials</h2>
            <p className="text-dark-choc/60">Manage client testimonials and reviews</p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Testimonial
          </Link>
        </div>

        {testimonialsLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-dark-choc/60">Loading testimonials...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-dark-choc/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-earl-gray/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Quote</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-choc">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-choc/10">
                  {testimonials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-earl-gray rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-dark-choc/40" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-dark-choc mb-2">No testimonials yet</h3>
                            <p className="text-dark-choc/60 mb-4">Get started by creating your first client testimonial.</p>
                            <Link
                              href="/admin/testimonials/new"
                              className="inline-flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors font-medium"
                            >
                              <Plus className="w-5 h-5" />
                              Create First Testimonial
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    testimonials.map((testimonial) => (
                      <tr key={testimonial._id} className="hover:bg-earl-gray/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {testimonial.profileImage?.url && (
                              <img
                                src={testimonial.profileImage.url}
                                alt={testimonial.clientName}
                                className="w-12 h-12 object-cover rounded-full border border-dark-choc/10"
                              />
                            )}
                            <span className="font-medium text-dark-choc">{testimonial.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-dark-choc">{testimonial.company}</td>
                        <td className="px-6 py-4 text-dark-choc max-w-md truncate">
                          {testimonial.quote}
                        </td>
                        <td className="px-6 py-4 text-dark-choc">{testimonial.order || 0}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded font-medium ${
                              testimonial.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(testimonial._id, testimonial.isActive)}
                              className={`p-2 rounded-lg transition-colors ${
                                testimonial.isActive
                                  ? 'text-gray-500 hover:bg-gray-100'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={testimonial.isActive ? 'Hide' : 'Show'}
                            >
                              {testimonial.isActive ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <Link
                              href={`/admin/testimonials/${testimonial._id}`}
                              className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        )}
      </section>
    </div>
  )
}
