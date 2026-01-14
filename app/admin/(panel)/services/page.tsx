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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Services Management</h1>
            <p className="text-dark-choc/60 text-sm sm:text-base">Control hero copy, service cards, and page blocks.</p>
          </div>

          <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
            {activeTab !== 'list' && (
              <button
                onClick={handleSaveGlobal}
                disabled={saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-dark-choc text-white px-6 py-2.5 rounded-xl hover:bg-dark-choc/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-medium whitespace-nowrap"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Page
              </button>
            )}
            <Link
              href="/admin/services/new"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all shadow-sm active:scale-95 font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Service
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-8 p-1 bg-earl-gray/30 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'list' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Cards</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'hero' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Hero</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Blocks</span>
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'newsletter' ? 'bg-white text-dark-choc shadow-md' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Letter</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* SERVICE LIST TAB */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-earl-gray/30 text-dark-choc/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-5">Service</th>
                    <th className="px-6 py-5 hidden md:table-cell">Description</th>
                    <th className="px-6 py-5 text-center">Images</th>
                    <th className="px-6 py-5 text-center">Order</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-choc/5 text-sm">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-dark-choc/30 italic font-medium">
                        No services found. Get started by adding one!
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service._id} className="hover:bg-earl-gray/10 group transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-dark-choc group-hover:text-electric-blue transition-colors min-w-[150px] inline-block">{service.title}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="text-dark-choc/60 max-w-xs truncate">{service.description}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 bg-dark-choc/5 rounded-md text-[10px] font-bold text-dark-choc/40 border border-dark-choc/10">
                            {service.images?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono font-bold text-dark-choc/40">{service.order || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleActive(service._id, service.isActive)}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${service.isActive
                              ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                              }`}
                          >
                            {service.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleManageContent(service)}
                              className="p-2 text-dark-choc/30 hover:text-dark-choc hover:bg-earl-gray/50 rounded-lg transition-all"
                              title="Manage Website Content"
                            >
                              <LayoutTemplate className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/admin/services/${service._id}`}
                              className="p-2 text-dark-choc/30 hover:text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-all"
                              title="Edit Basic Info"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(service._id, service.title)}
                              className="p-2 text-dark-choc/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Hero Labels (SiteSettings) */}
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                  <FileText className="w-5 h-5 text-electric-blue" />
                  Hero Text & Labels
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Eyebrow Label</label>
                    <input
                      type="text"
                      value={heroLabels.label}
                      onChange={(e) => setHeroLabels({ ...heroLabels, label: e.target.value })}
                      className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                      placeholder="e.g. WHAT WE DO"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Main Headline</label>
                    <input
                      type="text"
                      value={heroLabels.title}
                      onChange={(e) => setHeroLabels({ ...heroLabels, title: e.target.value })}
                      className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc text-lg"
                      placeholder="e.g. Our Services"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Supporting Description</label>
                  <textarea
                    value={heroLabels.description}
                    onChange={(e) => setHeroLabels({ ...heroLabels, description: e.target.value })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-[145px] resize-none"
                    placeholder="Enter a brief intro about your services..."
                  />
                </div>
              </div>
            </div>

            {/* Hero Visuals (ServicesPage) */}
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                  <Video className="w-5 h-5 text-electric-blue" />
                  Hero Media Content
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Hero Floating Text (Left)</label>
                    <textarea
                      value={globalContent.hero.text}
                      onChange={(e) => setGlobalContent({ ...globalContent, hero: { ...globalContent.hero, text: e.target.value } })}
                      className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-[200px] resize-none"
                      placeholder="Large text displayed on the left side of the hero..."
                    />
                  </div>
                </div>
                <div>
                  <MediaSelector
                    type="video"
                    value={globalContent.hero.video || undefined}
                    onChange={(media) => setGlobalContent({ ...globalContent, hero: { ...globalContent.hero, video: media } })}
                    label="Hero Intro Video"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE BLOCKS TAB */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Background Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-electric-blue" />
                  Background Visuals
                </h2>
              </div>
              <div className="p-6">
                <MediaSelector
                  type="image"
                  value={globalContent.backgroundImage || undefined}
                  onChange={(media) => setGlobalContent({ ...globalContent, backgroundImage: media })}
                  label="Full-Width Background Image"
                />
              </div>
            </div>

            {/* Statement Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
                <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
                  <h3 className="text-lg font-bold text-dark-choc">Statement Block A</h3>
                </div>
                <div className="p-6">
                  <textarea
                    value={globalContent.statementA.text}
                    onChange={(e) => setGlobalContent({ ...globalContent, statementA: { text: e.target.value } })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-40 resize-none"
                    placeholder="Enter the first statement block..."
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
                <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
                  <h3 className="text-lg font-bold text-dark-choc">Statement Block B</h3>
                </div>
                <div className="p-6">
                  <textarea
                    value={globalContent.statementB.text}
                    onChange={(e) => setGlobalContent({ ...globalContent, statementB: { text: e.target.value } })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-40 resize-none"
                    placeholder="Enter the second statement block..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-electric-blue" />
                Newsletter Section
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Section Title</label>
                <input
                  type="text"
                  value={globalContent.newsletter.title}
                  onChange={(e) => setGlobalContent({ ...globalContent, newsletter: { ...globalContent.newsletter, title: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="e.g. Join the Community"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Section Description</label>
                <input
                  type="text"
                  value={globalContent.newsletter.description}
                  onChange={(e) => setGlobalContent({ ...globalContent, newsletter: { ...globalContent.newsletter, description: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="e.g. Subscribe for the latest brand insights."
                />
              </div>
            </div>
          </div>
        )}
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
