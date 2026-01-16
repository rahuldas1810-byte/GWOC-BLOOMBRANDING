'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, LayoutGrid, List } from 'lucide-react'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { toast } from '@/components/admin/Toast'

export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

    useEffect(() => {
        fetchBrands()
    }, [])

    const fetchBrands = async () => {
        setLoading(true)
        try {
            const response = await api.getBrands()
            if (response.success) {
                setBrands(response.data ?? [])

            }
        } catch (error) {
            console.error('Failed to fetch brands:', error)
            toast.error('Failed to fetch brands')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await api.updateBrand(id, { isActive: !currentStatus })
            if (response.success) {
                setBrands(brands.map(brand =>
                    brand._id === id ? { ...brand, isActive: !currentStatus } : brand
                ))
                toast.success(`Brand ${!currentStatus ? 'activated' : 'deactivated'}`)
            }
        } catch (error) {
            console.error('Update failed:', error)
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return

        try {
            const response = await api.deleteBrand(id)
            if (response.success) {
                setBrands(brands.filter(brand => brand._id !== id))
                toast.success('Brand deleted successfully')
            }
        } catch (error) {
            console.error('Delete failed:', error)
            toast.error('Failed to delete brand')
        }
    }

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-dark-choc/60">Loading brands...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-choc">Brands</h1>
                    <p className="text-dark-choc/60 mt-1">Manage your portfolio brands and their categories</p>
                </div>
                <Link
                    href="/admin/brands/new"
                    className="flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-xl hover:bg-electric-blue/90 transition-all shadow-sm hover:shadow-md font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Brand
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-dark-choc/10 p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/40" />
                        <input
                            type="text"
                            placeholder="Search brands or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-earl-gray/50 border border-dark-choc/10 rounded-lg focus:ring-2 focus:ring-electric-blue outline-none transition-all"
                        />
                    </div>
                    <div className="flex bg-earl-gray/50 p-1 rounded-lg border border-dark-choc/10">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-electric-blue shadow-sm' : 'text-dark-choc/60 hover:text-dark-choc'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-electric-blue shadow-sm' : 'text-dark-choc/60 hover:text-dark-choc'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="bg-white rounded-xl shadow-sm border border-dark-choc/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-earl-gray/50 border-b border-dark-choc/10">
                                    <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-dark-choc uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-choc/5">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <tr key={brand._id} className="hover:bg-earl-gray/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {brand.image?.url ? (
                                                        <img
                                                            src={brand.image.url}
                                                            alt={brand.name}
                                                            className="w-10 h-10 rounded-lg object-cover border border-dark-choc/10"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-earl-gray flex items-center justify-center text-dark-choc/40 font-bold border border-dark-choc/10">
                                                            {brand.name[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-dark-choc block">{brand.name}</span>
                                                        {brand.label && <span className="text-xs text-dark-choc/50">{brand.label}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-dark-choc/5 text-dark-choc/70 text-xs font-medium rounded-full">
                                                    {brand.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-dark-choc font-medium">{brand.order}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${brand.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {brand.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleActive(brand._id, brand.isActive)}
                                                        className={`p-2 rounded-lg transition-colors ${brand.isActive
                                                            ? 'text-dark-choc/40 hover:text-dark-choc hover:bg-earl-gray'
                                                            : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title={brand.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {brand.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                    <Link
                                                        href={`/admin/brands/${brand._id}`}
                                                        className="p-2 text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(brand._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-dark-choc/40">
                                            No brands found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBrands.map((brand) => (
                        <div key={brand._id} className="bg-white rounded-xl shadow-sm border border-dark-choc/10 overflow-hidden group hover:shadow-md transition-all">
                            <div className="aspect-square relative overflow-hidden bg-earl-gray">
                                {brand.image?.url ? (
                                    <img
                                        src={brand.image.url}
                                        alt={brand.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-dark-choc/20">
                                        {brand.name[0]}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${brand.isActive
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                        }`}>
                                        {brand.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-dark-choc truncate flex-1">{brand.name}</h3>
                                    <span className="text-xs font-bold text-electric-blue px-2 py-1 bg-electric-blue/5 rounded">
                                        #{brand.order}
                                    </span>
                                </div>
                                <p className="text-xs text-dark-choc/50 mb-4">{brand.category || 'Uncategorized'}</p>
                                <div className="flex items-center gap-2 pt-4 border-t border-dark-choc/5">
                                    <button
                                        onClick={() => handleToggleActive(brand._id, brand.isActive)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-dark-choc/60 hover:text-dark-choc hover:bg-earl-gray rounded-lg transition-all"
                                    >
                                        {brand.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {brand.isActive ? 'Hide' : 'Show'}
                                    </button>
                                    <Link
                                        href={`/admin/brands/${brand._id}`}
                                        className="p-2 text-electric-blue hover:bg-electric-blue/5 rounded-lg transition-colors border border-transparent hover:border-electric-blue/20"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(brand._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
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
    )
}
