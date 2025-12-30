'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Upload, Video, Image as ImageIcon } from 'lucide-react'

export default function BannerForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id !== 'new'

  const [formData, setFormData] = useState({
    type: 'hero' as 'hero' | 'section' | 'background',
    title: '',
    subtitle: '',
    text: '',
    image: { url: '', mediaId: '' },
    video: { url: '', mediaId: '' },
    order: 0,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetchBanner()
    }
  }, [id])

  const fetchBanner = async () => {
    try {
      // Fetch all banners and find the one we need
      // (API doesn't have getBanner(id) yet, so use this approach)
      const response = await api.getBanners()
      if (response.success && response.data) {
        const banner = response.data.find((b: any) => b._id === id)
        if (banner) {
          setFormData({
            type: banner.type || 'hero',
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            text: banner.text || '',
            image: banner.image || { url: '', mediaId: '' },
            video: banner.video || { url: '', mediaId: '' },
            order: banner.order || 0,
            isActive: banner.isActive !== undefined ? banner.isActive : true,
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch banner:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const response = await api.uploadMedia(file, 'banners')
      if (response.success && response.data) {
        setFormData({
          ...formData,
          image: {
            url: response.data.url,
            mediaId: response.data._id || response.data.mediaId || '',
          },
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    try {
      const response = await api.uploadMedia(file, 'banners')
      if (response.success && response.data) {
        setFormData({
          ...formData,
          video: {
            url: response.data.url,
            mediaId: response.data._id || response.data.mediaId || '',
          },
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload video')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response
      if (isEdit) {
        response = await api.updateBanner(id, formData)
      } else {
        response = await api.createBanner(formData)
      }

      if (response.success) {
        router.push('/admin/banners')
      } else {
        alert(response.message || 'Failed to save banner')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-choc mb-8">
        {isEdit ? 'Edit Banner' : 'Create Banner'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Banner Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'hero' | 'section' | 'background' })}
            required
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
          >
            <option value="hero">Hero</option>
            <option value="section">Section</option>
            <option value="background">Background</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter banner title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter banner subtitle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Text Content
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue"
            placeholder="Enter banner text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Image
          </label>
          {formData.image.url ? (
            <div className="mb-4">
              <img
                src={formData.image.url}
                alt="Banner"
                className="w-48 h-32 object-cover rounded-lg"
              />
            </div>
          ) : null}
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-dark-choc/30 rounded-lg cursor-pointer hover:border-electric-blue transition-colors">
            <ImageIcon className="w-5 h-5 mr-2 text-dark-choc/60" />
            <span className="text-dark-choc">
              {uploadingImage ? 'Uploading...' : formData.image.url ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-choc mb-2">
            Video
          </label>
          {formData.video.url ? (
            <div className="mb-4">
              <video
                src={formData.video.url}
                className="w-48 h-32 object-cover rounded-lg"
                controls
              />
            </div>
          ) : null}
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-dark-choc/30 rounded-lg cursor-pointer hover:border-electric-blue transition-colors">
            <Video className="w-5 h-5 mr-2 text-dark-choc/60" />
            <span className="text-dark-choc">
              {uploadingVideo ? 'Uploading...' : formData.video.url ? 'Change Video' : 'Upload Video'}
            </span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              disabled={uploadingVideo}
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
            {loading ? 'Saving...' : 'Save Banner'}
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

