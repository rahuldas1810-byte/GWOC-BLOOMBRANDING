'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Upload } from 'lucide-react'

export default function TestimonialForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id !== 'new'

  const [formData, setFormData] = useState({
    quote: '',
    clientName: '',
    company: '',
    profileImage: { url: '', mediaId: '' },
    order: 0,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetchTestimonial()
    }
  }, [id])

  const fetchTestimonial = async () => {
    try {
      // Fetch all testimonials and find the one we need
      // (API doesn't have getTestimonial(id) yet, so use this approach)
      const response = await api.getTestimonials()
      if (response.success && response.data) {
        const testimonial = response.data.find((t: any) => t._id === id)
        if (testimonial) {
          setFormData({
            quote: testimonial.quote || '',
            clientName: testimonial.clientName || '',
            company: testimonial.company || '',
            profileImage: testimonial.profileImage || { url: '', mediaId: '' },
            order: testimonial.order || 0,
            isActive: testimonial.isActive !== undefined ? testimonial.isActive : true,
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch testimonial:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await api.uploadMedia(file, 'testimonials')
      if (response.success && response.data) {
        setFormData({
          ...formData,
          profileImage: {
            url: response.data.url,
            mediaId: response.data._id || response.data.mediaId || '',
          },
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response
      if (isEdit) {
        response = await api.updateTestimonial(id, formData)
      } else {
        response = await api.createTestimonial(formData)
      }

      if (response.success) {
        router.push('/admin/testimonials')
      } else {
        alert(response.message || 'Failed to save testimonial')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-choc mb-8">
        {isEdit ? 'Edit Testimonial' : 'Create Testimonial'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Quote * 
          </label>
          <textarea
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter testimonial quote"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Company *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Profile Image
          </label>
          {formData.profileImage.url ? (
            <div className="mb-4">
              <img
                src={formData.profileImage.url}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          ) : null}
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-dark-choc/30 rounded-lg cursor-pointer hover:border-electric-blue transition-colors">
            <Upload className="w-5 h-5 mr-2 text-dark-choc/60" />
            <span className="text-dark-choc">
              {uploading ? 'Uploading...' : formData.profileImage.url ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-electric-blue rounded focus:ring-electric-blue"
            />
            <span className="text-dark-choc">Active (visible on website)</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Testimonial'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-dark-choc/20 rounded-lg text-dark-choc hover:bg-earl-gray transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}

