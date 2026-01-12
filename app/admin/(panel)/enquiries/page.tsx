'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Trash2, Mail, CheckCircle } from 'lucide-react'

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchEnquiries()
  }, [filter])

  const fetchEnquiries = async () => {
    try {
      const params: any = { limit: 100 }
      if (filter !== 'all') {
        params.status = filter
      }
      const response = await api.getEnquiries(params)
      if (response.success && response.data) {
        setEnquiries(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await api.updateEnquiry(id, { status })
      if (response.success) {
        fetchEnquiries()
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return

    try {
      const response = await api.deleteEnquiry(id)
      if (response.success) {
        fetchEnquiries()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
    return <div className="text-dark-choc">Loading enquiries...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-6 sm:mb-8">Enquiries</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'new', 'contacted', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-colors text-sm sm:text-base ${filter === status
                  ? 'bg-electric-blue text-white'
                  : 'bg-white text-dark-choc border border-dark-choc/20 hover:bg-earl-gray'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-dark-choc/60">
              No enquiries found.
            </div>
          ) : (
            <div className="divide-y divide-dark-choc/10">
              {enquiries.map((enquiry) => (
                <div key={enquiry._id} className="p-4 sm:p-6 hover:bg-earl-gray/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-bold text-dark-choc">{enquiry.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                              enquiry.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                          }`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <p className="text-dark-choc/80 mb-1 text-sm sm:text-base flex items-center">
                        <Mail className="w-4 h-4 inline mr-1 flex-shrink-0" />
                        <span className="truncate">{enquiry.email}</span>
                      </p>
                      {enquiry.company && (
                        <p className="text-dark-choc/60 text-xs sm:text-sm mb-2">Company: {enquiry.company}</p>
                      )}
                      <p className="text-dark-choc mt-3 text-sm sm:text-base">{enquiry.message}</p>
                      <p className="text-xs text-dark-choc/40 mt-3">
                        {new Date(enquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex sm:flex-col gap-2 sm:ml-4 self-start">
                      {enquiry.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusUpdate(enquiry._id, 'resolved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1"
                          title="Mark as resolved"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-xs sm:hidden">Resolve</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(enquiry._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="text-xs sm:hidden">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

