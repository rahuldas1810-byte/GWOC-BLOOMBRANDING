'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import {
  Save, Loader2, Plus, Edit, Trash2, Eye, EyeOff, Layout,
  ImageIcon, Quote, BarChart3, Settings2, Video, MousePointer2,
  Zap, Building2, MoveVertical
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


  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-dark-choc tracking-tight">Homepage</h1>
              <p className="text-dark-choc/50 font-medium">Control hero content, site-wide stats, and section visibility.</p>
            </div>
            <div className="flex gap-2">
              {activeTab === 'brands' && (
                <Link href="/admin/brands/new" className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-2xl hover:bg-electric-blue/90 transition-all font-black shadow-lg shadow-electric-blue/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Brand
                </Link>
              )}
            </div>
          </div>

          {/* Premium Tabs */}
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-dark-choc/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'hero', label: 'Hero', icon: Zap },
              { id: 'brands', label: 'Partners', icon: Building2 },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'visibility', label: 'Layout', icon: MoveVertical }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-dark-choc text-white shadow-xl shadow-dark-choc/20 scale-[1.02]'
                  : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest leading-none">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'hero' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Main Headlines</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Hero Headline</label>
                      <input
                        type="text"
                        value={formData.heroHeadline}
                        onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Subheading</label>
                      <textarea
                        rows={3}
                        value={formData.heroSubheading}
                        onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-medium text-dark-choc resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Scrolling Tagline</label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Visual Identity</h3>
                  </div>
                  <div className="space-y-4">
                    <MediaSelector
                      label="Intro Video (Small Overlay)"
                      value={formData.heroVideo}
                      onChange={(video) => setFormData({ ...formData, heroVideo: video })}
                      type="video"
                    />
                    <MediaSelector
                      label="Background Video (Main Loop)"
                      value={formData.backgroundVideo}
                      onChange={(video) => setFormData({ ...formData, backgroundVideo: video })}
                      type="video"
                    />
                    <MediaSelector
                      label="Section Break Video (Lower Page)"
                      value={formData.sectionVideo}
                      onChange={(video) => setFormData({ ...formData, sectionVideo: video })}
                      type="video"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Synchronize Hero
                </button>
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-earl-gray/30 border-b border-dark-choc/10">
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Partner Logo</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5">
                    {allBrands.map((brand) => (
                      <tr key={brand._id} className="hover:bg-earl-gray/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-12 bg-earl-gray/50 rounded-xl p-2 flex items-center justify-center border border-dark-choc/5 group-hover:scale-110 transition-transform">
                              {brand.image?.url && (
                                <img src={brand.image.url} alt="" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                              )}
                            </div>
                            <span className="font-bold text-dark-choc/40 text-xs uppercase tracking-widest">{brand.name || 'Untitled Branding'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${brand.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {brand.isActive ? 'Live' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/brands/${brand._id}`} className="p-2.5 text-dark-choc/20 hover:text-electric-blue hover:bg-electric-blue/5 rounded-xl transition-all">
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button onClick={() => handleDeleteBrand(brand._id, brand.name)} className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-dark-choc/5">
                {allBrands.map((brand) => (
                  <div key={brand._id} className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-earl-gray/50 rounded-lg p-2 flex items-center justify-center border border-dark-choc/5">
                        {brand.image?.url && (
                          <img src={brand.image.url} alt="" className="w-full h-full object-contain filter grayscale" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-dark-choc/40">{brand.name}</span>
                        <span className={`w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${brand.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {brand.isActive ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/brands/${brand._id}`} className="p-3 text-electric-blue bg-electric-blue/5 rounded-xl">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDeleteBrand(brand._id, brand.name)} className="p-3 text-red-500 bg-red-50 rounded-xl">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-earl-gray/20 p-6 rounded-2xl border border-dark-choc/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-electric-blue uppercase tracking-[0.2em]">Years Legacy</span>
                  </div>
                  <input
                    type="number"
                    value={formData.experienceStats.years}
                    onChange={(e) => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, years: parseInt(e.target.value) } })}
                    className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-electric-blue outline-none transition-all font-black text-dark-choc text-xl text-center"
                  />
                </div>
                <div className="bg-earl-gray/20 p-6 rounded-2xl border border-dark-choc/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-electric-blue uppercase tracking-[0.2em]">Global Clients</span>
                  </div>
                  <input
                    type="number"
                    value={formData.experienceStats.clients}
                    onChange={(e) => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, clients: parseInt(e.target.value) } })}
                    className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-electric-blue outline-none transition-all font-black text-dark-choc text-xl text-center"
                  />
                </div>
                <div className="bg-earl-gray/20 p-6 rounded-2xl border border-dark-choc/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-electric-blue uppercase tracking-[0.2em]">Live Projects</span>
                  </div>
                  <input
                    type="number"
                    value={formData.experienceStats.projects}
                    onChange={(e) => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, projects: parseInt(e.target.value) } })}
                    className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-electric-blue outline-none transition-all font-black text-dark-choc text-xl text-center"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Update Statistics
                </button>
              </div>
            </div>
          )}

          {activeTab === 'visibility' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Main Layout Controls</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(formData.sections).map((key) => (
                  <div key={key} className="flex items-center justify-between p-6 bg-earl-gray/20 rounded-2xl border border-dark-choc/5 group hover:border-dark-choc/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Settings2 className="w-5 h-5 text-dark-choc/30" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-dark-choc/60">{key} Section</span>
                    </div>
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          [key]: { ...formData.sections[key as keyof typeof formData.sections], enabled: !formData.sections[key as keyof typeof formData.sections].enabled }
                        }
                      })}
                      className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${formData.sections[key as keyof typeof formData.sections].enabled ? 'bg-electric-blue' : 'bg-dark-choc/20'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${formData.sections[key as keyof typeof formData.sections].enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Deploy Layout Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
