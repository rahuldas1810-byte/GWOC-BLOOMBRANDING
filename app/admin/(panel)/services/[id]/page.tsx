'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Save, Loader2, X } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'

type ServiceImage = {
  url: string
  mediaId?: string
}

type ServiceFormData = {
  title: string
  description: string
  details: string[]
  images: ServiceImage[]
  order: number
  isActive: boolean
}

export default function ServiceForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id !== 'new'

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    details: [],
    images: [],
    order: 0,
    isActive: true,
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  const fetchService = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.getService(id)

      if (response?.success && response.data) {
        const service = response.data

        setFormData({
          title: service.title ?? '',
          description: service.description ?? '',
          details: Array.isArray(service.details) ? service.details : [],
          images: Array.isArray(service.images) ? service.images : [],
          order: typeof service.order === 'number' ? service.order : 0,
          isActive: service.isActive ?? true,
        })
      }
    } catch (error) {
      console.error('Failed to fetch service:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (isEdit) {
      fetchService()
    }
  }, [isEdit, fetchService])

  const handleAddDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, ''],
    }))
  }

  const handleDetailChange = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.details]
      updated[index] = value
      return { ...prev, details: updated }
    })
  }

  const handleRemoveDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }))
  }

  const handleAddImage = (media: ServiceImage | null) => {
    if (!media) return
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, media],
    }))
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = isEdit
        ? await api.updateService(id, formData)
        : await api.createService(formData)

      if (response?.success) {
        router.push('/admin/services')
      } else {
        alert(response?.message ?? 'Failed to save service')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-dark-choc p-6">Loading service…</div>
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
          {/* BASIC INFO */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                required
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder="Service title"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Service description"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {formData.details.map((detail, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  value={detail}
                  onChange={e => handleDetailChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(index)}
                >
                  <X />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddDetail}>
              + Add Detail
            </button>
          </div>

          {/* IMAGES */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {formData.images.map((image, index) => (
              <div key={index} className="relative mb-4">
                <img
                  src={image.url}
                  alt={`Service ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X />
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

          <button
            type="submit"
            disabled={saving}
            className="bg-electric-blue text-white px-6 py-3 rounded-lg"
          >
            {saving ? 'Saving…' : isEdit ? 'Update Service' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  )
}
