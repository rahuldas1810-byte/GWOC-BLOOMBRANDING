'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import {
  Save, Loader2, Plus, Edit, Trash2, Eye, EyeOff, Layout,
  ImageIcon, Quote, BarChart3, Settings2, Video, MousePointer2
} from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'
import Link from 'next/link'
import { toast } from '@/components/admin/Toast'

export default function HomepagePage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'brands' | 'testimonials' | 'stats' | 'visibility'>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Data State
  const [allTestimonials, setAllTestimonials] = useState<any[]>([])
  const [allBrands, setAllBrands] = useState<any[]>([])
  const [siteSettings, setSiteSettings] = useState<any>(null)

  // Form State (Combined Homepage + Settings)
  const [formData, setFormData] = useState({
    heroHeadline: '',
    heroSubheading: '',
    heroVideo: null as any,
    backgroundVideo: null as any,
    sectionVideo: null as any,
    tagline: '',
    homepageTestimonialIds: [] as string[],
    testimonialsLabel: 'Testimonials',
    testimonialsHeading: 'What Clients Say',
    sections: {
      hero: { enabled: true, order: 1 },
      about: { enabled: true, order: 2 },
      services: { enabled: true, order: 3 },
      clients: { enabled: true, order: 4 },
      testimonials: { enabled: true, order: 5 },
    },
    // From SiteSettings
    experienceStats: {
      years: 0,
      clients: 0,
      projects: 0
    },
    homepageSections: {
      clientsLabel: '',
      clientsTitle: ''
    }
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [homeRes, testiRes, brandsRes, settingsRes] = await Promise.all([
        api.getHomepage(),
        api.getTestimonials(),
        api.getBrands(),
        api.getSiteSettings()
      ])

      if (homeRes.success && homeRes.data) {
        const data = homeRes.data
        setFormData(prev => ({
          ...prev,
          heroHeadline: data.heroHeadline || '',
          heroSubheading: data.heroSubheading || '',
          heroVideo: data.heroVideo || null,
          backgroundVideo: data.backgroundVideo || null,
          sectionVideo: data.sectionVideo || null,
          tagline: data.tagline || '',
          homepageTestimonialIds: data.homepageTestimonialIds || [],
          testimonialsLabel: data.testimonialsLabel || 'Testimonials',
          testimonialsHeading: data.testimonialsHeading || 'What Clients Say',
          sections: data.sections || prev.sections
        }))
      }

      if (testiRes.success) setAllTestimonials(testiRes.data)
      if (brandsRes.success) setAllBrands(brandsRes.data)

      if (settingsRes.success && settingsRes.data) {
        setSiteSettings(settingsRes.data)
        setFormData(prev => ({
          ...prev,
          experienceStats: settingsRes.data.experienceStats || prev.experienceStats,
          homepageSections: settingsRes.data.homepageSections || prev.homepageSections
        }))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load homepage data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // 1. Update Homepage Content
      const homePayload = {
        heroHeadline: formData.heroHeadline,
        heroSubheading: formData.heroSubheading,
        heroVideo: formData.heroVideo,
        backgroundVideo: formData.backgroundVideo,
        sectionVideo: formData.sectionVideo,
        tagline: formData.tagline,
        homepageTestimonialIds: formData.homepageTestimonialIds,
        testimonialsLabel: formData.testimonialsLabel,
        testimonialsHeading: formData.testimonialsHeading,
        sections: formData.sections
      }

      // 2. Update Site Settings (Stats & Labels)
      const settingsPayload = {
        ...siteSettings,
        experienceStats: formData.experienceStats,
        homepageSections: formData.homepageSections
      }

      const [homeRes, settingsRes] = await Promise.all([
        api.updateHomepage(homePayload),
        api.updateSiteSettings(settingsPayload)
      ])

      if (homeRes.success && settingsRes.success) {
        toast.success('Homepage updated successfully!')
      } else {
        toast.error('Some updates failed to save')
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = (type: string, id: string, currentStatus: boolean) => {
    // Shared toggle logic
  }

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return
    try {
      const res = await api.deleteBrand(id)
      if (res.success) {
        setAllBrands(allBrands.filter(b => b._id !== id))
        toast.success('Brand deleted')
      }
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-screen py-12">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        <span className="ml-3 text-dark-choc font-medium">Loading homepage...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Homepage Management</h1>
            <p className="text-dark-choc/60 text-sm sm:text-base">Control hero copy, partner logos, and section flow.</p>
          </div>

          <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-dark-choc text-white px-6 py-2.5 rounded-xl hover:bg-dark-choc/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-medium"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
            {activeTab === 'brands' && (
              <Link
                href="/admin/brands/new"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all shadow-sm active:scale-95 font-medium whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add Brand
              </Link>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-8 p-1 bg-earl-gray/30 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar max-w-full">
          <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'hero' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}>
            <Layout className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Hero</span>
          </button>
          <button onClick={() => setActiveTab('brands')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'brands' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}>
            <ImageIcon className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Partners</span>
          </button>
          <button onClick={() => setActiveTab('testimonials')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'testimonials' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}>
            <Quote className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Testimonials</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'stats' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}>
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Stats</span>
          </button>
          <button onClick={() => setActiveTab('visibility')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'visibility' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}>
            <Settings2 className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Flow</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">

        {/* HERO PANEL */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-6">
              <h2 className="text-xl font-bold text-dark-choc mb-6 flex items-center gap-2"><Layout className="w-5 h-5 text-electric-blue" />Hero Copy</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Main Headline</label>
                  <input type="text" value={formData.heroHeadline} onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-bold text-xl" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Subheading</label>
                  <textarea value={formData.heroSubheading} onChange={e => setFormData({ ...formData, heroSubheading: e.target.value })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-medium h-24 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Tagline (Scrolling)</label>
                  <input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-medium" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-6">
              <h2 className="text-xl font-bold text-dark-choc mb-6 flex items-center gap-2"><Video className="w-5 h-5 text-electric-blue" />Hero & Section Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MediaSelector type="video" value={formData.heroVideo} onChange={v => setFormData({ ...formData, heroVideo: v })} label="Intro Video (Small Overlay)" />
                <MediaSelector type="video" value={formData.backgroundVideo} onChange={v => setFormData({ ...formData, backgroundVideo: v })} label="Looping Background Video" />
                <div className="md:col-span-2">
                  <MediaSelector type="video" value={formData.sectionVideo} onChange={v => setFormData({ ...formData, sectionVideo: v })} label="Section Break Video (Middle of Page)" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRANDS PANEL */}
        {activeTab === 'brands' && (
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-dark-choc/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark-choc">Partner Logos Portfolio</h2>
              <span className="text-[10px] font-black text-electric-blue uppercase bg-electric-blue/5 px-2.5 py-1 rounded-full border border-electric-blue/10 tracking-widest">{allBrands.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-earl-gray/30 text-dark-choc/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-5">Brand</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5 text-center">Order</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-choc/5 text-sm">
                  {allBrands.length > 0 ? (
                    allBrands.map(brand => (
                      <tr key={brand._id} className="hover:bg-earl-gray/10 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-10 h-10 rounded-lg bg-white border border-dark-choc/10 p-1.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                              {brand.image?.url ? <img src={brand.image.url} className="max-w-full max-h-full object-contain" /> : <ImageIcon className="w-5 h-5 text-dark-choc/10" />}
                            </div>
                            <span className="font-bold text-dark-choc group-hover:text-electric-blue transition-colors line-clamp-1">{brand.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-dark-choc/5 text-dark-choc/70 border border-dark-choc/10">
                            {brand.category || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono font-bold text-dark-choc/40">{brand.order || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/brands/${brand._id}`} className="p-2 text-dark-choc/30 hover:text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-all" title="Edit Brand">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDeleteBrand(brand._id, brand.name)} className="p-2 text-dark-choc/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-dark-choc/30 italic font-medium">
                        No brands found in your portfolio.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TESTIMONIALS PANEL */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-6">
              <h2 className="text-xl font-bold text-dark-choc mb-6">Homepage Testimonials Logic</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-dark-choc/5 mb-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Section Eyebrow</label>
                  <input type="text" value={formData.testimonialsLabel} onChange={e => setFormData({ ...formData, testimonialsLabel: e.target.value })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Main Section Heading</label>
                  <input type="text" value={formData.testimonialsHeading} onChange={e => setFormData({ ...formData, testimonialsHeading: e.target.value })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-medium" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-dark-choc/60 uppercase tracking-widest">Selected Testimonials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allTestimonials.map(t => {
                    const isSelected = formData.homepageTestimonialIds.includes(t._id)
                    return (
                      <div key={t._id} onClick={() => {
                        const ids = isSelected ? formData.homepageTestimonialIds.filter(id => id !== t._id) : [...formData.homepageTestimonialIds, t._id]
                        setFormData({ ...formData, homepageTestimonialIds: ids })
                      }} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${isSelected ? 'border-electric-blue bg-electric-blue/5' : 'border-dark-choc/10 hover:border-dark-choc/30'}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-electric-blue border-electric-blue' : 'border-dark-choc/20'}`}>
                          {isSelected && <Plus className="w-3 h-3 text-white rotate-45" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-dark-choc truncate text-sm">{t.clientName}</p>
                          <p className="text-xs text-dark-choc/50 truncate">{t.company}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS PANEL */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-6">
              <h2 className="text-xl font-bold text-dark-choc mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-electric-blue" />Performance Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Years of Legacy</label>
                  <input type="number" value={formData.experienceStats.years} onChange={e => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, years: parseInt(e.target.value) } })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-bold text-center text-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Trusted Clients</label>
                  <input type="number" value={formData.experienceStats.clients} onChange={e => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, clients: parseInt(e.target.value) } })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-bold text-center text-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Projects Completed</label>
                  <input type="number" value={formData.experienceStats.projects} onChange={e => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, projects: parseInt(e.target.value) } })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-bold text-center text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-6">
              <h2 className="text-xl font-bold text-dark-choc mb-6 flex items-center gap-2"><Quote className="w-5 h-5 text-electric-blue" />"Trusted By" Section Labels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Section Label (Eyebrow)</label>
                  <input type="text" value={formData.homepageSections.clientsLabel} onChange={e => setFormData({ ...formData, homepageSections: { ...formData.homepageSections, clientsLabel: e.target.value } })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-2">Section Headline</label>
                  <input type="text" value={formData.homepageSections.clientsTitle} onChange={e => setFormData({ ...formData, homepageSections: { ...formData.homepageSections, clientsTitle: e.target.value } })} className="w-full px-4 py-3 bg-earl-gray/20 border-0 rounded-xl outline-none font-medium text-lg font-bold" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISIBILITY PANEL */}
        {activeTab === 'visibility' && (
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-dark-choc mb-6 flex items-center gap-2"><Settings2 className="w-5 h-5 text-electric-blue" />Homepage Flow</h2>
            <div className="space-y-4">
              {Object.keys(formData.sections).map((key) => (
                <div key={key} className="flex items-center justify-between p-4 bg-earl-gray/20 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-dark-choc/20 border border-dark-choc/5">{formData.sections[key as keyof typeof formData.sections].order}</div>
                    <span className="font-bold text-dark-choc uppercase tracking-widest text-sm">{key} Section</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-dark-choc/40">Order:</span>
                      <input type="number" value={formData.sections[key as keyof typeof formData.sections].order} onChange={e => setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          [key]: { ...formData.sections[key as keyof typeof formData.sections], order: parseInt(e.target.value) }
                        }
                      })} className="w-12 text-center bg-white border-0 rounded text-sm font-bold py-1" />
                    </div>
                    <button onClick={() => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        [key]: { ...formData.sections[key as keyof typeof formData.sections], enabled: !formData.sections[key as keyof typeof formData.sections].enabled }
                      }
                    })} className={`p-2 rounded-lg transition-all ${formData.sections[key as keyof typeof formData.sections].enabled ? 'text-electric-blue bg-electric-blue/10' : 'text-dark-choc/20 bg-dark-choc/5'}`}>
                      {formData.sections[key as keyof typeof formData.sections].enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
