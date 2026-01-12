'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'
import Link from 'next/link'
import { toast } from '@/components/admin/Toast'

export default function HomepagePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [homepage, setHomepage] = useState<any>(null)
  const [allTestimonials, setAllTestimonials] = useState<any[]>([])
  const [formData, setFormData] = useState({
    heroHeadline: '',
    heroSubheading: '',
    heroVideo: null as { url: string; mediaId?: string } | null,
    backgroundVideo: null as { url: string; mediaId?: string } | null,
    sectionVideo: null as { url: string; mediaId?: string } | null,
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
  })

  useEffect(() => {
    fetchHomepage()
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await api.getTestimonials()
      if (response.success && response.data) {
        setAllTestimonials(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    }
  }

  const fetchHomepage = async () => {
    try {
      const response = await api.getHomepage()
      if (response.success && response.data) {
        const data = response.data
        setHomepage(data)
        setFormData({
          heroHeadline: data.heroHeadline || '',
          heroSubheading: data.heroSubheading || '',
          heroVideo: data.heroVideo?.url ? { url: data.heroVideo.url, mediaId: data.heroVideo.mediaId } : null,
          backgroundVideo: data.backgroundVideo?.url ? { url: data.backgroundVideo.url, mediaId: data.backgroundVideo.mediaId } : null,
          sectionVideo: data.sectionVideo?.url ? { url: data.sectionVideo.url, mediaId: data.sectionVideo.mediaId } : null,
          tagline: data.tagline || '',
          homepageTestimonialIds: Array.isArray(data.homepageTestimonialIds) ? data.homepageTestimonialIds : [],
          testimonialsLabel: data.testimonialsLabel !== undefined && data.testimonialsLabel !== null ? data.testimonialsLabel : 'Testimonials',
          testimonialsHeading: data.testimonialsHeading !== undefined && data.testimonialsHeading !== null ? data.testimonialsHeading : 'What Clients Say',
          sections: data.sections || {
            hero: { enabled: true, order: 1 },
            about: { enabled: true, order: 2 },
            services: { enabled: true, order: 3 },
            clients: { enabled: true, order: 4 },
            testimonials: { enabled: true, order: 5 },
          },
        })
      }
    } catch (error) {
      console.error('Failed to fetch homepage:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Ensure all required fields are included
      const payload = {
        heroHeadline: formData.heroHeadline || '',
        heroSubheading: formData.heroSubheading || '',
        heroVideo: formData.heroVideo?.url ? {
          url: formData.heroVideo.url,
          mediaId: formData.heroVideo.mediaId,
        } : null,
        backgroundVideo: formData.backgroundVideo?.url ? {
          url: formData.backgroundVideo.url,
          mediaId: formData.backgroundVideo.mediaId,
        } : null,
        sectionVideo: formData.sectionVideo?.url ? {
          url: formData.sectionVideo.url,
          mediaId: formData.sectionVideo.mediaId,
        } : null,
        tagline: formData.tagline || '',
        homepageTestimonialIds: formData.homepageTestimonialIds || [],
        testimonialsLabel: formData.testimonialsLabel !== undefined && formData.testimonialsLabel !== null ? formData.testimonialsLabel : 'Testimonials',
        testimonialsHeading: formData.testimonialsHeading !== undefined && formData.testimonialsHeading !== null ? formData.testimonialsHeading : 'What Clients Say',
        sections: formData.sections || {
          hero: { enabled: true, order: 1 },
          about: { enabled: true, order: 2 },
          services: { enabled: true, order: 3 },
          clients: { enabled: true, order: 4 },
          testimonials: { enabled: true, order: 5 },
        },
      }

      const response = await api.updateHomepage(payload)
      if (response.success) {
        // Update form data with the response data to avoid refetch issues
        if (response.data) {
          const data = response.data
          setFormData({
            heroHeadline: data.heroHeadline || '',
            heroSubheading: data.heroSubheading || '',
            heroVideo: data.heroVideo?.url ? { url: data.heroVideo.url, mediaId: data.heroVideo.mediaId } : null,
            backgroundVideo: data.backgroundVideo?.url ? { url: data.backgroundVideo.url, mediaId: data.backgroundVideo.mediaId } : null,
            sectionVideo: data.sectionVideo?.url ? { url: data.sectionVideo.url, mediaId: data.sectionVideo.mediaId } : null,
            tagline: data.tagline || '',
            homepageTestimonialIds: Array.isArray(data.homepageTestimonialIds) ? data.homepageTestimonialIds : [],
            testimonialsLabel: data.testimonialsLabel !== undefined && data.testimonialsLabel !== null ? data.testimonialsLabel : 'Testimonials',
            testimonialsHeading: data.testimonialsHeading !== undefined && data.testimonialsHeading !== null ? data.testimonialsHeading : 'What Clients Say',
            sections: data.sections || {
              hero: { enabled: true, order: 1 },
              about: { enabled: true, order: 2 },
              services: { enabled: true, order: 3 },
              clients: { enabled: true, order: 4 },
              testimonials: { enabled: true, order: 5 },
            },
          })
          setHomepage(data)
        }
        toast.success('Homepage updated successfully!')
      } else {
        console.error('Update response:', response)
        alert(response.message || 'Failed to update homepage')
      }
    } catch (error: any) {
      console.error('Update failed:', error)
      alert(`Failed to update homepage: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }


  const toggleSection = (section: string) => {
    setFormData({
      ...formData,
      sections: {
        ...formData.sections,
        [section]: {
          ...formData.sections[section as keyof typeof formData.sections],
          enabled: !formData.sections[section as keyof typeof formData.sections].enabled,
        },
      },
    })
  }

  const toggleTestimonial = (testimonialId: string) => {
    const currentIds = formData.homepageTestimonialIds || []
    const isSelected = currentIds.includes(testimonialId)

    setFormData({
      ...formData,
      homepageTestimonialIds: isSelected
        ? currentIds.filter(id => id !== testimonialId)
        : [...currentIds, testimonialId],
    })
  }

  const handleToggleTestimonialActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateTestimonial(id, { isActive: !currentStatus })
      if (response.success) {
        toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchTestimonials()
      } else {
        toast.error('Failed to update testimonial')
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Failed to update testimonial')
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) return

    try {
      const response = await api.deleteTestimonial(id)
      if (response.success) {
        toast.success('Testimonial deleted successfully')
        // Remove from homepage selection if it was selected
        setFormData({
          ...formData,
          homepageTestimonialIds: formData.homepageTestimonialIds.filter(tId => tId !== id),
        })
        fetchTestimonials()
      } else {
        toast.error('Failed to delete testimonial')
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading homepage...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc">Homepage Content</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-electric-blue text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base font-medium"
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
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-dark-choc/10">
            <h2 className="text-lg sm:text-xl font-bold text-dark-choc mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  placeholder="Enter headline"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">
                  Subheading
                </label>
                <textarea
                  value={formData.heroSubheading}
                  onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  rows={3}
                  placeholder="Enter subheading"
                />
              </div>
              <div>
                <MediaSelector
                  type="video"
                  value={formData.heroVideo || undefined}
                  onChange={(media) => setFormData({ ...formData, heroVideo: media })}
                  label="Hero Video (Intro Video)"
                />
              </div>
              <div>
                <MediaSelector
                  type="video"
                  value={formData.backgroundVideo || undefined}
                  onChange={(media) => setFormData({ ...formData, backgroundVideo: media })}
                  label="Background Video (Looping Video)"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">Tagline</h2>
            <div>
              <label className="block text-sm font-medium text-dark-choc mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue"
                placeholder="Enter tagline"
              />
            </div>
          </div>

          {/* Section Video */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">Section Video</h2>
            <div>
              <MediaSelector
                type="video"
                value={formData.sectionVideo || undefined}
                onChange={(media) => setFormData({ ...formData, sectionVideo: media })}
                label="Section Break Video"
              />
            </div>
          </div>

          {/* Homepage Testimonials Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-dark-choc/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-dark-choc">Homepage Testimonials</h2>
                <p className="text-xs sm:text-sm text-dark-choc/60 mt-1">Select which testimonials appear on the homepage "What Clients Say" section</p>
              </div>
              <Link
                href="/admin/testimonials/new"
                className="flex items-center justify-center gap-2 bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/90 transition-colors text-sm font-medium w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Add New
              </Link>
            </div>

            {/* Section Text Controls */}
            <div className="mb-6 p-4 bg-earl-gray/30 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">
                  Section Label
                </label>
                <input
                  type="text"
                  value={formData.testimonialsLabel}
                  onChange={(e) => setFormData({ ...formData, testimonialsLabel: e.target.value })}
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue bg-white"
                  placeholder="Testimonials"
                />
                <p className="text-xs text-dark-choc/60 mt-1">This appears as the small label above the heading (e.g., "TESTIMONIALS")</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={formData.testimonialsHeading}
                  onChange={(e) => setFormData({ ...formData, testimonialsHeading: e.target.value })}
                  className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue bg-white"
                  placeholder="What Clients Say"
                />
                <p className="text-xs text-dark-choc/60 mt-1">This is the main heading for the testimonials section (e.g., "What Clients Say")</p>
              </div>
            </div>

            {/* Testimonials Selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-dark-choc mb-2">Select Testimonials to Display</h3>
              <p className="text-sm text-dark-choc/60 mb-4">Choose which testimonials appear on the homepage. If none are selected, all active testimonials will be shown.</p>
            </div>

            <div className="space-y-4">
              {allTestimonials.length === 0 ? (
                <div className="text-center py-8 text-dark-choc/60">
                  <p className="mb-4">No testimonials available.</p>
                  <Link
                    href="/admin/testimonials/new"
                    className="inline-flex items-center gap-2 text-electric-blue hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Create your first testimonial
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {allTestimonials.map((testimonial) => {
                    const isSelected = formData.homepageTestimonialIds?.includes(testimonial._id)
                    return (
                      <div
                        key={testimonial._id}
                        className={`p-4 rounded-lg border-2 transition-all ${isSelected
                          ? 'border-electric-blue bg-electric-blue/5'
                          : 'border-dark-choc/10 bg-white hover:border-dark-choc/20'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleTestimonial(testimonial._id)}
                            className="mt-1 w-5 h-5 text-electric-blue rounded focus:ring-electric-blue cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {testimonial.profileImage?.url && (
                                <img
                                  src={testimonial.profileImage.url}
                                  alt={testimonial.clientName}
                                  className="w-10 h-10 object-cover rounded-full border border-dark-choc/10"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-dark-choc">{testimonial.clientName}</span>
                                  <span className="text-sm text-dark-choc/60">• {testimonial.company}</span>
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded font-medium ${testimonial.isActive
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                      }`}
                                  >
                                    {testimonial.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-dark-choc/70 mb-3 line-clamp-2">{testimonial.quote}</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleTestimonialActive(testimonial._id, testimonial.isActive)}
                                className={`p-2 rounded-lg transition-colors text-sm ${testimonial.isActive
                                  ? 'text-gray-500 hover:bg-gray-100'
                                  : 'text-green-600 hover:bg-green-50'
                                  }`}
                                title={testimonial.isActive ? 'Hide' : 'Show'}
                              >
                                {testimonial.isActive ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <Link
                                href={`/admin/testimonials/${testimonial._id}`}
                                className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteTestimonial(testimonial._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {formData.homepageTestimonialIds && formData.homepageTestimonialIds.length > 0 && (
                <div className="mt-4 p-3 bg-electric-blue/10 rounded-lg">
                  <p className="text-sm text-dark-choc">
                    <span className="font-semibold">{formData.homepageTestimonialIds.length}</span> testimonial{formData.homepageTestimonialIds.length !== 1 ? 's' : ''} selected for homepage display
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Toggles */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
            <h2 className="text-xl font-bold text-dark-choc mb-4">Section Visibility</h2>
            <div className="space-y-3">
              {Object.entries(formData.sections).map(([key, section]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSection(key)}
                      className="w-4 h-4 text-electric-blue rounded focus:ring-electric-blue"
                    />
                    <span className="text-dark-choc capitalize">{key}</span>
                  </label>
                  <input
                    type="number"
                    value={section.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          [key]: { ...section, order: parseInt(e.target.value) || 0 },
                        },
                      })
                    }
                    className="w-20 px-2 py-1 border border-dark-choc/20 rounded text-sm"
                    placeholder="Order"
                  />
                </div>
              ))}
            </div>
          </div>
        </div >
      </div>
    </div>
  )
}
