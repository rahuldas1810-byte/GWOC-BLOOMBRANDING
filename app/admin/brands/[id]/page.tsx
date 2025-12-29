'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import Image from 'next/image'
import { Upload } from 'lucide-react'

export default function BrandForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id !== 'new'

  const [formData, setFormData] = useState({
    name: '',
    category: 'JEWELLERY',
    label: '',
    order: 0,
    image: { url: '', publicId: '' },
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetchBrand()
    }
  }, [id])

  const fetchBrand = async () => {
    try {
      // For editing, we should have a GET /api/brands/:id endpoint
      // For now, fetch all and find the one we need
      const response = await api.getBrands()
      if (response.success && response.data) {
        const brand = response.data.find((b: any) => b._id === id)
        if (brand) {
          setFormData({
            name: brand.name,
            category: brand.category,
            label: brand.label || '',
            order: brand.order || 0,
            image: brand.image || { url: '', publicId: '' },
          })
        }
      } else {
        console.error('Failed to fetch brand:', response.message)
      }
    } catch (error) {
      console.error('Failed to fetch brand:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await api.uploadMedia(file, 'brands')
      if (response.success && response.data) {
        setFormData({
          ...formData,
          image: {
            url: response.data.url,
            publicId: response.data.publicId,
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
        response = await api.updateBrand(id, formData)
      } else {
        response = await api.createBrand(formData)
      }

      if (response.success) {
        router.push('/admin/brands')
      } else {
        alert(response.message || 'Failed to save brand')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save brand')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-choc mb-8">
        {isEdit ? 'Edit Brand' : 'Create Brand'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
          >
            <option value="JEWELLERY">Jewellery</option>
            <option value="FASHION">Fashion</option>
            <option value="CAFE & RESTAURANTS">Cafe & Restaurants</option>
            <option value="HOME FURNISHING">Home Furnishing</option>
            <option value="LIFESTYLE">Lifestyle</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Label
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Image *
          </label>
          {formData.image.url ? (
            <div className="mb-4">
              <img
                src={formData.image.url}
                alt="Brand"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          ) : null}
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-dark-choc/30 rounded-lg cursor-pointer hover:border-electric-blue transition-colors">
            <Upload className="w-5 h-5 mr-2 text-dark-choc/60" />
            <span className="text-dark-choc">
              {uploading ? 'Uploading...' : formData.image.url ? 'Change Image' : 'Upload Image'}
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
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !formData.image.url}
            className="flex-1 bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Brand'}
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
  )
}

