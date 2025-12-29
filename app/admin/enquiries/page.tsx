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
    <div>
      <h1 className="text-3xl font-bold text-dark-choc mb-8">Enquiries</h1>

      <div className="mb-6 flex gap-2">
        {['all', 'new', 'contacted', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === status
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
          <div className="p-12 text-center text-dark-choc/60">
            No enquiries found.
          </div>
        ) : (
          <div className="divide-y divide-dark-choc/10">
            {enquiries.map((enquiry) => (
              <div key={enquiry._id} className="p-6 hover:bg-earl-gray/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-dark-choc">{enquiry.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        enquiry.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-dark-choc/80 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {enquiry.email}
                    </p>
                    {enquiry.company && (
                      <p className="text-dark-choc/60 text-sm mb-2">Company: {enquiry.company}</p>
                    )}
                    <p className="text-dark-choc mt-3">{enquiry.message}</p>
                    <p className="text-xs text-dark-choc/40 mt-3">
                      {new Date(enquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {enquiry.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusUpdate(enquiry._id, 'resolved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Mark as resolved"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(enquiry._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

