'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Quote } from 'lucide-react'
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Testimonials & Brands</h1>
            <p className="text-dark-choc/60 text-sm sm:text-base">Manage brand portfolio and customer success stories.</p>
          </div>
        </div>
      </div>

      {/* Section 1: Brands */}
      <section className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-dark-choc">Brand Portfolio</h2>
              <p className="text-xs font-black uppercase tracking-widest text-dark-choc/40">Logos shown on the site</p>
            </div>
            <Link
              href="/admin/brands/new"
              className="flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all shadow-sm active:scale-95 font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Brand
            </Link>
          </div>

          {brandsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-dark-choc/40 font-medium">Syncing brands...</p>
            </div>
          ) : (
            <>
              {brands.length > 0 && (
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/20" />
                  <input
                    type="text"
                    placeholder="Search brands by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-medium text-dark-choc"
                  />
                </div>
              )}

              {filteredBrands.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-dark-choc/5 rounded-2xl">
                  <EmptyState
                    icon={Plus}
                    title={brands.length === 0 ? "No brands yet" : "No brands found"}
                    description={
                      brands.length === 0
                        ? "Get started by creating your first brand. Brands will appear on your testimonials page."
                        : `No brands match "${searchQuery}". Try a different search term.`
                    }
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-dark-choc/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-earl-gray/30 text-dark-choc/70 text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                          <th className="px-6 py-5">Brand</th>
                          <th className="px-6 py-5 hidden md:table-cell">Category</th>
                          <th className="px-6 py-5 text-center">Order</th>
                          <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-choc/5 text-sm">
                        {filteredBrands.map((brand) => (
                          <tr key={brand._id} className="hover:bg-earl-gray/10 group transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 min-w-[200px]">
                                <div className="w-10 h-10 rounded-lg bg-white border border-dark-choc/10 p-1.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                                  {brand.image?.url ? (
                                    <img
                                      src={brand.image.url}
                                      alt={brand.name}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  ) : (
                                    <Plus className="w-5 h-5 text-dark-choc/10" />
                                  )}
                                </div>
                                <span className="font-bold text-dark-choc group-hover:text-electric-blue transition-colors">{brand.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-dark-choc/5 text-dark-choc/70 border border-dark-choc/10">
                                {brand.category || 'General'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-mono font-bold text-dark-choc/40">{brand.order || 0}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/admin/brands/${brand._id}`}
                                  className="p-2 text-dark-choc/30 hover:text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteBrand(brand._id, brand.name)}
                                  disabled={deletingBrandId === brand._id}
                                  className="p-2 text-dark-choc/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
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
        </div>
      </section>

      {/* Section 2: Client Testimonials */}
      <section className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-dark-choc">Client Success</h2>
              <p className="text-xs font-black uppercase tracking-widest text-dark-choc/40">Verified testimonials</p>
            </div>
            <Link
              href="/admin/testimonials/new"
              className="flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all shadow-sm active:scale-95 font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Testimonial
            </Link>
          </div>

          {testimonialsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-dark-choc/40 font-medium">Syncing stories...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-dark-choc/5 rounded-2xl">
              <EmptyState
                icon={Quote}
                title="No testimonials yet"
                description="Get started by creating your first client testimonial."
                actionLabel="Create Testimonial"
                actionHref="/admin/testimonials/new"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dark-choc/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-earl-gray/30 text-dark-choc/70 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-5">Client</th>
                      <th className="px-6 py-5 hidden md:table-cell">Company</th>
                      <th className="px-6 py-5 text-center">Order</th>
                      <th className="px-6 py-5 text-center">Status</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5 text-sm">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial._id} className="hover:bg-earl-gray/10 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-10 h-10 rounded-full bg-earl-gray overflow-hidden shrink-0 border border-dark-choc/10">
                              {testimonial.profileImage?.url ? (
                                <img
                                  src={testimonial.profileImage.url}
                                  alt={testimonial.clientName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-dark-choc/20 font-bold">
                                  {testimonial.clientName[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-dark-choc group-hover:text-electric-blue transition-colors">{testimonial.clientName}</p>
                              <p className="text-[10px] text-dark-choc/40 font-medium md:hidden">{testimonial.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-dark-choc/60 font-medium">{testimonial.company}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono font-bold text-dark-choc/40">{testimonial.order || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleActive(testimonial._id, testimonial.isActive)}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${testimonial.isActive
                              ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                              }`}
                          >
                            {testimonial.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/testimonials/${testimonial._id}`}
                              className="p-2 text-dark-choc/30 hover:text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial._id)}
                              className="p-2 text-dark-choc/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
      </section>
    </div>
  )
}
