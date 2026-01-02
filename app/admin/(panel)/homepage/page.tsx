'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2 } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'

export default function HomepagePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [homepage, setHomepage] = useState<any>(null)
  const [formData, setFormData] = useState({
    heroHeadline: '',
    heroSubheading: '',
    heroVideo: null as { url: string; mediaId?: string } | null,
    backgroundVideo: null as { url: string; mediaId?: string } | null,
    sectionVideo: null as { url: string; mediaId?: string } | null,
    aboutPreview: '',
    tagline: '',
    servicesPreview: [] as string[],
    sections: {
      hero: { enabled: true, order: 1 },
      about: { enabled: true, order: 2 },
      services: { enabled: true, order: 3 },
      clients: { enabled: true, order: 4 },
      testimonials: { enabled: true, order: 5 },
    },
  })

  useEffect(() => {
    fetchHomepage()
  }, [])

  const fetchHomepage = async () => {
    try {
      const response = await api.getHomepage()
      if (response.success && response.data) {
        const data = response.data
        setHomepage(data)
        setFormData({
          heroHeadline: data.heroHeadline || '',
          heroSubheading: data.heroSubheading || '',
          heroVideo: data.heroVideo?.url ? { url: data.heroVideo.url, mediaId: data.heroVideo.mediaId } : null,
          backgroundVideo: data.backgroundVideo?.url ? { url: data.backgroundVideo.url, mediaId: data.backgroundVideo.mediaId } : null,
          sectionVideo: data.sectionVideo?.url ? { url: data.sectionVideo.url, mediaId: data.sectionVideo.mediaId } : null,
          aboutPreview: data.aboutPreview || '',
          tagline: data.tagline || '',
          servicesPreview: Array.isArray(data.servicesPreview) ? data.servicesPreview : [],
          sections: data.sections || {
            hero: { enabled: true, order: 1 },
            about: { enabled: true, order: 2 },
            services: { enabled: true, order: 3 },
            clients: { enabled: true, order: 4 },
            testimonials: { enabled: true, order: 5 },
          },
        })
      }
    } catch (error) {
      console.error('Failed to fetch homepage:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Ensure all required fields are included
      const payload = {
        heroHeadline: formData.heroHeadline || '',
        heroSubheading: formData.heroSubheading || '',
        heroVideo: formData.heroVideo?.url ? {
          url: formData.heroVideo.url,
          mediaId: formData.heroVideo.mediaId,
        } : null,
        backgroundVideo: formData.backgroundVideo?.url ? {
          url: formData.backgroundVideo.url,
          mediaId: formData.backgroundVideo.mediaId,
        } : null,
        sectionVideo: formData.sectionVideo?.url ? {
          url: formData.sectionVideo.url,
          mediaId: formData.sectionVideo.mediaId,
        } : null,
        aboutPreview: formData.aboutPreview || '',
        tagline: formData.tagline || '',
        servicesPreview: formData.servicesPreview || [],
        sections: formData.sections || {
          hero: { enabled: true, order: 1 },
          about: { enabled: true, order: 2 },
          services: { enabled: true, order: 3 },
          clients: { enabled: true, order: 4 },
          testimonials: { enabled: true, order: 5 },
        },
      }
      
      const response = await api.updateHomepage(payload)
      if (response.success) {
        alert('Homepage updated successfully!')
        fetchHomepage() // Refresh to show updated data
      } else {
        console.error('Update response:', response)
        alert(response.message || 'Failed to update homepage')
      }
    } catch (error: any) {
      console.error('Update failed:', error)
      alert(`Failed to update homepage: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.servicesPreview]
    newServices[index] = value
    setFormData({ ...formData, servicesPreview: newServices })
  }

  const addService = () => {
    setFormData({
      ...formData,
      servicesPreview: [...formData.servicesPreview, ''],
    })
  }

  const removeService = (index: number) => {
    const newServices = formData.servicesPreview.filter((_, i) => i !== index)
    setFormData({ ...formData, servicesPreview: newServices })
  }

  const toggleSection = (section: string) => {
    setFormData({
      ...formData,
      sections: {
        ...formData.sections,
        [section]: {
          ...formData.sections[section as keyof typeof formData.sections],
          enabled: !formData.sections[section as keyof typeof formData.sections].enabled,
        },
      },
    })
  }

  if (loading) {
    return <div className="text-dark-choc">Loading homepage...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-choc">Homepage Content</h1>
        <button
          onClick={handleSave}
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
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">
                Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
                placeholder="Enter headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">
                Subheading
              </label>
              <textarea
                value={formData.heroSubheading}
                onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
                rows={3}
                placeholder="Enter subheading"
              />
            </div>
            <div>
              <MediaSelector
                type="video"
                value={formData.heroVideo}
                onChange={(media) => setFormData({ ...formData, heroVideo: media })}
                label="Hero Video (Intro Video)"
              />
            </div>
            <div>
              <MediaSelector
                type="video"
                value={formData.backgroundVideo}
                onChange={(media) => setFormData({ ...formData, backgroundVideo: media })}
                label="Background Video (Looping Video)"
              />
            </div>
          </div>
        </div>

        {/* About Preview */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">About Preview</h2>
          <div>
            <label className="block text-sm font-medium text-dark-choc mb-2">
              About Text
            </label>
            <textarea
              value={formData.aboutPreview}
              onChange={(e) => setFormData({ ...formData, aboutPreview: e.target.value })}
              className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
              rows={4}
              placeholder="Enter about preview text"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Tagline</h2>
          <div>
            <label className="block text-sm font-medium text-dark-choc mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
              placeholder="Enter tagline"
            />
          </div>
        </div>

        {/* Services Preview */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-dark-choc">Services Preview</h2>
            <button
              onClick={addService}
              className="text-electric-blue hover:underline text-sm"
            >
              + Add Service
            </button>
          </div>
          <div className="space-y-3">
            {formData.servicesPreview.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  placeholder={`Service ${index + 1}`}
                />
                <button
                  onClick={() => removeService(index)}
                  className="text-red-500 hover:text-red-700 px-3 py-2"
                >
                  Remove
                </button>
              </div>
            ))}
            {formData.servicesPreview.length === 0 && (
              <p className="text-dark-choc/60 text-sm">No services added yet.</p>
            )}
          </div>
        </div>

        {/* Section Video */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Section Video</h2>
          <div>
            <MediaSelector
              type="video"
              value={formData.sectionVideo}
              onChange={(media) => setFormData({ ...formData, sectionVideo: media })}
              label="Section Break Video"
            />
          </div>
        </div>

        {/* Section Toggles */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Section Visibility</h2>
          <div className="space-y-3">
            {Object.entries(formData.sections).map(([key, section]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => toggleSection(key)}
                    className="w-4 h-4 text-electric-blue rounded focus:ring-electric-blue"
                  />
                  <span className="text-dark-choc capitalize">{key}</span>
                </label>
                <input
                  type="number"
                  value={section.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        [key]: { ...section, order: parseInt(e.target.value) || 0 },
                      },
                    })
                  }
                  className="w-20 px-2 py-1 border border-dark-choc/20 rounded text-sm"
                  placeholder="Order"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

