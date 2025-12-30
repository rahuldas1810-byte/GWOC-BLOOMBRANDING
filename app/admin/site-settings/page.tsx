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
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-choc">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
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

      <div className="space-y-6">
        {/* Experience Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Experience Stats (Homepage)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Years</label>
              <input
                type="number"
                value={formData.experienceStats.years}
                onChange={(e) => setFormData({
                  ...formData,
                  experienceStats: { ...formData.experienceStats, years: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Clients</label>
              <input
                type="number"
                value={formData.experienceStats.clients}
                onChange={(e) => setFormData({
                  ...formData,
                  experienceStats: { ...formData.experienceStats, clients: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Projects</label>
              <input
                type="number"
                value={formData.experienceStats.projects}
                onChange={(e) => setFormData({
                  ...formData,
                  experienceStats: { ...formData.experienceStats, projects: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Impact Stats (Clients Page)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Brands Collaborated</label>
              <input
                type="number"
                value={formData.impactStats.brandsCollaborated}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, brandsCollaborated: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Successful Launches</label>
              <input
                type="number"
                value={formData.impactStats.successfulLaunches}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, successfulLaunches: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Industries Served</label>
              <input
                type="number"
                value={formData.impactStats.industriesServed}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, industriesServed: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Years Experience</label>
              <input
                type="number"
                value={formData.impactStats.yearsExperience}
                onChange={(e) => setFormData({
                  ...formData,
                  impactStats: { ...formData.impactStats, yearsExperience: parseInt(e.target.value) || 0 },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Client Approach */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Client Approach Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Eyebrow</label>
              <input
                type="text"
                value={formData.clientApproach.eyebrow}
                onChange={(e) => setFormData({
                  ...formData,
                  clientApproach: { ...formData.clientApproach, eyebrow: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
              <input
                type="text"
                value={formData.clientApproach.title}
                onChange={(e) => setFormData({
                  ...formData,
                  clientApproach: { ...formData.clientApproach, title: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Statements</label>
              {formData.clientApproach.statements.map((statement, index) => (
                <input
                  key={index}
                  type="text"
                  value={statement}
                  onChange={(e) => updateStatement(index, e.target.value)}
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg mb-2"
                  placeholder={`Statement ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Services Hero */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Services Page Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Label</label>
              <input
                type="text"
                value={formData.servicesHero.label}
                onChange={(e) => setFormData({
                  ...formData,
                  servicesHero: { ...formData.servicesHero, label: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
              <input
                type="text"
                value={formData.servicesHero.title}
                onChange={(e) => setFormData({
                  ...formData,
                  servicesHero: { ...formData.servicesHero, title: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
              <textarea
                value={formData.servicesHero.description}
                onChange={(e) => setFormData({
                  ...formData,
                  servicesHero: { ...formData.servicesHero, description: e.target.value },
                })}
                rows={3}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Clients Hero */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Clients Page Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Label</label>
              <input
                type="text"
                value={formData.clientsHero.label}
                onChange={(e) => setFormData({
                  ...formData,
                  clientsHero: { ...formData.clientsHero, label: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
              <input
                type="text"
                value={formData.clientsHero.title}
                onChange={(e) => setFormData({
                  ...formData,
                  clientsHero: { ...formData.clientsHero, title: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
              <textarea
                value={formData.clientsHero.description}
                onChange={(e) => setFormData({
                  ...formData,
                  clientsHero: { ...formData.clientsHero, description: e.target.value },
                })}
                rows={3}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.clientsHero.subtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  clientsHero: { ...formData.clientsHero, subtitle: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Homepage Sections */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Homepage Section Labels</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Clients Label</label>
              <input
                type="text"
                value={formData.homepageSections.clientsLabel}
                onChange={(e) => setFormData({
                  ...formData,
                  homepageSections: { ...formData.homepageSections, clientsLabel: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Clients Title</label>
              <input
                type="text"
                value={formData.homepageSections.clientsTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  homepageSections: { ...formData.homepageSections, clientsTitle: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Our Story Additional */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Our Story Page Additional Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Who We Are Label</label>
              <input
                type="text"
                value={formData.ourStoryAdditional.whoWeAreLabel}
                onChange={(e) => setFormData({
                  ...formData,
                  ourStoryAdditional: { ...formData.ourStoryAdditional, whoWeAreLabel: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Additional Paragraph</label>
              <textarea
                value={formData.ourStoryAdditional.additionalParagraph}
                onChange={(e) => setFormData({
                  ...formData,
                  ourStoryAdditional: { ...formData.ourStoryAdditional, additionalParagraph: e.target.value },
                })}
                rows={4}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Contact Labels */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Contact Page Labels</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={formData.contactLabels.heroSubtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  contactLabels: { ...formData.contactLabels, heroSubtitle: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Form Label</label>
              <input
                type="text"
                value={formData.contactLabels.formLabel}
                onChange={(e) => setFormData({
                  ...formData,
                  contactLabels: { ...formData.contactLabels, formLabel: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Form Title</label>
              <input
                type="text"
                value={formData.contactLabels.formTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  contactLabels: { ...formData.contactLabels, formTitle: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Form Description</label>
              <textarea
                value={formData.contactLabels.formDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  contactLabels: { ...formData.contactLabels, formDescription: e.target.value },
                })}
                rows={3}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Hero */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Testimonials Page Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Label</label>
              <input
                type="text"
                value={formData.testimonialsHero.label}
                onChange={(e) => setFormData({
                  ...formData,
                  testimonialsHero: { ...formData.testimonialsHero, label: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
              <input
                type="text"
                value={formData.testimonialsHero.title}
                onChange={(e) => setFormData({
                  ...formData,
                  testimonialsHero: { ...formData.testimonialsHero, title: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
              <textarea
                value={formData.testimonialsHero.description}
                onChange={(e) => setFormData({
                  ...formData,
                  testimonialsHero: { ...formData.testimonialsHero, description: e.target.value },
                })}
                rows={3}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Button Text</label>
              <input
                type="text"
                value={formData.testimonialsHero.buttonText}
                onChange={(e) => setFormData({
                  ...formData,
                  testimonialsHero: { ...formData.testimonialsHero, buttonText: e.target.value },
                })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

