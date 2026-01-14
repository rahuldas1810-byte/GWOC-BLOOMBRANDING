'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2 } from 'lucide-react'

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
      additionalParagraph: 'We work with startups, D2C brands, and creators who are ready to make a real impact. Our team combines strategic thinking with clean, confident design. We don\'t chase trends. We build brands that stand the test of time.',
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
        })
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await api.updateSiteSettings(formData)
      if (response.success) {
        alert('Site settings updated successfully!')
      } else {
        alert(response.message || 'Failed to update')
      }
    } catch (error: any) {
      console.error('Update failed:', error)
      alert(`Failed to update: ${error.message || 'Unknown error'}`)
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
    return <div className="text-dark-choc">Loading...</div>
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Global Site Settings</h1>
            <p className="text-dark-choc/60 text-sm sm:text-base">Control labels, stats, and SEO descriptions across the site.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-dark-choc text-white px-8 py-3 rounded-xl hover:bg-dark-choc/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold whitespace-nowrap"
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
      </div>

      <div className="space-y-6">
        {/* Experience Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc">Experience Stats (Homepage)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Years</label>
              <input
                type="number"
                value={formData.experienceStats.years}
                onChange={(e) => setFormData({
                  ...formData,
                  experienceStats: { ...formData.experienceStats, years: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Clients</label>
              <input
                type="number"
                value={formData.experienceStats.clients}
                onChange={(e) => setFormData({
                  ...formData,
                  experienceStats: { ...formData.experienceStats, clients: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Projects</label>
              <input
                type="number"
                value={formData.experienceStats.projects}
                onChange={(e) => setFormData({
                  ...formData,
                  experienceStats: { ...formData.experienceStats, projects: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc">Impact Stats (Clients Page)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Brands Collaborated</label>
              <input
                type="number"
                value={formData.impactStats.brandsCollaborated}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, brandsCollaborated: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Successful Launches</label>
              <input
                type="number"
                value={formData.impactStats.successfulLaunches}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, successfulLaunches: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Industries Served</label>
              <input
                type="number"
                value={formData.impactStats.industriesServed}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, industriesServed: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Years Experience</label>
              <input
                type="number"
                value={formData.impactStats.yearsExperience}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, yearsExperience: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
          </div>
        </div>

        {/* Client Approach */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc">Client Approach Section</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Eyebrow</label>
                <input
                  type="text"
                  value={formData.clientApproach.eyebrow}
                  onChange={(e) => setFormData({
                    ...formData,
                    clientApproach: { ...formData.clientApproach, eyebrow: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Title</label>
                <input
                  type="text"
                  value={formData.clientApproach.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    clientApproach: { ...formData.clientApproach, title: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Statements</label>
              <div className="space-y-3">
                {formData.clientApproach.statements.map((statement, index) => (
                  <input
                    key={index}
                    type="text"
                    value={statement}
                    onChange={(e) => updateStatement(index, e.target.value)}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                    placeholder={`Statement ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services Hero */}
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-bold text-dark-choc">Services Page Hero</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Label</label>
                  <input
                    type="text"
                    value={formData.servicesHero.label}
                    onChange={(e) => setFormData({
                      ...formData,
                      servicesHero: { ...formData.servicesHero, label: e.target.value },
                    })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Title</label>
                  <input
                    type="text"
                    value={formData.servicesHero.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      servicesHero: { ...formData.servicesHero, title: e.target.value },
                    })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Description</label>
                <textarea
                  value={formData.servicesHero.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    servicesHero: { ...formData.servicesHero, description: e.target.value },
                  })}
                  rows={3}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
            </div>
          </div>

          {/* Clients Hero */}
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-bold text-dark-choc">Clients Page Hero</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Label</label>
                  <input
                    type="text"
                    value={formData.clientsHero.label}
                    onChange={(e) => setFormData({
                      ...formData,
                      clientsHero: { ...formData.clientsHero, label: e.target.value },
                    })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Title</label>
                  <input
                    type="text"
                    value={formData.clientsHero.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      clientsHero: { ...formData.clientsHero, title: e.target.value },
                    })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Description</label>
                <textarea
                  value={formData.clientsHero.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    clientsHero: { ...formData.clientsHero, description: e.target.value },
                  })}
                  rows={3}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
            </div>
          </div>
        </div>

        {/* More Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Homepage Sections */}
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-bold text-dark-choc">Homepage Labels</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Clients Label</label>
                <input
                  type="text"
                  value={formData.homepageSections.clientsLabel}
                  onChange={(e) => setFormData({
                    ...formData,
                    homepageSections: { ...formData.homepageSections, clientsLabel: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Clients Title</label>
                <input
                  type="text"
                  value={formData.homepageSections.clientsTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    homepageSections: { ...formData.homepageSections, clientsTitle: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Hero */}
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-bold text-dark-choc">Testimonials Page</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Label</label>
                  <input
                    type="text"
                    value={formData.testimonialsHero.label}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonialsHero: { ...formData.testimonialsHero, label: e.target.value },
                    })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.testimonialsHero.buttonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonialsHero: { ...formData.testimonialsHero, buttonText: e.target.value },
                    })}
                    className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Page Labels */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc">Contact Page Labels</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.contactLabels.heroSubtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactLabels: { ...formData.contactLabels, heroSubtitle: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Form Label</label>
                <input
                  type="text"
                  value={formData.contactLabels.formLabel}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactLabels: { ...formData.contactLabels, formLabel: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Form Title</label>
                <input
                  type="text"
                  value={formData.contactLabels.formTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactLabels: { ...formData.contactLabels, formTitle: e.target.value },
                  })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Form Description</label>
              <textarea
                value={formData.contactLabels.formDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  contactLabels: { ...formData.contactLabels, formDescription: e.target.value },
                })}
                rows={3}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

