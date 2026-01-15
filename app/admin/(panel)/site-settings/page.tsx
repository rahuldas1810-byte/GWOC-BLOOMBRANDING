'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2, Info } from 'lucide-react'
import { toast } from '@/components/admin/Toast'

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    experienceStats: {
      years: 4,
      clients: 75,
      projects: 100,
    },
    impactStats: {
      brandsCollaborated: 20,
      successfulLaunches: 10,
      industriesServed: 4,
      yearsExperience: 2,
    },
    clientApproach: {
      eyebrow: 'Our Approach',
      title: 'Design meaningful connections.',
      statements: ['', '', ''],
    },
    servicesHero: {
      label: 'What We Do',
      title: 'Our Services',
      description: 'Strategic branding services designed for companies ready to make an impact.',
    },
    clientsHero: {
      label: 'Our Clients',
      title: 'Brands Who Trusted Us',
      description: 'Each collaboration reflects our approach to building clear, confident brand identities.',
      subtitle: 'Trusted by founders, startups, and growing D2C brands.',
      socialLabel: 'Trusted by growing brands',
    },
    homepageSections: {
      clientsLabel: 'Our Clients',
      clientsTitle: 'Trusted By',
    },
    ourStoryAdditional: {
      whoWeAreLabel: 'Who We Are',
      additionalParagraph: '',
    },
    contactLabels: {
      heroSubtitle: 'Projects • Collaborations • Brand Enquiries',
      formLabel: 'Contact',
      formTitle: 'Send us a message.',
      formDescription: 'Tell us about your project and we\'ll get back to you within 24 hours.',
    },
    testimonialsHero: {
      label: 'Our Partners',
      title: 'Testimonials',
      description: 'Hear from companies who have worked with us to build their brand identity.',
      buttonText: 'Client Stories',
    },
    socialLinks: {
      instagram: '',
      linkedin: '',
      facebook: '',
    },
    useGoogleReviews: true,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bloom+Branding+Studio+Surat+Gujarat',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.getSiteSettings()
      if (response.success && response.data) {
        setFormData({
          experienceStats: response.data.experienceStats || formData.experienceStats,
          impactStats: response.data.impactStats || formData.impactStats,
          clientApproach: response.data.clientApproach || formData.clientApproach,
          servicesHero: response.data.servicesHero || formData.servicesHero,
          clientsHero: response.data.clientsHero || formData.clientsHero,
          homepageSections: response.data.homepageSections || formData.homepageSections,
          ourStoryAdditional: response.data.ourStoryAdditional || formData.ourStoryAdditional,
          contactLabels: response.data.contactLabels || formData.contactLabels,
          testimonialsHero: response.data.testimonialsHero || formData.testimonialsHero,
          socialLinks: response.data.socialLinks || formData.socialLinks,
          useGoogleReviews: response.data.useGoogleReviews ?? formData.useGoogleReviews,
          googleMapsUrl: response.data.googleMapsUrl || formData.googleMapsUrl,
        })
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error)
      toast.error('Failed to load site settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await api.updateSiteSettings(formData)
      if (response.success) {
        toast.success('Site settings updated successfully!')
      } else {
        toast.error(response.message || 'Failed to update')
      }
    } catch (error: any) {
      console.error('Update failed:', error)
      toast.error(`Error: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateStatement = (index: number, value: string) => {
    const newStatements = [...formData.clientApproach.statements]
    newStatements[index] = value
    setFormData({
      ...formData,
      clientApproach: {
        ...formData.clientApproach,
        statements: newStatements,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-screen py-12">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        <span className="ml-3 text-dark-choc font-medium">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-dark-choc/10 p-6 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-dark-choc tracking-tight">Site Settings</h1>
              <p className="text-dark-choc/50 font-medium">Control global labels, brand statistics, and social links.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-3 bg-dark-choc text-white px-10 py-4 rounded-2xl hover:bg-dark-choc/90 transition-all font-black shadow-xl shadow-dark-choc/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Social Links Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
            <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Social Connectivity</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Instagram URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                  className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.linkedin}
                  onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                  className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Facebook URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.facebook}
                  onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                  className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>

          {/* Stats Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
              <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Homepage Stats</h2>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Years</label>
                  <input
                    type="number"
                    value={formData.experienceStats.years}
                    onChange={e => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, years: parseInt(e.target.value) || 0 } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Clients</label>
                  <input
                    type="number"
                    value={formData.experienceStats.clients}
                    onChange={e => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, clients: parseInt(e.target.value) || 0 } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Projects</label>
                  <input
                    type="number"
                    value={formData.experienceStats.projects}
                    onChange={e => setFormData({ ...formData, experienceStats: { ...formData.experienceStats, projects: parseInt(e.target.value) || 0 } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
              <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Clients Page Stats</h2>
              </div>
              <div className="p-8 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Brands</label>
                  <input
                    type="number"
                    value={formData.impactStats.brandsCollaborated}
                    onChange={e => setFormData({ ...formData, impactStats: { ...formData.impactStats, brandsCollaborated: parseInt(e.target.value) || 0 } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Launches</label>
                  <input
                    type="number"
                    value={formData.impactStats.successfulLaunches}
                    onChange={e => setFormData({ ...formData, impactStats: { ...formData.impactStats, successfulLaunches: parseInt(e.target.value) || 0 } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc text-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Approach Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
            <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Client Approach Labels</h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Section Eyebrow</label>
                  <input
                    type="text"
                    value={formData.clientApproach.eyebrow}
                    onChange={e => setFormData({ ...formData, clientApproach: { ...formData.clientApproach, eyebrow: e.target.value } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.clientApproach.title}
                    onChange={e => setFormData({ ...formData, clientApproach: { ...formData.clientApproach, title: e.target.value } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Key Statements</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.clientApproach.statements.map((statement, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={statement}
                      onChange={e => updateStatement(idx, e.target.value)}
                      placeholder={`Statement ${idx + 1}`}
                      className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Page Hero Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Services & Clients Heroes */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
                <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                  <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Services Page Hero</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Label</label>
                      <input
                        type="text"
                        value={formData.servicesHero.label}
                        onChange={e => setFormData({ ...formData, servicesHero: { ...formData.servicesHero, label: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Title</label>
                      <input
                        type="text"
                        value={formData.servicesHero.title}
                        onChange={e => setFormData({ ...formData, servicesHero: { ...formData.servicesHero, title: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
                <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                  <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Testimonials Hero</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Label</label>
                      <input
                        type="text"
                        value={formData.testimonialsHero.label}
                        onChange={e => setFormData({ ...formData, testimonialsHero: { ...formData.testimonialsHero, label: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Cta Text</label>
                      <input
                        type="text"
                        value={formData.testimonialsHero.buttonText}
                        onChange={e => setFormData({ ...formData, testimonialsHero: { ...formData.testimonialsHero, buttonText: e.target.value } })}
                        className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials Source Toggle */}
              <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
                <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                  <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Review Source</h2>
                </div>
                <div className="p-8 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-dark-choc text-lg">Use Google Reviews</h3>
                    <p className="text-sm text-dark-choc/60 mt-1">If enabled, reviews will be fetched from Google Places. If disabled or if the API fails, CMS testimonials will be used.</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, useGoogleReviews: !formData.useGoogleReviews })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 ${formData.useGoogleReviews ? 'bg-electric-blue' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`${formData.useGoogleReviews ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Location Settings */}
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
              <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Location Settings</h2>
              </div>
              <div className="p-8">
                <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Google Maps URL</label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={e => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  placeholder="https://www.google.com/maps/..."
                />
                <p className="text-sm text-dark-choc/60 mt-2 font-medium">
                  Use a search or directions URL. Example: <span className="font-mono bg-earl-gray/30 px-1 rounded">https://www.google.com/maps/search/?api=1&query=...</span>
                </p>
              </div>
            </div>

            {/* Contact Labels */}
            <div className="bg-white rounded-3xl shadow-xl border border-dark-choc/10 overflow-hidden">
              <div className="p-8 border-b border-dark-choc/5 bg-earl-gray/10">
                <h2 className="text-lg font-black text-dark-choc uppercase tracking-widest text-sm">Contact Page Labels</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={formData.contactLabels.heroSubtitle}
                    onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, heroSubtitle: e.target.value } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Form Title</label>
                  <input
                    type="text"
                    value={formData.contactLabels.formTitle}
                    onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, formTitle: e.target.value } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-black text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-dark-choc/40 mb-2 ml-1">Form Description</label>
                  <textarea
                    rows={4}
                    value={formData.contactLabels.formDescription}
                    onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, formDescription: e.target.value } })}
                    className="w-full px-5 py-4 bg-earl-gray/20 border-0 rounded-2xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-medium text-dark-choc resize-none"
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

