'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await api.getTestimonials()
      if (response.success && response.data) {
        setTestimonials(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateTestimonial(id, { isActive: !currentStatus })
      if (response.success) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await api.deleteTestimonial(id)
      if (response.success) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading testimonials...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-choc">Testimonials</h1>
          <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-earl-gray">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Client</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Company</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Quote</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Order</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-choc/10">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-dark-choc/60">
                  No testimonials found. Create your first testimonial!
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-earl-gray/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {testimonial.profileImage?.url && (
                        <img
                          src={testimonial.profileImage.url}
                          alt={testimonial.clientName}
                          className="w-12 h-12 object-cover rounded-full"
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
                      className={`px-2 py-1 text-xs rounded ${
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
                        className={`p-2 rounded transition-colors ${
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
                        className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
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
  )
}

