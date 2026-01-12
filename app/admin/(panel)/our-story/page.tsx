'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'

export default function OurStoryPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    heroLabel: '',
    heroTitle: '',
    heroSubtitle: '',
    heroBackgroundImage: null as { url: string; mediaId?: string } | null,
    purposeTitle: '',
    purposeDescription: '',
    purposeImage: null as { url: string; mediaId?: string } | null,
    purposeStats: {
      brandsBuilt: 30,
      satisfaction: 100,
    },
    philosophyTitle: '',
    philosophyDescription: '',
    philosophyCards: [] as { id: string; title: string; description: string; icon?: string }[],
  })

  useEffect(() => {
    fetchOurStory()
  }, [])

  const fetchOurStory = async () => {
    try {
      setLoading(true)
      const response = await api.getOurStory()
      if (response.success && response.data) {
        const data = response.data

        // Properly handle purposeStats - ensure numbers are preserved
        const purposeStats = data.purposeStats && typeof data.purposeStats === 'object'
          ? {
            brandsBuilt: Number(data.purposeStats.brandsBuilt) || 0,
            satisfaction: Number(data.purposeStats.satisfaction) || 0,
          }
          : { brandsBuilt: 30, satisfaction: 100 }

        setFormData({
          heroLabel: data.heroLabel || '',
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          heroBackgroundImage: data.heroBackgroundImage?.url ? { url: data.heroBackgroundImage.url, mediaId: data.heroBackgroundImage.mediaId } : null,
          purposeTitle: data.purposeTitle || '',
          purposeDescription: data.purposeDescription || '',
          purposeImage: data.purposeImage?.url ? { url: data.purposeImage.url, mediaId: data.purposeImage.mediaId } : null,
          purposeStats: purposeStats,
          philosophyTitle: data.philosophyTitle || '',
          philosophyDescription: data.philosophyDescription || '',
          philosophyCards: Array.isArray(data.philosophyCards) && data.philosophyCards.length > 0
            ? data.philosophyCards.map((card: any) => ({
              id: card.id || '',
              title: card.title || '',
              description: card.description || '',
              icon: card.icon || '',
            }))
            : [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch our story:', error)
      setSaveStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      // Ensure purposeStats is properly structured with numbers
      const payload = {
        heroLabel: formData.heroLabel || '',
        heroTitle: formData.heroTitle || '',
        heroSubtitle: formData.heroSubtitle || '',
        heroBackgroundImage: formData.heroBackgroundImage?.url ? {
          url: formData.heroBackgroundImage.url,
          mediaId: formData.heroBackgroundImage.mediaId,
        } : null,
        purposeTitle: formData.purposeTitle || '',
        purposeDescription: formData.purposeDescription || '',
        purposeImage: formData.purposeImage?.url ? {
          url: formData.purposeImage.url,
          mediaId: formData.purposeImage.mediaId,
        } : null,
        purposeStats: {
          brandsBuilt: Number(formData.purposeStats.brandsBuilt) || 0,
          satisfaction: Number(formData.purposeStats.satisfaction) || 0,
        },
        philosophyTitle: formData.philosophyTitle || '',
        philosophyDescription: formData.philosophyDescription || '',
        philosophyCards: formData.philosophyCards.map((card, index) => ({
          id: card.id || String(index + 1).padStart(2, '0'),
          title: card.title || '',
          description: card.description || '',
          icon: card.icon || '',
        })),
      }

      const response = await api.updateOurStory(payload)
      if (response.success) {
        setSaveStatus('success')
        // Refresh data after save to show updated content
        await fetchOurStory()
        // Clear success message after 3 seconds
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

  const addPhilosophyCard = () => {
    setFormData({
      ...formData,
      philosophyCards: [...formData.philosophyCards, { id: '', title: '', description: '' }],
    })
  }

  const updatePhilosophyCard = (index: number, field: string, value: string) => {
    const newCards = [...formData.philosophyCards]
    newCards[index] = { ...newCards[index], [field]: value }
    setFormData({ ...formData, philosophyCards: newCards })
  }

  const removePhilosophyCard = (index: number) => {
    setFormData({
      ...formData,
      philosophyCards: formData.philosophyCards.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-dark-choc">Loading Our Story content...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Our Story Content</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage the content displayed on the Our Story page</p>
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
              <span className="text-sm font-medium">Changes saved successfully! The main site will update shortly.</span>
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
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Hero Section</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Label</label>
                <input
                  type="text"
                  value={formData.heroLabel}
                  onChange={(e) => setFormData({ ...formData, heroLabel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="Established 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Title</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="OUR STORY"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Subtitle</label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="Building brands that leave a legacy..."
                />
              </div>
              <div>
                <MediaSelector
                  type="image"
                  value={formData.heroBackgroundImage || undefined}
                  onChange={(media) => setFormData({ ...formData, heroBackgroundImage: media })}
                  label="Hero Background Image"
                />
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
              <h2 className="text-2xl font-bold text-dark-choc">Purpose Section</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Title</label>
                <input
                  type="text"
                  value={formData.purposeTitle}
                  onChange={(e) => setFormData({ ...formData, purposeTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="A studio built on clarity."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Description</label>
                <textarea
                  value={formData.purposeDescription}
                  onChange={(e) => setFormData({ ...formData, purposeDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Bloom Branding is a strategic branding agency..."
                />
              </div>
              <div>
                <MediaSelector
                  type="image"
                  value={formData.purposeImage || undefined}
                  onChange={(media) => setFormData({ ...formData, purposeImage: media })}
                  label="Purpose Image"
                />
              </div>

              {/* Stats Section */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-dark-choc mb-4">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-dark-choc mb-2">
                      Brands Built
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.purposeStats.brandsBuilt}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
                        if (!isNaN(value) && value >= 0) {
                          setFormData({
                            ...formData,
                            purposeStats: { ...formData.purposeStats, brandsBuilt: value },
                          })
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all bg-white font-semibold text-dark-choc"
                    />
                    <p className="text-xs text-gray-500 mt-1">This number will be displayed on the main site</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-choc mb-2">
                      Satisfaction %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.purposeStats.satisfaction}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          setFormData({
                            ...formData,
                            purposeStats: { ...formData.purposeStats, satisfaction: value },
                          })
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all bg-white font-semibold text-dark-choc"
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage (0-100)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-electric-blue rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-dark-choc">Philosophy Section</h2>
              </div>
              <button
                onClick={addPhilosophyCard}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Title</label>
                <input
                  type="text"
                  value={formData.philosophyTitle}
                  onChange={(e) => setFormData({ ...formData, philosophyTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="Our Philosophy"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-choc mb-2">Description</label>
                <textarea
                  value={formData.philosophyDescription}
                  onChange={(e) => setFormData({ ...formData, philosophyDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="We believe in building brands..."
                />
              </div>

              {/* Philosophy Cards */}
              {formData.philosophyCards.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-dark-choc">Philosophy Cards</h3>
                  {formData.philosophyCards.map((card, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-dark-choc">Card {index + 1}</span>
                        <button
                          onClick={() => removePhilosophyCard(index)}
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={card.id || ''}
                          onChange={(e) => updatePhilosophyCard(index, 'id', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all bg-white"
                          placeholder="Card ID (e.g., 01, 02, 03)"
                        />
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updatePhilosophyCard(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all bg-white"
                          placeholder="Card Title"
                        />
                        <textarea
                          value={card.description}
                          onChange={(e) => updatePhilosophyCard(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none bg-white"
                          rows={2}
                          placeholder="Card Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {formData.philosophyCards.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm">No philosophy cards added yet.</p>
                  <p className="text-xs mt-1">Click "Add Card" to create one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
