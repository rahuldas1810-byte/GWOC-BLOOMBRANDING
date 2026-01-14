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
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 p-6 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-dark-choc tracking-tight">Social Proof</h1>
              <p className="text-dark-choc/50 font-medium">Manage brand partnerships and verified client testimonials.</p>
            </div>
          </div>
        </div>

        {/* Brands Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
          <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                <Quote className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-dark-choc">Brand Portfolio</h2>
                <p className="text-xs font-black uppercase tracking-widest text-dark-choc/30">Logos displayed on site</p>
              </div>
            </div>
            <Link
              href="/admin/brands/new"
              className="flex items-center justify-center gap-3 bg-dark-choc text-white px-8 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Brand
            </Link>
          </div>

          <div className="p-8">
            {brandsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-dark-choc/40 font-black uppercase tracking-widest text-xs">Syncing Portfolio...</p>
              </div>
            ) : (
              <>
                {brands.length > 0 && (
                  <div className="relative mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/20" />
                    <input
                      type="text"
                      placeholder="Search brands by name or industry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                    />
                  </div>
                )}

                {filteredBrands.length === 0 ? (
                  <div className="py-20 border-2 border-dashed border-dark-choc/5 rounded-3xl">
                    <EmptyState
                      icon={Plus}
                      title={brands.length === 0 ? "Empty Portfolio" : "No Matches Found"}
                      description={
                        brands.length === 0
                          ? "Add your first client brand to showcase your professional reach."
                          : `No results for "${searchQuery}". Try a different term.`
                      }
                    />
                  </div>
                ) : (
                  <>
                    {/* Desktop View */}
                    <div className="hidden lg:block bg-white rounded-2xl border border-dark-choc/5 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-earl-gray/20 text-dark-choc/50 text-[10px] font-black uppercase tracking-[0.2em]">
                          <tr>
                            <th className="px-8 py-6">Brand Identity</th>
                            <th className="px-8 py-6">Industry</th>
                            <th className="px-8 py-6 text-center">Position</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-choc/5">
                          {filteredBrands.map((brand) => (
                            <tr key={brand._id} className="hover:bg-earl-gray/10 group transition-colors">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-xl bg-white border border-dark-choc/10 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    {brand.image?.url ? (
                                      <img src={brand.image.url} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                      <Plus className="w-6 h-6 text-dark-choc/10" />
                                    )}
                                  </div>
                                  <span className="font-black text-dark-choc text-lg group-hover:text-electric-blue transition-colors">{brand.name}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-dark-choc/5 text-dark-choc/60 border border-dark-choc/10">
                                  {brand.category || 'General'}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-center">
                                <span className="font-mono font-black text-dark-choc/20 text-lg">{brand.order || 0}</span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/admin/brands/${brand._id}`}
                                    className="p-3 text-dark-choc/30 hover:text-electric-blue hover:bg-electric-blue/10 rounded-xl transition-all"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteBrand(brand._id, brand.name)}
                                    disabled={deletingBrandId === brand._id}
                                    className="p-3 text-dark-choc/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

                    {/* Mobile/Tablet View */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredBrands.map((brand) => (
                        <div key={brand._id} className="bg-earl-gray/20 rounded-3xl p-6 border border-dark-choc/5 group hover:bg-white hover:shadow-2xl transition-all duration-300">
                          <div className="flex items-center justify-between mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-dark-choc/10 p-3 flex items-center justify-center overflow-hidden shadow-sm">
                              {brand.image?.url ? (
                                <img src={brand.image.url} alt={brand.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <Plus className="w-8 h-8 text-dark-choc/10" />
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/admin/brands/${brand._id}`}
                                className="p-3 bg-white text-dark-choc/40 hover:text-electric-blue rounded-xl shadow-sm transition-all"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteBrand(brand._id, brand.name)}
                                className="p-3 bg-white text-dark-choc/40 hover:text-red-500 rounded-xl shadow-sm transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-dark-choc mb-2">{brand.name}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-dark-choc/40">{brand.category || 'General'}</span>
                              <span className="font-mono text-sm font-black text-electric-blue">#{brand.order || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
          <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                <Quote className="w-6 h-6 rotate-180" />
              </div>
              <div>
                <h2 className="text-xl font-black text-dark-choc">Client Success</h2>
                <p className="text-xs font-black uppercase tracking-widest text-dark-choc/30">Verified client stories</p>
              </div>
            </div>
            <Link
              href="/admin/testimonials/new"
              className="flex items-center justify-center gap-3 bg-dark-choc text-white px-8 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Story
            </Link>
          </div>

          <div className="p-8">
            {testimonialsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-dark-choc/40 font-black uppercase tracking-widest text-xs">Syncing Stories...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="py-20 border-2 border-dashed border-dark-choc/5 rounded-3xl">
                <EmptyState
                  icon={Quote}
                  title="No Success Stories"
                  description="Begin tracking client success to build trust with new leads."
                  actionLabel="Create Testimonial"
                  actionHref="/admin/testimonials/new"
                />
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block bg-white rounded-2xl border border-dark-choc/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-earl-gray/20 text-dark-choc/50 text-[10px] font-black uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-8 py-6">Contributor</th>
                        <th className="px-8 py-6">Organization</th>
                        <th className="px-8 py-6 text-center">Status</th>
                        <th className="px-8 py-6 text-center">Position</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-choc/5">
                      {testimonials.map((testimonial) => (
                        <tr key={testimonial._id} className="hover:bg-earl-gray/10 group transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-earl-gray overflow-hidden shrink-0 border border-dark-choc/10 shadow-sm transition-transform group-hover:scale-110">
                                {testimonial.profileImage?.url ? (
                                  <img src={testimonial.profileImage.url} alt={testimonial.clientName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-dark-choc/20 font-black text-lg">
                                    {testimonial.clientName[0]}
                                  </div>
                                )}
                              </div>
                              <span className="font-black text-dark-choc group-hover:text-electric-blue transition-colors">{testimonial.clientName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-dark-choc/40 font-bold uppercase tracking-widest text-[10px]">{testimonial.company}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <button
                              onClick={() => handleToggleActive(testimonial._id, testimonial.isActive)}
                              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm ${testimonial.isActive
                                ? 'bg-green-500 text-white border-green-600'
                                : 'bg-earl-gray/40 text-dark-choc/40 border-dark-choc/5'
                                }`}
                            >
                              {testimonial.isActive ? 'Live' : 'Hidden'}
                            </button>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="font-mono font-black text-dark-choc/20 text-lg">{testimonial.order || 0}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/testimonials/${testimonial._id}`}
                                className="p-3 text-dark-choc/30 hover:text-electric-blue hover:bg-electric-blue/10 rounded-xl transition-all"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteTestimonial(testimonial._id)}
                                className="p-3 text-dark-choc/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

                {/* Mobile/Tablet View */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="bg-earl-gray/20 rounded-3xl p-8 border border-dark-choc/5 group hover:bg-white hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-dark-choc/10 overflow-hidden shadow-sm p-1">
                            {testimonial.profileImage?.url ? (
                              <img src={testimonial.profileImage.url} alt={testimonial.clientName} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-dark-choc/10 font-black text-2xl">
                                {testimonial.clientName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-dark-choc">{testimonial.clientName}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-dark-choc/40">{testimonial.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleToggleActive(testimonial._id, testimonial.isActive)}
                            className={`p-2 rounded-xl border shadow-sm transition-all flex items-center justify-center ${testimonial.isActive ? 'bg-green-500 text-white border-green-600' : 'bg-white text-dark-choc/20 border-dark-choc/10'}`}
                          >
                            {testimonial.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-dark-choc/5">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/testimonials/${testimonial._id}`}
                            className="bg-white p-3 rounded-xl text-dark-choc/40 hover:text-electric-blue transition-all shadow-sm"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial._id)}
                            className="bg-white p-3 rounded-xl text-dark-choc/40 hover:text-red-500 transition-all shadow-sm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="font-mono text-sm font-black text-electric-blue">
                          RANK #{testimonial.order || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
