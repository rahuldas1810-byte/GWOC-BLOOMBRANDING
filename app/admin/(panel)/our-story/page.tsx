'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2, Plus, Trash2, Heart, Sparkles, User, FileText } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'
import { toast } from '@/components/admin/Toast'

export default function OurStoryPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteSettings, setSiteSettings] = useState<any>(null)

  const [formData, setFormData] = useState({
    hero: {
      headline: '',
      subheadline: '',
      description: '',
      image: null as any,
    },
    purpose: {
      eyebrow: '',
      title: '',
      description: '',
      details: [{ label: '', value: '', order: 0 }],
    },
    philosophyCards: [{ title: '', description: '', icon: '', order: 0 }],
    // From SiteSettings
    ourStoryAdditional: {
      whoWeAreLabel: 'Who We Are',
      additionalParagraph: '',
    }
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [storyRes, settingsRes] = await Promise.all([
        api.getOurStory(),
        api.getSiteSettings()
      ])

      if (storyRes.success && storyRes.data) {
        setFormData(prev => ({
          ...prev,
          hero: storyRes.data.hero || prev.hero,
          purpose: storyRes.data.purpose || prev.purpose,
          philosophyCards: storyRes.data.philosophyCards || prev.philosophyCards,
        }))
      }

      if (settingsRes.success && settingsRes.data) {
        setSiteSettings(settingsRes.data)
        setFormData(prev => ({
          ...prev,
          ourStoryAdditional: settingsRes.data.ourStoryAdditional || prev.ourStoryAdditional,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load story content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const storyPayload = {
        hero: formData.hero,
        purpose: formData.purpose,
        philosophyCards: formData.philosophyCards,
      }

      const settingsPayload = {
        ...siteSettings,
        ourStoryAdditional: formData.ourStoryAdditional
      }

      const [storyRes, settingsRes] = await Promise.all([
        api.updateOurStory(storyPayload),
        api.updateSiteSettings(settingsPayload)
      ])

      if (storyRes.success && settingsRes.success) {
        toast.success('Our Story page updated successfully!')
      } else {
        toast.error('Some updates failed to save')
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const addDetail = () => {
    setFormData({
      ...formData,
      purpose: {
        ...formData.purpose,
        details: [...formData.purpose.details, { label: '', value: '', order: formData.purpose.details.length }],
      },
    })
  }

  const updateDetail = (index: number, field: string, value: string | number) => {
    const newDetails = [...formData.purpose.details]
    newDetails[index] = { ...newDetails[index], [field]: value }
    setFormData({
      ...formData,
      purpose: { ...formData.purpose, details: newDetails },
    })
  }

  const removeDetail = (index: number) => {
    const newDetails = formData.purpose.details.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      purpose: { ...formData.purpose, details: newDetails },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-screen py-12">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        <span className="ml-3 text-dark-choc font-medium">Loading our story...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Our Story Management</h1>
          <p className="text-dark-choc/60 text-sm sm:text-base">Control the narrative and brand statistics.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-dark-choc text-white px-8 py-3 rounded-xl hover:bg-dark-choc/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6 pb-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-electric-blue" />
              Hero Narrative
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Main Headline</label>
                <input
                  type="text"
                  value={formData.hero.headline}
                  onChange={e => setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc text-lg"
                  placeholder="e.g. Crafted for Connection"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Subheadline</label>
                <input
                  type="text"
                  value={formData.hero.subheadline}
                  onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="Supporting tagline..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Narrative Description</label>
                <textarea
                  value={formData.hero.description}
                  onChange={e => setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-48 resize-none"
                  placeholder="Type the full story here..."
                />
              </div>
            </div>
            <div>
              <MediaSelector
                type="image"
                value={formData.hero.image}
                onChange={img => setFormData({ ...formData, hero: { ...formData.hero, image: img } })}
                label="Hero Featured Image"
              />
            </div>
          </div>
        </div>

        {/* Who We Are Labels */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
              <User className="w-5 h-5 text-electric-blue" />
              "Who We Are" Labels
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Section Eyebrow</label>
              <input
                type="text"
                value={formData.ourStoryAdditional.whoWeAreLabel}
                onChange={e => setFormData({ ...formData, ourStoryAdditional: { ...formData.ourStoryAdditional, whoWeAreLabel: e.target.value } })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Additional Brand Paragraph</label>
              <textarea
                value={formData.ourStoryAdditional.additionalParagraph}
                onChange={e => setFormData({ ...formData, ourStoryAdditional: { ...formData.ourStoryAdditional, additionalParagraph: e.target.value } })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-24 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
              <Heart className="w-5 h-5 text-electric-blue" />
              Purpose & Statistics
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Purpose Eyebrow</label>
                  <input
                    type="text"
                    value={formData.purpose.eyebrow}
                    onChange={e => setFormData({ ...formData, purpose: { ...formData.purpose, eyebrow: e.target.value } })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Purpose Title</label>
                  <input
                    type="text"
                    value={formData.purpose.title}
                    onChange={e => setFormData({ ...formData, purpose: { ...formData.purpose, title: e.target.value } })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc text-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Detailed Description</label>
                <textarea
                  value={formData.purpose.description}
                  onChange={e => setFormData({ ...formData, purpose: { ...formData.purpose, description: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-40 resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-dark-choc/40">Stats & Accomplishments</h3>
                <button
                  onClick={addDetail}
                  className="flex items-center gap-2 text-electric-blue hover:text-dark-choc transition-colors font-black text-xs uppercase tracking-[0.2em]"
                >
                  <Plus className="w-4 h-4" /> Add Stat
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.purpose.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-earl-gray/10 p-5 rounded-2xl border border-dark-choc/5 group transition-all hover:bg-white hover:shadow-md">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={detail.label}
                        onChange={e => updateDetail(idx, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-full bg-transparent border-0 outline-none font-bold text-dark-choc py-1 text-sm"
                      />
                      <input
                        type="text"
                        value={detail.value}
                        onChange={e => updateDetail(idx, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-full bg-transparent border-0 outline-none font-black text-electric-blue py-1"
                      />
                    </div>
                    <button
                      onClick={() => removeDetail(idx)}
                      className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                <FileText className="w-5 h-5 text-electric-blue" />
                Philosophy Cards
              </h2>
              <button
                onClick={() => setFormData({ ...formData, philosophyCards: [...formData.philosophyCards, { title: '', description: '', icon: '', order: formData.philosophyCards.length }] })}
                className="flex items-center gap-2 text-electric-blue hover:text-dark-choc transition-colors font-black text-xs uppercase tracking-[0.2em]"
              >
                <Plus className="w-4 h-4" /> Add Card
              </button>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.philosophyCards.map((card, idx) => (
              <div key={idx} className="p-6 bg-earl-gray/10 rounded-2xl border border-dark-choc/5 relative group transition-all hover:bg-white hover:shadow-lg">
                <button
                  onClick={() => setFormData({ ...formData, philosophyCards: formData.philosophyCards.filter((_, i) => i !== idx) })}
                  className="absolute top-4 right-4 p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={card.title}
                    onChange={e => {
                      const updated = [...formData.philosophyCards]
                      updated[idx].title = e.target.value
                      setFormData({ ...formData, philosophyCards: updated })
                    }}
                    placeholder="Core Principle Title"
                    className="w-full bg-transparent border-0 outline-none font-black text-dark-choc py-2 text-lg focus:text-electric-blue transition-colors"
                  />
                  <textarea
                    value={card.description}
                    onChange={e => {
                      const updated = [...formData.philosophyCards]
                      updated[idx].description = e.target.value
                      setFormData({ ...formData, philosophyCards: updated })
                    }}
                    placeholder="Describe this philosophy..."
                    className="w-full bg-transparent border-0 outline-none font-medium h-32 resize-none text-sm text-dark-choc/60"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
