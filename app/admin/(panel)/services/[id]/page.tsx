'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Save, Loader2, X } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'

export default function ServiceForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id !== 'new'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: [] as string[],
    images: [] as { url: string; mediaId?: string }[],
    order: 0,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetchService()
    }
  }, [id])

  const fetchService = async () => {
    try {
      const response = await api.getService(id)
      if (response.success && response.data) {
        const service = response.data
        setFormData({
          title: service.title || '',
          description: service.description || '',
          details: service.details || [],
          images: service.images || [],
          order: service.order || 0,
          isActive: service.isActive !== undefined ? service.isActive : true,
        })
      }
    } catch (error) {
      console.error('Failed to fetch service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, ''],
    })
  }

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...formData.details]
    newDetails[index] = value
    setFormData({ ...formData, details: newDetails })
  }

  const handleRemoveDetail = (index: number) => {
    setFormData({
      ...formData,
      details: formData.details.filter((_, i) => i !== index),
    })
  }

  const handleAddImage = (media: { url: string; mediaId?: string } | null) => {
    if (media) {
      setFormData({
        ...formData,
        images: [...formData.images, media],
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let response
      if (isEdit) {
        response = await api.updateService(id, formData)
      } else {
        response = await api.createService(formData)
      }

      if (response.success) {
        router.push('/admin/services')
      } else {
        alert(response.message || 'Failed to save service')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading service...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-choc">
            {isEdit ? 'Edit Service' : 'Create Service'}
          </h1>
          <button
            onClick={() => router.push('/admin/services')}
            className="text-dark-choc hover:text-dark-choc/70"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  placeholder="Brand Identity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  placeholder="Complete visual identity systems that define who you are."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-electric-blue rounded"
                    />
                    <span className="text-sm font-medium text-dark-choc">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">Details (What's Included)</h2>
            <div className="space-y-3">
              {formData.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-dark-choc/20 rounded-lg"
                    placeholder={`Detail ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDetail}
                className="text-electric-blue hover:underline text-sm"
              >
                + Add Detail
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">Images</h2>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Service image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-dark-choc/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <MediaSelector
                type="image"
                value={undefined}
                onChange={handleAddImage}
                label="Add Image"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? 'Update Service' : 'Create Service'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/services')}
              className="px-6 py-3 border border-dark-choc/20 rounded-lg hover:bg-earl-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

