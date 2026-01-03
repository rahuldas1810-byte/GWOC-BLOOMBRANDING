'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Save, Loader2, Plus, Trash2, Mail, Instagram } from 'lucide-react'
import MediaSelector from '@/components/admin/MediaSelector'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

interface ContactFormValues {
  heroLabel: string
  heroTitle: string
  heroDescription: string
  heroBackgroundImage: { url: string; mediaId?: string } | null
  formTitle: string
  formDescription: string
  socialLinks: {
    instagram: string
    linkedin: string
    twitter: string
    facebook: string
  }
  address: {
    line1: string
    line2: string
    line3: string
    line4: string
  }
  email: string
  phone: string
  faqs: {
    question: string
    answer: string
  }[]
}

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormValues>({
    defaultValues: {
      heroLabel: '',
      heroTitle: '',
      heroDescription: '',
      heroBackgroundImage: null,
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
      faqs: [],
    },
  })

  // FAQ Field Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faqs',
  })

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const response = await api.getContact()
      if (response.success && response.data) {
        const data = response.data
        reset({
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
          faqs: data.faqs || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await api.updateContact(data)
      if (response.success) {
        alert('Contact page updated successfully!')
      } else {
        alert(response.message || 'Failed to update')
      }
    } catch (error: any) {
      console.error('Update failed:', error)
      alert(`Failed to update: ${error.message || 'Unknown error'}`)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-dark-choc">Contact Page</h1>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
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
                    {...register('heroLabel')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Title</label>
                  <input
                    type="text"
                    {...register('heroTitle')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
                  <textarea
                    {...register('heroDescription')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="heroBackgroundImage"
                    render={({ field }) => (
                      <MediaSelector
                        type="image"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Hero Background Image"
                      />
                    )}
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
                    {...register('formTitle')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Description</label>
                  <textarea
                    {...register('formDescription')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* FAQs Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
              <h2 className="text-xl font-bold text-dark-choc mb-4">Frequently Asked Questions</h2>
              <p className="text-sm text-dark-choc/60 mb-6">
                Add questions and answers that will appear on the contact page.
              </p>
              
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-lg bg-gray-50 border border-dark-choc/10 relative group">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="space-y-4 pr-8">
                      <div>
                        <label className="block text-sm font-medium text-dark-choc mb-2">
                          Question #{index + 1}
                        </label>
                        <input
                          type="text"
                          {...register(`faqs.${index}.question` as const, { required: "Question is required" })}
                          className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg bg-white"
                          placeholder="e.g. What services do you offer?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-choc mb-2">
                          Answer
                        </label>
                        <textarea
                          {...register(`faqs.${index}.answer` as const, { required: "Answer is required" })}
                          rows={3}
                          className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg bg-white"
                          placeholder="Enter the answer here..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ question: '', answer: '' })}
                  className="w-full py-4 border-2 border-dashed border-dark-choc/20 rounded-lg text-dark-choc/60 hover:border-electric-blue hover:text-electric-blue transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New FAQ
                </button>
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
                    {...register('email')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Phone</label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 1</label>
                  <input
                    type="text"
                    {...register('address.line1')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 2</label>
                  <input
                    type="text"
                    {...register('address.line2')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 3</label>
                  <input
                    type="text"
                    {...register('address.line3')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-choc mb-2">Address Line 4</label>
                  <input
                    type="text"
                    {...register('address.line4')}
                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-dark-choc/10">
              <h2 className="text-xl font-bold text-dark-choc mb-4">Social Links</h2>
              <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                        placeholder="hello@example.com"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram URL
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        {...register('socialLinks.instagram')}
                        className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

