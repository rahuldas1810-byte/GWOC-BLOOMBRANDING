'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2 } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroLabel: '',
    heroTitle: '',
    heroDescription: '',
    heroBackgroundImage: null as { url: string; mediaId?: string } | null,
    formTitle: '',
    formDescription: '',
    socialLinks: {
      instagram: '',
      linkedin: '',
      twitter: '',
      facebook: '',
    },
    address: {
      line1: '',
      line2: '',
      line3: '',
      line4: '',
    },
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const response = await api.getContact()
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          heroLabel: data.heroLabel || '',
          heroTitle: data.heroTitle || '',
          heroDescription: data.heroDescription || '',
          heroBackgroundImage: data.heroBackgroundImage && data.heroBackgroundImage.url ? { url: data.heroBackgroundImage.url, mediaId: data.heroBackgroundImage.mediaId || undefined } : null,
          formTitle: data.formTitle || '',
          formDescription: data.formDescription || '',
          socialLinks: data.socialLinks || { instagram: '', linkedin: '', twitter: '', facebook: '' },
          address: data.address || { line1: '', line2: '', line3: '', line4: '' },
          email: data.email || '',
          phone: data.phone || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await api.updateContact(formData)
      if (response.success) {
        alert('Contact page updated successfully!')
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

  if (loading) {
    return <div className="text-dark-choc">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-choc">Contact Page</h1>
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
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Label</label>
              <input
                type="text"
                value={formData.heroLabel}
                onChange={(e) => setFormData({ ...formData, heroLabel: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
              <textarea
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <MediaSelector
                type="image"
                value={formData.heroBackgroundImage}
                onChange={(media) => setFormData({ ...formData, heroBackgroundImage: media })}
                label="Hero Background Image"
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Form Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
              <input
                type="text"
                value={formData.formTitle}
                onChange={(e) => setFormData({ ...formData, formTitle: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
              <textarea
                value={formData.formDescription}
                onChange={(e) => setFormData({ ...formData, formDescription: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 1</label>
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 2</label>
              <input
                type="text"
                value={formData.address.line2}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line2: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 3</label>
              <input
                type="text"
                value={formData.address.line3}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line3: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 4</label>
              <input
                type="text"
                value={formData.address.line4}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line4: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
          <h2 className="text-xl font-bold text-dark-choc mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Instagram</label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Twitter</label>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">Facebook</label>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

