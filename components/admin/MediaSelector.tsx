'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Image as ImageIcon, Video, X, Upload } from 'lucide-react'

interface MediaSelectorProps {
  type: 'image' | 'video' | 'both'
  value?: { url: string; mediaId?: string }
  onChange: (media: { url: string; mediaId?: string } | null) => void
  label?: string
}

export default function MediaSelector({ type, value, onChange, label }: MediaSelectorProps) {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSelector, setShowSelector] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const filter: any = { limit: 100 }
      if (type === 'image') filter.type = 'image'
      if (type === 'video') filter.type = 'video'

      const response = await api.getMedia(filter)
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
      // Determine folder based on type
      const folder = type === 'video' ? 'bloom-branding/videos' : 'bloom-branding/images'
      const isVideo = selectedFile.type.startsWith('video/')
      const usedIn = isVideo ? 'video' : 'image'

      const response = await api.uploadMedia(selectedFile, folder, '', '', usedIn)
      if (response.success && response.data) {
        const newMedia = {
          url: response.data.url,
          mediaId: response.data._id,
        }
        onChange(newMedia)
        setSelectedFile(null)
        fetchMedia()
        setShowSelector(false)
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

  const handleSelect = (item: any) => {
    onChange({
      url: item.url,
      mediaId: item._id,
    })
    setShowSelector(false)
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-dark-choc mb-2">
          {label}
        </label>
      )}

      {/* Selected Media Preview */}
      {value?.url && (
        <div className="relative group">
          {type === 'image' || (type === 'both' && value.url.match(/\.(jpg|jpeg|png|gif|webp)/i)) ? (
            <img
              src={value.url}
              alt="Selected"
              className="w-full h-48 object-cover rounded-lg border border-dark-choc/20"
            />
          ) : (
            <div className="w-full h-48 bg-dark-choc/10 rounded-lg border border-dark-choc/20 relative overflow-hidden group">
              <video
                src={value.url}
                className="w-full h-full object-cover"
                controls
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Video className="w-12 h-12 text-white/30" />
              </div>
            </div>
          )}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selector Button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className="flex-1 px-4 py-2 border border-dark-choc/20 rounded-lg hover:border-electric-blue transition-colors text-dark-choc"
        >
          {value?.url ? 'Change Media' : 'Select Media'}
        </button>
        {!value?.url && (
          <label className="px-4 py-2 border border-dark-choc/20 rounded-lg hover:border-electric-blue transition-colors text-dark-choc cursor-pointer">
            <Upload className="w-4 h-4 inline mr-2" />
            Upload
            <input
              type="file"
              accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Upload Preview */}
      {selectedFile && !value?.url && (
        <div className="p-4 border border-dark-choc/20 rounded-lg bg-white">
          <p className="text-sm text-dark-choc mb-2">Selected: {selectedFile.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload & Use'}
          </button>
        </div>
      )}

      {/* Media Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-choc/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-dark-choc">Select Media</h3>
              <button
                onClick={() => setShowSelector(false)}
                className="p-2 hover:bg-dark-choc/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-dark-choc" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="text-center text-dark-choc/60 py-12">Loading media...</div>
              ) : media.length === 0 ? (
                <div className="text-center text-dark-choc/60 py-12">No media available</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(item)}
                      className="relative group border-2 border-transparent hover:border-electric-blue rounded-lg overflow-hidden transition-colors"
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.originalName}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-dark-choc/10 flex items-center justify-center">
                          <Video className="w-8 h-8 text-dark-choc/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Select
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


