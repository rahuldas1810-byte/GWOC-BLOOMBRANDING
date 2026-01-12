'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Upload, Trash2, Image as ImageIcon, Video } from 'lucide-react'

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await api.getMedia({ limit: 100 })
      if (response.success && response.data) {
        setMedia(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const response = await api.uploadMedia(selectedFile)
      if (response.success) {
        setSelectedFile(null)
        fetchMedia()
      } else {
        alert(response.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await api.deleteMedia(id)
      if (response.success) {
        fetchMedia()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading media...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-6 sm:mb-8">Media Manager</h1>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-dark-choc/10 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-dark-choc mb-4">Upload Media</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <label className="flex-1 flex items-center justify-center px-4 py-4 sm:py-3 border-2 border-dashed border-dark-choc/30 rounded-lg cursor-pointer hover:border-electric-blue transition-colors min-h-[60px]">
              <Upload className="w-5 h-5 mr-2 text-dark-choc/60 flex-shrink-0" />
              <span className="text-dark-choc text-sm sm:text-base truncate">
                {selectedFile ? selectedFile.name : 'Select File'}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base font-medium"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {media.length === 0 ? (
            <div className="col-span-full text-center text-dark-choc/60 py-12 bg-white rounded-lg shadow-md border border-dark-choc/10">
              No media files. Upload your first file!
            </div>
          ) : (
            media.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden group"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-36 sm:h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 sm:h-48 bg-dark-choc/10 flex items-center justify-center">
                    <Video className="w-10 sm:w-12 h-10 sm:h-12 text-dark-choc/40" />
                  </div>
                )}
                <div className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-dark-choc truncate mb-2">{item.originalName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-choc/60 capitalize">{item.type}</span>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url)}
                    className="mt-2 w-full text-xs sm:text-sm text-electric-blue hover:underline py-1"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

