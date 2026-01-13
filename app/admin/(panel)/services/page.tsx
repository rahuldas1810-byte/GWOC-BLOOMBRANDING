'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, LayoutTemplate } from 'lucide-react'
import ServiceContentDrawer from './ServiceContentDrawer'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.getServices()
      if (response.success && response.data) {
        setServices(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateService(id, { isActive: !currentStatus })
      if (response.success) {
        fetchServices()
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await api.deleteService(id)
      if (response.success) {
        fetchServices()
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  const handleManageContent = (service: any) => {
    setSelectedService(service)
    setDrawerOpen(true)
  }

  const handleDrawerSave = () => {
    fetchServices()
  }

  if (loading) {
    return <div className="text-dark-choc">Loading services...</div>
  }

  return (
    <div className="min-h-screen bg-dark-choc/5 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc">Services</h1>
          <Link
            href="/admin/services/new"
            className="flex items-center justify-center gap-2 bg-electric-blue text-white px-4 py-2.5 rounded-lg hover:bg-electric-blue/90 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </Link>
        </div>

        {/* Mobile Cards View */}
        <div className="block sm:hidden space-y-4">
          {services.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-dark-choc/10 p-6 text-center text-dark-choc/60">
              No services found. Create your first service!
            </div>
          ) : (
            services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md border border-dark-choc/10 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-choc truncate">{service.title}</h3>
                    <p className="text-sm text-dark-choc/60 mt-1 line-clamp-2">{service.description}</p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded flex-shrink-0 ${service.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Mobile Manage Content Button */}
                <button
                  onClick={() => handleManageContent(service)}
                  className="w-full flex items-center justify-center gap-2 mt-2 mb-3 py-2 bg-earl-gray/30 hover:bg-earl-gray/50 text-dark-choc rounded-lg transition-colors text-sm font-medium"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  Manage Content
                </button>

                <div className="flex items-center justify-between pt-3 border-t border-dark-choc/10">
                  <div className="text-xs text-dark-choc/60">
                    <span className="mr-3">{service.images?.length || 0} images</span>
                    <span>Order: {service.order || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(service._id, service.isActive)}
                      className={`p-2 rounded transition-colors ${service.isActive
                          ? 'text-gray-500 hover:bg-gray-100'
                          : 'text-green-600 hover:bg-green-50'
                        }`}
                    >
                      {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link
                      href={`/admin/services/${service._id}`}
                      className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white rounded-lg shadow-md border border-dark-choc/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-earl-gray">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-medium text-dark-choc">Title</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-medium text-dark-choc hidden md:table-cell">Description</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-medium text-dark-choc">Images</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-medium text-dark-choc">Order</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-medium text-dark-choc">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-medium text-dark-choc">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-choc/10">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-dark-choc/60">
                      No services found. Create your first service!
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id} className="hover:bg-earl-gray/50">
                      <td className="px-4 lg:px-6 py-4">
                        <span className="font-medium text-dark-choc">{service.title}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-dark-choc max-w-md truncate hidden md:table-cell">
                        {service.description}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-dark-choc">
                        {service.images?.length || 0}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-dark-choc">{service.order || 0}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${service.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <button
                            onClick={() => handleManageContent(service)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-earl-gray/80 hover:bg-earl-gray text-dark-choc rounded text-xs font-medium mr-2 transition-colors"
                            title="Manage Website Content"
                          >
                            <LayoutTemplate className="w-3.5 h-3.5" />
                            Manage Content
                          </button>
                          
                          <button
                            onClick={() => handleToggleActive(service._id, service.isActive)}
                            className={`p-2 rounded transition-colors ${service.isActive
                                ? 'text-gray-500 hover:bg-gray-100'
                                : 'text-green-600 hover:bg-green-50'
                              }`}
                            title={service.isActive ? 'Hide' : 'Show'}
                          >
                            {service.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/services/${service._id}`}
                            className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ServiceContentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        service={selectedService}
        onSave={handleDrawerSave}
      />
    </div>
  )
}

