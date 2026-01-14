'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { ArrowLeft, Save, Gem, Cpu, Leaf, TrendingUp, Armchair, Rocket, Heart, ShoppingBag, Camera, Music } from 'lucide-react'
import Link from 'next/link'

const ICON_OPTIONS = [
    { name: 'Gem', icon: Gem },
    { name: 'Cpu', icon: Cpu },
    { name: 'Leaf', icon: Leaf },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'Armchair', icon: Armchair },
    { name: 'Rocket', icon: Rocket },
    { name: 'Heart', icon: Heart },
    { name: 'ShoppingBag', icon: ShoppingBag },
    { name: 'Camera', icon: Camera },
    { name: 'Music', icon: Music },
]

const COLOR_OPTIONS = [
    { name: 'Sage', class: 'bg-[#C5CBB4]' },
    { name: 'Greige', class: 'bg-[#D8D4CC]' },
    { name: 'Clay', class: 'bg-[#D4C5B8]' },
    { name: 'Slate', class: 'bg-[#B8C0C4]' },
    { name: 'Sand', class: 'bg-[#CDC7B6]' },
    { name: 'Lavendar', class: 'bg-[#D1C4E9]' },
    { name: 'Peach', class: 'bg-[#FFE0B2]' },
    { name: 'Sky', class: 'bg-[#B3E5FC]' },
]

export default function SectorEditPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const isNew = params.id === 'new'
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'Gem',
        color: 'bg-[#C5CBB4]',
        order: 0,
        isActive: true,
    })

    useEffect(() => {
        if (!isNew) {
            fetchSector()
        }
    }, [isNew])

    const fetchSector = async () => {
        try {
            const response = await api.getSector(params.id)
            if (response.success && response.data) {
                const sector = response.data
                setFormData({
                    name: sector.name || '',
                    description: sector.description || '',
                    icon: sector.icon || 'Gem',
                    color: sector.color || 'bg-[#C5CBB4]',
                    order: sector.order || 0,
                    isActive: sector.isActive !== undefined ? sector.isActive : true,
                })
            }
        } catch (error) {
            console.error('Failed to fetch sector:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = isNew
                ? await api.createSector(formData)
                : await api.updateSector(params.id, formData)

            if (response.success) {
                router.push('/admin/sectors')
            } else {
                alert(response.message || 'Action failed')
            }
        } catch (error) {
            console.error('Error saving sector:', error)
            alert('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="min-h-screen bg-dark-choc/5 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/admin/sectors"
                    className="flex items-center gap-2 text-dark-choc/60 hover:text-dark-choc mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sectors
                </Link>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-dark-choc/10 overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-dark-choc/10 bg-earl-gray/50">
                        <h1 className="text-2xl font-bold text-dark-choc">
                            {isNew ? 'New Industry Card' : 'Edit Industry Card'}
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-dark-choc mb-2">Industry Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue outline-none"
                                    placeholder="e.g., Fashion"
                                />
                            </div>

                            {/* Order */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-dark-choc mb-2">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-dark-choc mb-2">Short Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue outline-none resize-none"
                                    placeholder="e.g., Defining modern luxury."
                                />
                            </div>

                            {/* Icon Selector */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-dark-choc mb-2">Icon</label>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                                    {ICON_OPTIONS.map((opt) => {
                                        const IconComp = opt.icon
                                        return (
                                            <button
                                                key={opt.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: opt.name })}
                                                className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${formData.icon === opt.name
                                                        ? 'border-electric-blue bg-electric-blue/10 text-electric-blue ring-2 ring-electric-blue'
                                                        : 'border-dark-choc/10 text-dark-choc/60 hover:bg-earl-gray'
                                                    }`}
                                            >
                                                <IconComp size={20} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-dark-choc mb-2">Background Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {COLOR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.class}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: opt.class })}
                                            className={`w-12 h-12 rounded-full border-2 transition-all ${formData.color === opt.class
                                                    ? 'border-electric-blue ring-4 ring-electric-blue/20'
                                                    : 'border-white shadow-sm hover:scale-110'
                                                } ${opt.class}`}
                                            title={opt.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Quick Preview */}
                            <div className="col-span-2 pt-4">
                                <label className="block text-sm font-medium text-dark-choc mb-4 italic">Live Preview</label>
                                <div className="max-w-xs">
                                    <div className={`p-8 rounded-xl ${formData.color} border border-dark-choc/10 flex flex-col justify-between h-48 shadow-md`}>
                                        <div className="w-10 h-10 rounded-full border border-dark-choc/20 flex items-center justify-center text-dark-choc">
                                            {(() => {
                                                const selected = ICON_OPTIONS.find(i => i.name === formData.icon)
                                                if (selected) {
                                                    const IconComp = selected.icon
                                                    return <IconComp strokeWidth={1} size={20} />
                                                }
                                                return <Gem strokeWidth={1} size={20} />
                                            })()}
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-dark-choc mb-1">{formData.name || 'Industry Name'}</h3>
                                            <p className="text-xs text-dark-choc/80 leading-relaxed truncate">{formData.description || 'Description goes here...'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Is Active */}
                            <div className="col-span-2 flex items-center gap-3 py-4">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-electric-blue border-dark-choc/20 rounded focus:ring-electric-blue"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-dark-choc">
                                    Show on Clients Page
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-earl-gray/50 border-t border-dark-choc/10 flex justify-end gap-4">
                        <Link
                            href="/admin/sectors"
                            className="px-6 py-2 rounded-lg border border-dark-choc/20 text-dark-choc hover:bg-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-electric-blue text-white px-8 py-2 rounded-lg hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Sector'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
