'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import {
  Plus, Edit, Trash2, Eye, EyeOff, LayoutTemplate,
  Briefcase, FileText, Save, Loader2, Video, Image as ImageIcon,
  CheckCircle2, AlertCircle
} from 'lucide-react'
import ServiceContentDrawer from './ServiceContentDrawer'
import MediaSelector from '@/components/admin/MediaSelector'
import { toast } from '@/components/admin/Toast'

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'hero' | 'content' | 'newsletter'>('list')
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)

  // Global Content State (from ServicesPage and SiteSettings)
  const [globalContent, setGlobalContent] = useState<any>({
    hero: { text: '', video: null },
    backgroundImage: null,
    statementA: { text: '' },
    statementB: { text: '' },
    newsletter: { title: '', description: '' }
  })

  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [heroLabels, setHeroLabels] = useState({
    label: '',
    title: '',
    description: ''
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [servicesRes, pageRes, settingsRes] = await Promise.all([
        api.getServices(),
        api.getServicesPage(),
        api.getSiteSettings()
      ])

      if (servicesRes.success) setServices(servicesRes.data)

      if (pageRes.success && pageRes.data) {
        const data = pageRes.data
        setGlobalContent({
          hero: {
            text: data.hero?.text || '',
            video: data.hero?.video?.url ? { url: data.hero.video.url, mediaId: data.hero.video.mediaId } : null,
          },
          backgroundImage: data.backgroundImage?.url ? { url: data.backgroundImage.url, mediaId: data.backgroundImage.mediaId } : null,
          statementA: { text: data.statementA?.text || '' },
          statementB: { text: data.statementB?.text || '' },
          newsletter: {
            title: data.newsletter?.title || '',
            description: data.newsletter?.description || '',
          },
        })
      }

      if (settingsRes.success && settingsRes.data) {
        setSiteSettings(settingsRes.data)
        setHeroLabels(settingsRes.data.servicesHero || heroLabels)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load services data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGlobal = async () => {
    setSaving(true)
    try {
      // 1. Update ServicesPage global content
      const pagePayload = {
        hero: globalContent.hero,
        backgroundImage: globalContent.backgroundImage,
        statementA: globalContent.statementA,
        statementB: globalContent.statementB,
        newsletter: globalContent.newsletter
      }

      // 2. Update SiteSettings hero labels
      const settingsPayload = {
        ...siteSettings,
        servicesHero: heroLabels
      }

      const [pageRes, settingsRes] = await Promise.all([
        api.updateServicesPage(pagePayload),
        api.updateSiteSettings(settingsPayload)
      ])

      if (pageRes.success && settingsRes.success) {
        toast.success('Services page content updated successfully!')
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

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateService(id, { isActive: !currentStatus })
      if (response.success) {
        fetchAllData()
        toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return

    try {
      const response = await api.deleteService(id)
      if (response.success) {
        fetchAllData()
        toast.success('Service deleted successfully')
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  const handleManageContent = (service: any) => {
    setSelectedService(service)
    setDrawerOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-screen py-12">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        <span className="ml-3 text-dark-choc font-medium">Loading services...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-dark-choc tracking-tight">Services</h1>
              <p className="text-dark-choc/50 font-medium">Manage service cards, hero copy, and workflow blocks.</p>
            </div>
            <div className="flex gap-2">
              {activeTab === 'list' && (
                <Link href="/admin/services/new" className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-2xl hover:bg-electric-blue/90 transition-all font-black shadow-lg shadow-electric-blue/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Service
                </Link>
              )}
            </div>
          </div>

          {/* Premium Tabs */}
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-dark-choc/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'list', label: 'Offerings', icon: Briefcase },
              { id: 'hero', label: 'Hero Section', icon: FileText },
              { id: 'content', label: 'Page Content', icon: LayoutTemplate },
              { id: 'newsletter', label: 'Newsletter', icon: CheckCircle2 }
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
          {activeTab === 'list' && (
            <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-earl-gray/30 border-b border-dark-choc/10">
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Service</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5">
                    {services.map((service) => (
                      <tr key={service._id} className="hover:bg-earl-gray/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-earl-gray flex items-center justify-center border border-dark-choc/5 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                              {service.mainImage?.url ? (
                                <img src={service.mainImage.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-dark-choc/20">{service.title[0]}</span>
                              )}
                            </div>
                            <span className="font-black text-dark-choc group-hover:text-electric-blue transition-colors leading-tight">{service.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {service.isActive ? 'Active' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleManageContent(service)} className="p-2.5 text-dark-choc/20 hover:text-dark-choc hover:bg-earl-gray rounded-xl transition-all">
                              <LayoutTemplate className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleToggleActive(service._id, service.isActive)} className="p-2.5 text-dark-choc/20 hover:text-dark-choc hover:bg-earl-gray rounded-xl transition-all">
                              {service.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <Link href={`/admin/services/${service._id}`} className="p-2.5 text-dark-choc/20 hover:text-electric-blue hover:bg-electric-blue/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></Link>
                            <button onClick={() => handleDelete(service._id, service.title)} className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-dark-choc/5">
                {services.map((service) => (
                  <div key={service._id} className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-earl-gray flex items-center justify-center border border-dark-choc/5 shadow-sm overflow-hidden">
                          {service.mainImage?.url ? (
                            <img src={service.mainImage.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-dark-choc/20">{service.title[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-dark-choc text-sm leading-tight">{service.title}</p>
                          <span className={`w-fit mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${service.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {service.isActive ? 'Active' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleManageContent(service)} className="p-2 text-dark-choc/30 bg-earl-gray/50 rounded-lg"><LayoutTemplate className="w-4 h-4" /></button>
                        <button onClick={() => handleToggleActive(service._id, service.isActive)} className="p-2 text-dark-choc/30 bg-earl-gray/50 rounded-lg">
                          {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/services/${service._id}`} className="p-2 text-electric-blue bg-electric-blue/5 rounded-lg"><Edit className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(service._id, service.title)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Services Intro Content</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Eyebrow Label</label>
                      <input
                        type="text"
                        value={heroLabels.label}
                        onChange={(e) => setHeroLabels({ ...heroLabels, label: e.target.value })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Main Headline</label>
                      <input
                        type="text"
                        value={heroLabels.title}
                        onChange={(e) => setHeroLabels({ ...heroLabels, title: e.target.value })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Narrative Description</label>
                      <textarea
                        rows={4}
                        value={heroLabels.description}
                        onChange={(e) => setHeroLabels({ ...heroLabels, description: e.target.value })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-medium text-dark-choc resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Visual Identity</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Hero Overlay Text (Left)</label>
                      <textarea
                        rows={4}
                        value={globalContent.hero.text}
                        onChange={(e) => setGlobalContent({ ...globalContent, hero: { ...globalContent.hero, text: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                    <MediaSelector
                      label="Hero Video Content"
                      type="video"
                      value={globalContent.hero.video}
                      onChange={(media) => setGlobalContent({ ...globalContent, hero: { ...globalContent.hero, video: media } })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleSaveGlobal}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Deploy Hero Updates
                </button>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Brand Statements</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Statement Alpha</label>
                      <textarea
                        rows={3}
                        value={globalContent.statementA.text}
                        onChange={(e) => setGlobalContent({ ...globalContent, statementA: { text: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Statement Beta</label>
                      <textarea
                        rows={3}
                        value={globalContent.statementB.text}
                        onChange={(e) => setGlobalContent({ ...globalContent, statementB: { text: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Section Background</h3>
                  </div>
                  <MediaSelector
                    label="Main Page Background Image"
                    value={globalContent.backgroundImage}
                    onChange={(media) => setGlobalContent({ ...globalContent, backgroundImage: media })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleSaveGlobal}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Synchronize Content
                </button>
              </div>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Newsletter Invitation</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Invitation Title</label>
                      <input
                        type="text"
                        value={globalContent.newsletter.title}
                        onChange={(e) => setGlobalContent({ ...globalContent, newsletter: { ...globalContent.newsletter, title: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Supporting Copy</label>
                      <textarea
                        rows={4}
                        value={globalContent.newsletter.description}
                        onChange={(e) => setGlobalContent({ ...globalContent, newsletter: { ...globalContent.newsletter, description: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-medium text-dark-choc resize-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-8 bg-electric-blue/5 rounded-[2rem] border border-electric-blue/10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-electric-blue/10">
                      <CheckCircle2 className="w-8 h-8 text-electric-blue" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-electric-blue">Sync with CRM</p>
                    <p className="text-sm font-medium text-dark-choc/60 max-w-[200px]">Subscribers are managed globally. Updates here only reflect the section's copy.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleSaveGlobal}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Deploy Newsletter Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Content Drawer */}
      <ServiceContentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        service={selectedService}
        onSave={fetchAllData}
      />
    </div>
  )
}
