'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Trash2, Mail, CheckCircle, Loader2 } from 'lucide-react'

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


  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc mb-2">Customer Enquiries</h1>
            <p className="text-dark-choc/60 text-sm sm:text-base">Manage contact form submissions and leads.</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-1 p-1 bg-earl-gray/30 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar max-w-full">
          {['all', 'new', 'contacted', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-black uppercase tracking-widest ${filter === status
                ? 'bg-white text-dark-choc shadow-md'
                : 'text-dark-choc/50 hover:text-dark-choc hover:bg-white/50'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/10 overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 sm:p-20 text-center">
            <div className="w-16 h-16 bg-earl-gray/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-dark-choc/20" />
            </div>
            <p className="text-dark-choc/30 italic font-medium">No enquiries found in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-choc/5">
            {enquiries.map((enquiry) => (
              <div key={enquiry._id} className="p-5 sm:p-8 hover:bg-earl-gray/10 group transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-dark-choc group-hover:text-electric-blue transition-colors">{enquiry.name}</h3>
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${enquiry.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        enquiry.status === 'contacted' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                          enquiry.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                        {enquiry.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-dark-choc/70">
                        <div className="w-8 h-8 rounded-lg bg-earl-gray/30 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium truncate">{enquiry.email}</span>
                      </div>
                      {enquiry.company && (
                        <div className="flex items-center gap-3 text-dark-choc/70">
                          <div className="w-8 h-8 rounded-lg bg-earl-gray/30 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium truncate">{enquiry.company}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-earl-gray/20 rounded-2xl p-4 sm:p-6 mb-4">
                      <p className="text-dark-choc text-sm sm:text-base leading-relaxed">{enquiry.message}</p>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-dark-choc/30">
                      Submitted on {new Date(enquiry.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex lg:flex-col gap-2 shrink-0">
                    {enquiry.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusUpdate(enquiry._id, 'resolved')}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-all shadow-sm active:scale-95 font-medium text-sm"
                        title="Mark as resolved"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(enquiry._id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-500 px-5 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 font-medium text-sm border border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
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

