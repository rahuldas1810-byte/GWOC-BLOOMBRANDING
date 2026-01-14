'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, Layout, Briefcase, FileText, Quote, Save, Loader2 } from 'lucide-react'

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
        alert('Clients page text updated successfully!')
      }
    } catch (error) {
      console.error('Update failed:', error)
      alert('Failed to update text')
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
        fetchAllData()
      }
    } catch (error) {
      console.error('Update failed:', error)
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
        fetchAllData()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
    return <div className="p-8 text-dark-choc">Loading client management...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc">Clients Management</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              {activeTab === 'showcase' && (
                <Link href="/admin/clients/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-5 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all font-medium shadow-sm active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Client
                </Link>
              )}
              {activeTab === 'industries' && (
                <Link href="/admin/sectors/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-5 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all font-medium shadow-sm active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Industry
                </Link>
              )}
              {activeTab === 'testimonials' && (
                <Link href="/admin/testimonials/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-5 py-2.5 rounded-xl hover:bg-electric-blue/90 transition-all font-medium shadow-sm active:scale-95">
                  <Plus className="w-5 h-5" />
                  Add Testimonial
                </Link>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-dark-choc/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'showcase' ? 'bg-dark-choc text-white shadow-md' : 'text-dark-choc/60 hover:text-dark-choc hover:bg-dark-choc/5'}`}
            >
              <Layout className="w-4 h-4" />
              <span className="text-sm font-medium">Showcase Cards</span>
            </button>
            <button
              onClick={() => setActiveTab('industries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'industries' ? 'bg-dark-choc text-white shadow-md' : 'text-dark-choc/60 hover:text-dark-choc hover:bg-dark-choc/5'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Industry Cards</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'text' ? 'bg-dark-choc text-white shadow-md' : 'text-dark-choc/60 hover:text-dark-choc hover:bg-dark-choc/5'}`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Hero & Labels</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'testimonials' ? 'bg-dark-choc text-white shadow-md' : 'text-dark-choc/60 hover:text-dark-choc hover:bg-dark-choc/5'}`}
            >
              <Quote className="w-4 h-4" />
              <span className="text-sm font-medium">Social Proof</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          {activeTab === 'showcase' && (
            <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-earl-gray/50 border-b border-dark-choc/10">
                      <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Order</th>
                      <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/5">
                    {clients.map((client) => (
                      <tr key={client._id} className="hover:bg-earl-gray/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            {client.logo?.url ? (
                              <img src={client.logo.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-dark-choc/10" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-earl-gray flex items-center justify-center text-dark-choc/40 font-bold border border-dark-choc/10">
                                {client.name[0]}
                              </div>
                            )}
                            <span className="font-bold text-dark-choc">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-dark-choc/5 text-dark-choc/70 text-xs font-medium rounded-full">
                            {client.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-dark-choc font-medium">{client.order}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {client.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleToggleActive('client', client._id, client.isActive)} className="p-2 text-dark-choc/40 hover:text-dark-choc hover:bg-earl-gray rounded-lg transition-colors">
                              {client.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <Link href={`/admin/clients/${client._id}`} className="p-2 text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-colors"><Edit className="w-5 h-5" /></Link>
                            <button onClick={() => handleDelete('client', client._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'industries' && (
            <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-earl-gray">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Order</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Status</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-dark-choc">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/10">
                    {sectors.map((sector) => (
                      <tr key={sector._id} className="hover:bg-earl-gray/50">
                        <td className="px-6 py-4 font-mono text-dark-choc">{sector.order}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-dark-choc">{sector.name}</span>
                        </td>
                        <td className="px-6 py-4 text-dark-choc/70 text-sm truncate max-w-xs">{sector.description}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${sector.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {sector.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleToggleActive('sector', sector._id, sector.isActive)} className="p-2 text-dark-choc/60 hover:text-dark-choc">
                              {sector.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <Link href={`/admin/sectors/${sector._id}`} className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded"><Edit className="w-4 h-4" /></Link>
                            <button onClick={() => handleDelete('sector', sector._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-dark-choc border-b border-dark-choc/10 pb-2">Hero Section</h3>
                  <div>
                    <label className="block text-sm font-medium text-dark-choc mb-1">Top Label Text</label>
                    <input
                      type="text"
                      value={textForm.clientsHero.label}
                      onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, label: e.target.value } })}
                      className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-dark-choc outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-choc mb-1">Main Headline</label>
                    <input
                      type="text"
                      value={textForm.clientsHero.title}
                      onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, title: e.target.value } })}
                      className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-dark-choc outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-choc mb-1">Description Subtext</label>
                    <textarea
                      rows={3}
                      value={textForm.clientsHero.description}
                      onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, description: e.target.value } })}
                      className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-dark-choc outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-dark-choc border-b border-dark-choc/10 pb-2">Social Proof Section</h3>
                  <div>
                    <label className="block text-sm font-medium text-dark-choc mb-1">Secondary Label (Trusted By...)</label>
                    <input
                      type="text"
                      value={textForm.clientsHero.socialLabel}
                      onChange={(e) => setTextForm({ ...textForm, clientsHero: { ...textForm.clientsHero, socialLabel: e.target.value } })}
                      className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-dark-choc outline-none"
                    />
                  </div>
                  <div className="bg-earl-gray p-4 rounded-lg">
                    <p className="text-xs text-dark-choc/60 italic">
                      The brand names and testimonial quotes are managed in the &quot;Social Proof&quot; tab.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-dark-choc/10">
                <button
                  onClick={handleUpdateText}
                  disabled={saving}
                  className="flex items-center gap-2 bg-dark-choc text-white px-6 py-2.5 rounded-lg hover:bg-dark-choc/90 transition-all font-medium disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Text Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
              <div className="p-4 bg-earl-gray/50 border-b border-dark-choc/10">
                <p className="text-sm text-dark-choc/60">
                  These testimonials appear in the scrolling marquee and quote section on the Clients page.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-earl-gray">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Company (Brand)</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Quote</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-dark-choc">Status</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-dark-choc">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-choc/10">
                    {testimonials.map((t) => (
                      <tr key={t._id} className="hover:bg-earl-gray/50">
                        <td className="px-6 py-4 font-medium text-dark-choc">{t.company}</td>
                        <td className="px-6 py-4 text-dark-choc/70 text-sm italic max-w-sm truncate">&ldquo;{t.quote}&rdquo;</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {t.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleToggleActive('testimonial', t._id, t.isActive)} className="p-2 text-dark-choc/60 hover:text-dark-choc">
                              {t.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <Link href={`/admin/testimonials/${t._id}`} className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded"><Edit className="w-4 h-4" /></Link>
                            <button onClick={() => handleDelete('testimonial', t._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

