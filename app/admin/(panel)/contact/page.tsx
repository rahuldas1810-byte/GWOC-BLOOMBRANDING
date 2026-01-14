'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import {
  Save, Loader2, Plus, Trash2, Mail, MapPin,
  HelpCircle, MessageSquare, Phone, Globe, Info, Send
} from 'lucide-react'
import { toast } from '@/components/admin/Toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteSettings, setSiteSettings] = useState<any>(null)

  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      description: '',
    },
    contactDetails: {
      email: '',
      phone: '',
      address: '',
      socialLinks: [{ platform: '', url: '', order: 0 }],
    },
    faqs: [{ question: '', answer: '', order: 0 }],
    // From SiteSettings
    contactLabels: {
      heroSubtitle: 'Projects • Collaborations • Brand Enquiries',
      formLabel: 'Contact',
      formTitle: 'Send us a message.',
      formDescription: 'Tell us about your project and we\'ll get back to you within 24 hours.',
    }
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [contactRes, settingsRes] = await Promise.all([
        api.getContact(),
        api.getSiteSettings()
      ])

      if (contactRes.success && contactRes.data) {
        setFormData(prev => ({
          ...prev,
          hero: contactRes.data.hero || prev.hero,
          contactDetails: contactRes.data.contactDetails || prev.contactDetails,
          faqs: contactRes.data.faqs || prev.faqs,
        }))
      }

      if (settingsRes.success && settingsRes.data) {
        setSiteSettings(settingsRes.data)
        setFormData(prev => ({
          ...prev,
          contactLabels: settingsRes.data.contactLabels || prev.contactLabels,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load contact content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const contactPayload = {
        hero: formData.hero,
        contactDetails: formData.contactDetails,
        faqs: formData.faqs,
      }

      const settingsPayload = {
        ...siteSettings,
        contactLabels: formData.contactLabels
      }

      const [contactRes, settingsRes] = await Promise.all([
        api.updateContact(contactPayload),
        api.updateSiteSettings(settingsPayload)
      ])

      if (contactRes.success && settingsRes.success) {
        toast.success('Contact page updated successfully!')
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

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '', order: formData.faqs.length }],
    })
  }

  const removeFaq = (index: number) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    })
  }

  const addSocial = () => {
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        socialLinks: [...formData.contactDetails.socialLinks, { platform: '', url: '', order: formData.contactDetails.socialLinks.length }],
      },
    })
  }

  const removeSocial = (index: number) => {
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        socialLinks: formData.contactDetails.socialLinks.filter((_, i) => i !== index),
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-screen py-12">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        <span className="ml-3 text-dark-choc font-medium">Loading contact page...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Contact Management</h1>
          <p className="text-dark-choc/60 text-sm sm:text-base">Manage inquiry labels, FAQs, and contact info.</p>
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
        {/* Hero & Labels Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
            <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
              <Globe className="w-5 h-5 text-electric-blue" />
              Hero & Branding Labels
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Main Headline</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1 text-electric-blue">Subheadline (Bloom Style)</label>
                <input
                  type="text"
                  value={formData.contactLabels.heroSubtitle}
                  onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, heroSubtitle: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-electric-blue/5 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-electric-blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Hero Description</label>
              <textarea
                value={formData.hero.description}
                onChange={e => setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value } })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-40 resize-none"
              />
            </div>
          </div>
          <div className="px-6 pb-6 pt-2 border-t border-dark-choc/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Form Label</label>
              <input
                type="text"
                value={formData.contactLabels.formLabel}
                onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, formLabel: e.target.value } })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Form Title</label>
              <input
                type="text"
                value={formData.contactLabels.formTitle}
                onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, formTitle: e.target.value } })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Form Description</label>
              <input
                type="text"
                value={formData.contactLabels.formDescription}
                onChange={e => setFormData({ ...formData, contactLabels: { ...formData.contactLabels, formDescription: e.target.value } })}
                className="w-full px-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
              />
            </div>
          </div>
        </div>

        {/* Contact Details & Social */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden h-full">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10">
              <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                <Mail className="w-5 h-5 text-electric-blue" />
                Core Info
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/20" />
                  <input
                    type="email"
                    value={formData.contactDetails.email}
                    onChange={e => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, email: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/20" />
                  <input
                    type="text"
                    value={formData.contactDetails.phone}
                    onChange={e => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, phone: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-dark-choc/40 mb-3 ml-1">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-dark-choc/20" />
                  <textarea
                    value={formData.contactDetails.address}
                    onChange={e => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, address: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-earl-gray/20 border-0 rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all font-bold text-dark-choc h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden h-full">
            <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
                <Send className="w-5 h-5 text-electric-blue" />
                Social Channels
              </h2>
              <button
                onClick={addSocial}
                className="flex items-center gap-2 text-electric-blue hover:text-dark-choc transition-colors font-black text-xs uppercase tracking-[0.2em]"
              >
                <Plus className="w-4 h-4" /> Add Link
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formData.contactDetails.socialLinks.map((social, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-earl-gray/10 p-4 rounded-2xl border border-dark-choc/5 group transition-all hover:bg-white hover:shadow-md">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Platform"
                      value={social.platform}
                      onChange={e => {
                        const newLinks = [...formData.contactDetails.socialLinks]
                        newLinks[idx].platform = e.target.value
                        setFormData({ ...formData, contactDetails: { ...formData.contactDetails, socialLinks: newLinks } })
                      }}
                      className="bg-transparent border-0 outline-none font-bold text-dark-choc text-sm"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={social.url}
                      onChange={e => {
                        const newLinks = [...formData.contactDetails.socialLinks]
                        newLinks[idx].url = e.target.value
                        setFormData({ ...formData, contactDetails: { ...formData.contactDetails, socialLinks: newLinks } })
                      }}
                      className="bg-transparent border-0 outline-none font-black text-electric-blue text-xs truncate"
                    />
                  </div>
                  <button
                    onClick={() => removeSocial(idx)}
                    className="p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
          <div className="p-6 border-b border-dark-choc/5 bg-earl-gray/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-dark-choc flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-electric-blue" />
              Frequently Asked Questions
            </h2>
            <button
              onClick={addFaq}
              className="flex items-center gap-2 text-electric-blue hover:text-dark-choc transition-colors font-black text-xs uppercase tracking-[0.2em]"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 bg-earl-gray/10 rounded-2xl border border-dark-choc/5 relative group transition-all hover:bg-white hover:shadow-lg">
                <button
                  onClick={() => removeFaq(idx)}
                  className="absolute top-4 right-4 p-2.5 text-dark-choc/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-dark-choc/40 uppercase tracking-widest mb-2">Question {idx + 1}</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[idx].question = e.target.value
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                      placeholder="Type the question..."
                      className="w-full bg-transparent border-0 outline-none font-bold text-dark-choc text-base focus:text-electric-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-dark-choc/40 uppercase tracking-widest mb-2">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={e => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[idx].answer = e.target.value
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                      placeholder="Type the answer..."
                      className="w-full bg-transparent border-0 outline-none font-medium h-32 resize-none text-sm text-dark-choc/60"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
