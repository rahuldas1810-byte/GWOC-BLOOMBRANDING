'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Upload } from 'lucide-react'

export default function ClientForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id !== 'new'

  const [formData, setFormData] = useState({
    name: '',
    logo: { url: '', mediaId: '' },
    category: '',
    order: 0,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetchClient()
    }
  }, [id])

  const fetchClient = async () => {
    try {
      // Fetch all clients and find the one we need
      // (API doesn't have getClient(id) yet, so use this approach)
      const response = await api.getClients()
      if (response.success && response.data) {
        const client = response.data.find((c: any) => c._id === id)
        if (client) {
          setFormData({
            name: client.name || '',
            logo: client.logo || { url: '', mediaId: '' },
            category: client.category || '',
            order: client.order || 0,
            isActive: client.isActive !== undefined ? client.isActive : true,
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch client:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await api.uploadMedia(file, 'clients')
      if (response.success && response.data) {
        setFormData({
          ...formData,
          logo: {
            url: response.data.url,
            mediaId: response.data._id || response.data.mediaId || '',
          },
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload logo')
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
        response = await api.updateClient(id, formData)
      } else {
        response = await api.createClient(formData)
      }

      if (response.success) {
        router.push('/admin/clients')
      } else {
        alert(response.message || 'Failed to save client')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-choc mb-8">
        {isEdit ? 'Edit Client' : 'Create Client'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter category (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Logo
          </label>
          {formData.logo.url ? (
            <div className="mb-4">
              <img
                src={formData.logo.url}
                alt="Logo"
                className="w-32 h-32 object-contain rounded-lg bg-white p-2"
              />
            </div>
          ) : null}
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-dark-choc/30 rounded-lg cursor-pointer hover:border-electric-blue transition-colors">
            <Upload className="w-5 h-5 mr-2 text-dark-choc/60" />
            <span className="text-dark-choc">
              {uploading ? 'Uploading...' : formData.logo.url ? 'Change Logo' : 'Upload Logo'}
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
            {loading ? 'Saving...' : 'Save Client'}
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

