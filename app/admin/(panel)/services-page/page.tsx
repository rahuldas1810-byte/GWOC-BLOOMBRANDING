'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'

export default function ServicesPageContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    hero: {
      text: '',
      video: null as { url: string; mediaId?: string } | null,
    },
    backgroundImage: null as { url: string; mediaId?: string } | null,
    statementA: {
      text: '',
    },
    statementB: {
      text: '',
    },
    newsletter: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await api.getServicesPage()
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          hero: {
            text: data.hero?.text || '',
            video: data.hero?.video?.url ? { url: data.hero.video.url, mediaId: data.hero.video.mediaId } : null,
          },
          backgroundImage: data.backgroundImage?.url ? { url: data.backgroundImage.url, mediaId: data.backgroundImage.mediaId } : null,
          statementA: {
            text: data.statementA?.text || '',
          },
          statementB: {
            text: data.statementB?.text || '',
          },
          newsletter: {
            title: data.newsletter?.title || '',
            description: data.newsletter?.description || '',
          },
        })
      }
    } catch (error) {
      console.error('Failed to fetch services page content:', error)
      setSaveStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const payload = {
        hero: {
          text: formData.hero.text,
          video: formData.hero.video ? {
            url: formData.hero.video.url,
            mediaId: formData.hero.video.mediaId,
          } : null,
        },
        backgroundImage: formData.backgroundImage ? {
          url: formData.backgroundImage.url,
          mediaId: formData.backgroundImage.mediaId,
        } : null,
        statementA: {
          text: formData.statementA.text,
        },
        statementB: {
          text: formData.statementB.text,
        },
        newsletter: {
            title: formData.newsletter.title,
            description: formData.newsletter.description
        }
      }

      const response = await api.updateServicesPage(payload)
      if (response.success) {
        setSaveStatus('success')
        await fetchContent()
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 5000)
      }
    } catch (error: any) {
      console.error('Update failed:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-dark-choc">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Services Page Content</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage the global sections displayed on the Services page</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-electric-blue text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-electric-blue/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium w-full sm:w-auto text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {saveStatus === 'success' && (
            <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Changes saved successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Failed to save changes. Please try again.</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          
          {/* SECTION 1 - HERO (TEXT + VIDEO) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Hero Section</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="block text-sm font-semibold text-dark-choc mb-2">Hero Text (Left)</label>
                   <textarea
                    value={formData.hero.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, text: e.target.value } }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all min-h-[150px]"
                    placeholder="Enter the main hero text..."
                   />
                </div>
                <div>
                   <MediaSelector
                     type="video"
                     value={formData.hero.video || undefined}
                     onChange={(media) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, video: media } }))}
                     label="Hero Video (Right)"
                   />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 - BACKGROUND IMAGE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Background Image</h2>
            </div>
            <div className="space-y-5">
              <div>
                <MediaSelector
                  type="image"
                  value={formData.backgroundImage || undefined}
                  onChange={(media) => setFormData(prev => ({ ...prev, backgroundImage: media }))}
                  label="Full Width Background Image"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 - STATEMENT TEXT (BLOCK A) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Statement Text (Block A)</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Statement Text</label>
                <textarea
                  value={formData.statementA.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, statementA: { ...prev.statementA, text: e.target.value } }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4 - STATEMENT TEXT (BLOCK B) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Statement Text (Block B)</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Statement Text</label>
                <textarea
                  value={formData.statementB.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, statementB: { ...prev.statementB, text: e.target.value } }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

           {/* SECTION 5 - NEWSLETTER TEXT */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Newsletter Section</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-dark-choc mb-2">Title</label>
                    <input 
                      type="text" 
                      value={formData.newsletter.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, newsletter: { ...prev.newsletter, title: e.target.value } }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-semibold text-dark-choc mb-2">Description</label>
                    <input 
                      type="text" 
                      value={formData.newsletter.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, newsletter: { ...prev.newsletter, description: e.target.value } }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                    />
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
