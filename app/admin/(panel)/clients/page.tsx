'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/components/admin/Toast'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, Layout, Briefcase, FileText, Quote, Save, Loader2, Info } from 'lucide-react'

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<'showcase' | 'industries' | 'text' | 'testimonials'>('showcase')
  const [clients, setClients] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states for Page Text
  const [textForm, setTextForm] = useState({
    clientsHero: {
      label: '',
      title: '',
      description: '',
      subtitle: '',
      socialLabel: ''
    }
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [clientsRes, sectorsRes, settingsRes, testimonialsRes] = await Promise.all([
        api.getClients(),
        api.getSectors(),
        api.getSiteSettings(),
        api.getTestimonials()
      ])

      if (clientsRes.success) setClients(clientsRes.data)
      if (sectorsRes.success) setSectors(sectorsRes.data)
      if (settingsRes.success) {
        setSettings(settingsRes.data)
        setTextForm({
          clientsHero: settingsRes.data.clientsHero || textForm.clientsHero
        })
      }
      if (testimonialsRes.success) setTestimonials(testimonialsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateText = async () => {
    setSaving(true)
    try {
      const response = await api.updateSiteSettings({
        ...settings,
        clientsHero: textForm.clientsHero
      })
      if (response.success) {
        toast.success('Clients page text updated successfully!')
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to update text')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (type: 'client' | 'sector' | 'testimonial', id: string, currentStatus: boolean) => {
    try {
      let response
      if (type === 'client') response = await api.updateClient(id, { isActive: !currentStatus })
      else if (type === 'sector') response = await api.updateSector(id, { isActive: !currentStatus })
      else if (type === 'testimonial') response = await api.updateTestimonial(id, { isActive: !currentStatus })

      if (response?.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (type: 'client' | 'sector' | 'testimonial', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      let response
      if (type === 'client') response = await api.deleteClient(id)
      else if (type === 'sector') response = await api.deleteSector(id)
      else if (type === 'testimonial') response = await api.deleteTestimonial(id)

      if (response?.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete')
    }
  }


  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-dark-choc tracking-tight">Clients</h1>
              <p className="text-dark-choc/50 font-medium">Control showcase cards, industry sectors, and social proof.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {activeTab === 'showcase' && (
                <Link href="/admin/clients/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-2xl hover:bg-electric-blue/90 transition-all font-bold shadow-lg shadow-electric-blue/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Client
                </Link>
              )}
              {activeTab === 'industries' && (
                <Link href="/admin/sectors/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-2xl hover:bg-electric-blue/90 transition-all font-bold shadow-lg shadow-electric-blue/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Industry
                </Link>
              )}
              {activeTab === 'testimonials' && (
                <Link href="/admin/testimonials/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-2xl hover:bg-electric-blue/90 transition-all font-bold shadow-lg shadow-electric-blue/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Testimonial
                </Link>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-dark-choc/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all whitespace-nowrap ${activeTab === 'showcase' ? 'bg-dark-choc text-white shadow-xl shadow-dark-choc/20 scale-[1.02]' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white'}`}
            >
              <Layout className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest leading-none">Showcase</span>
            </button>
            <button
              onClick={() => setActiveTab('industries')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all whitespace-nowrap ${activeTab === 'industries' ? 'bg-dark-choc text-white shadow-xl shadow-dark-choc/20 scale-[1.02]' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest leading-none">Industries</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all whitespace-nowrap ${activeTab === 'text' ? 'bg-dark-choc text-white shadow-xl shadow-dark-choc/20 scale-[1.02]' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white'}`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest leading-none">Hero</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] transition-all whitespace-nowrap ${activeTab === 'testimonials' ? 'bg-dark-choc text-white shadow-xl shadow-dark-choc/20 scale-[1.02]' : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white'}`}
            >
              <Quote className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest leading-none">Proof</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          {activeTab === 'showcase' && (
            <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 overflow-hidden">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-earl-gray/30 border-b border-dark-choc/10">
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Client</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Category</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-center">Order</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5">
                    {clients.map((client) => (
                      <tr key={client._id} className="hover:bg-earl-gray/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-earl-gray flex items-center justify-center border border-dark-choc/5 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                              {client.logo?.url ? (
                                <img src={client.logo.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-dark-choc/20">{client.name[0]}</span>
                              )}
                            </div>
                            <span className="font-black text-dark-choc group-hover:text-electric-blue transition-colors">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1.5 bg-dark-choc/5 text-dark-choc/50 text-[10px] font-black uppercase tracking-widest rounded-full border border-dark-choc/5">
                            {client.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="font-mono font-bold text-dark-choc/30">{client.order}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${client.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {client.isActive ? 'Active' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleActive('client', client._id, client.isActive)} className="p-2.5 text-dark-choc/20 hover:text-dark-choc hover:bg-earl-gray rounded-xl transition-all">
                              {client.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <Link href={`/admin/clients/${client._id}`} className="p-2.5 text-dark-choc/20 hover:text-electric-blue hover:bg-electric-blue/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></Link>
                            <button onClick={() => handleDelete('client', client._id)} className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-dark-choc/5">
                {clients.map((client) => (
                  <div key={client._id} className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-earl-gray flex items-center justify-center border border-dark-choc/5 shadow-sm overflow-hidden">
                          {client.logo?.url ? (
                            <img src={client.logo.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-dark-choc/20">{client.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-dark-choc text-base">{client.name}</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-dark-choc/30">{client.category}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${client.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {client.isActive ? 'Active' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-dark-choc/30 uppercase tracking-widest">Order:</span>
                        <span className="font-mono font-bold text-dark-choc/60">{client.order}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleActive('client', client._id, client.isActive)} className="p-3 text-dark-choc/30 bg-earl-gray/50 rounded-xl">
                          {client.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <Link href={`/admin/clients/${client._id}`} className="p-3 text-electric-blue bg-electric-blue/5 rounded-xl"><Edit className="w-5 h-5" /></Link>
                        <button onClick={() => handleDelete('client', client._id)} className="p-3 text-red-500 bg-red-50 rounded-xl"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'industries' && (
            <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-earl-gray/30 border-b border-dark-choc/10">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Order</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Industry Name</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Description</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5">
                    {sectors.map((sector) => (
                      <tr key={sector._id} className="hover:bg-earl-gray/20 transition-colors group">
                        <td className="px-8 py-5 font-mono font-bold text-dark-choc/30">{sector.order}</td>
                        <td className="px-8 py-5">
                          <span className="font-black text-dark-choc group-hover:text-electric-blue transition-colors">{sector.name}</span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-dark-choc/60 text-sm truncate max-w-xs">{sector.description}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sector.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {sector.isActive ? 'Active' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleActive('sector', sector._id, sector.isActive)} className="p-2.5 text-dark-choc/20 hover:text-dark-choc hover:bg-earl-gray rounded-xl transition-all">
                              {sector.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <Link href={`/admin/sectors/${sector._id}`} className="p-2.5 text-dark-choc/20 hover:text-electric-blue hover:bg-electric-blue/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></Link>
                            <button onClick={() => handleDelete('sector', sector._id)} className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-dark-choc/5">
                {sectors.map((sector) => (
                  <div key={sector._id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-dark-choc text-base">{sector.name}</p>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sector.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {sector.isActive ? 'Active' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-dark-choc/50 text-sm line-clamp-2">{sector.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-dark-choc/30 uppercase tracking-widest">Order:</span>
                        <span className="font-mono font-bold text-dark-choc/60">{sector.order}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleActive('sector', sector._id, sector.isActive)} className="p-3 text-dark-choc/30 bg-earl-gray/50 rounded-xl">
                          {sector.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <Link href={`/admin/sectors/${sector._id}`} className="p-3 text-electric-blue bg-electric-blue/5 rounded-xl"><Edit className="w-5 h-5" /></Link>
                        <button onClick={() => handleDelete('sector', sector._id)} className="p-3 text-red-500 bg-red-50 rounded-xl"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 p-6 sm:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Hero Section Content</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Top Editorial Label</label>
                      <input
                        type="text"
                        value={textForm.clientsHero.label}
                        onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, label: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Main Page Headline</label>
                      <input
                        type="text"
                        value={textForm.clientsHero.title}
                        onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, title: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Supporting Narrative</label>
                      <textarea
                        rows={4}
                        value={textForm.clientsHero.description}
                        onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, description: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-medium text-dark-choc resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-electric-blue rounded-full" />
                    <h3 className="font-black text-dark-choc uppercase tracking-widest text-sm">Trusted Proof Labels</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Secondary Section Label</label>
                      <input
                        type="text"
                        value={textForm.clientsHero.socialLabel}
                        onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, socialLabel: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                        placeholder="e.g. Trusted By..."
                      />
                    </div>
                    <div className="bg-electric-blue/5 p-6 rounded-2xl border border-electric-blue/10">
                      <div className="flex items-start gap-4">
                        <Info className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-electric-blue/80 leading-relaxed uppercase tracking-wider">
                            Content Tip
                          </p>
                          <p className="text-xs font-medium text-electric-blue/60 mt-1 leading-relaxed">
                            The brand names and testimonial quotes are managed in the "Social Proof" tab. Use this tab only for headers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-dark-choc/5">
                <button
                  onClick={handleUpdateText}
                  disabled={saving}
                  className="flex items-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Hero Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="p-6 bg-earl-gray/30 border-b border-dark-choc/10">
                <p className="text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">
                  Marquee & Quotation Management
                </p>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-dark-choc/10">
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Brand/Company</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em]">Direct Quote</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-dark-choc/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5">
                    {testimonials.map((t) => (
                      <tr key={t._id} className="hover:bg-earl-gray/20 transition-colors group">
                        <td className="px-8 py-5 font-black text-dark-choc group-hover:text-electric-blue transition-colors">{t.company}</td>
                        <td className="px-8 py-5 text-dark-choc/60 text-sm font-medium italic max-w-md truncate">"{t.quote}"</td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {t.isActive ? 'Active' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleActive('testimonial', t._id, t.isActive)} className="p-2.5 text-dark-choc/20 hover:text-dark-choc hover:bg-earl-gray rounded-xl transition-all">
                              {t.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <Link href={`/admin/testimonials/${t._id}`} className="p-2.5 text-dark-choc/20 hover:text-electric-blue hover:bg-electric-blue/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></Link>
                            <button onClick={() => handleDelete('testimonial', t._id)} className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-dark-choc/5">
                {testimonials.map((t) => (
                  <div key={t._id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-dark-choc text-base">{t.company}</p>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${t.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {t.isActive ? 'Active' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-dark-choc/50 text-sm font-medium italic line-clamp-2 leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => handleToggleActive('testimonial', t._id, t.isActive)} className="p-3 text-dark-choc/30 bg-earl-gray/50 rounded-xl">
                        {t.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <Link href={`/admin/testimonials/${t._id}`} className="p-3 text-electric-blue bg-electric-blue/5 rounded-xl"><Edit className="w-5 h-5" /></Link>
                      <button onClick={() => handleDelete('testimonial', t._id)} className="p-3 text-red-500 bg-red-50 rounded-xl"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

