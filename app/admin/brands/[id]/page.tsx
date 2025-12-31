'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import Image from 'next/image'
import { Upload, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { toast } from '@/components/admin/Toast'

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
    image: { url: '', mediaId: '' },
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
      const response = await api.getBrand(id)
      if (response.success && response.data) {
        const brand = response.data
        setFormData({
          name: brand.name || '',
          category: brand.category || 'JEWELLERY',
          label: brand.label || '',
          order: brand.order || 0,
            image: brand.image || { url: '', mediaId: '' },
        })
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
            mediaId: response.data._id || response.data.mediaId || '',
          },
        })
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload image')
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
        toast.success(isEdit ? 'Brand updated successfully' : 'Brand created successfully')
        setTimeout(() => {
          router.push('/admin/brands')
        }, 500)
      } else {
        toast.error(response.message || 'Failed to save brand')
      }
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Failed to save brand')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: { url: '', mediaId: '' },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/brands"
          className="p-2 hover:bg-earl-gray rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-dark-choc" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-dark-choc">
            {isEdit ? 'Edit Brand' : 'Create Brand'}
          </h1>
          <p className="text-dark-choc/60 mt-1">
            {isEdit ? 'Update brand information' : 'Add a new brand to your portfolio'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-dark-choc/10 space-y-6">
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
            <div className="mb-4 relative inline-block">
              <img
                src={formData.image.url}
                alt="Brand"
                className="w-40 h-40 object-cover rounded-xl border-2 border-dark-choc/10"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : null}
          <label className={`flex items-center justify-center w-full px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            uploading
              ? 'border-electric-blue bg-electric-blue/5'
              : formData.image.url
              ? 'border-dark-choc/20 hover:border-electric-blue hover:bg-electric-blue/5'
              : 'border-dark-choc/30 hover:border-electric-blue hover:bg-electric-blue/5'
          }`}>
            {uploading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-3 text-dark-choc font-medium">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2 text-dark-choc/60" />
                <span className="text-dark-choc font-medium">
                  {formData.image.url ? 'Change Image' : 'Upload Image'}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {!formData.image.url && (
            <p className="mt-2 text-sm text-dark-choc/50">Image is required for the brand</p>
          )}
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

        <div className="flex gap-4 pt-4 border-t border-dark-choc/10">
          <button
            type="submit"
            disabled={loading || !formData.image.url || !formData.name}
            className="flex-1 bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? 'Update Brand' : 'Create Brand'}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-dark-choc/20 rounded-lg text-dark-choc hover:bg-earl-gray transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

