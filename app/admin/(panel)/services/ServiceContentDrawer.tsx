'use client'

import { useState, useEffect } from 'react'
import { X, Save, Image as ImageIcon, Type, Sparkles, LayoutGrid, MousePointerClick, Eye, Plus, Trash2, GripVertical } from 'lucide-react'
import { api } from '@/lib/api'

interface ServiceContentDrawerProps {
  isOpen: boolean
  onClose: () => void
  service: any
  onSave: () => void
}

const TABS = [
  { id: 'hero', label: 'Hero Content', icon: Type },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'highlights', label: 'Highlights', icon: Sparkles },
  { id: 'cards', label: 'Cards', icon: LayoutGrid },
  { id: 'cta', label: 'CTA', icon: MousePointerClick },
  { id: 'visibility', label: 'Visibility', icon: Eye },
]

export default function ServiceContentDrawer({ isOpen, onClose, service, onSave }: ServiceContentDrawerProps) {
  const [activeTab, setActiveTab] = useState('hero')
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({
        serviceHero: service.serviceHero || { enableHero: false },
        mediaBlocks: service.mediaBlocks || [],
        highlights: service.highlights || [],
        serviceCards: service.serviceCards || [],
        ctaConfig: service.ctaConfig || { showCTA: false },
        visibilityControls: service.visibilityControls || { showOnServicesPage: true, enableAnimations: true },
        // Keep core fields ensuring they don't get lost if we do a full update
        title: service.title,
        description: service.description,
      })
      setHasChanges(false)
    }
  }, [service])

  const handleSave = async () => {
    if (!service?._id) return
    setSaving(true)
    try {
      const response = await api.updateService(service._id, formData)
      if (response.success) {
        onSave()
        onClose()
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  // --- ARRAY HELPERS ---
  const addItem = (section: string, defaultItem: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultItem]
    }))
    setHasChanges(true)
  }

  const removeItem = (section: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: prev[section].filter((_: any, i: number) => i !== index)
    }))
    setHasChanges(true)
  }

  const updateItem = (section: string, index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newArray = [...(prev[section] || [])]
      newArray[index] = { ...newArray[index], [field]: value }
      return { ...prev, [section]: newArray }
    })
    setHasChanges(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-choc/10 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-dark-choc">Manage Content</h2>
            <p className="text-sm text-dark-choc/60 truncate max-w-[300px]">{service?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-dark-choc/60 hover:text-dark-choc hover:bg-earl-gray rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-48 bg-earl-gray/30 border-r border-dark-choc/10 overflow-y-auto">
            <div className="flex flex-col p-2 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-electric-blue shadow-sm'
                        : 'text-dark-choc/70 hover:bg-white/50 hover:text-dark-choc'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Panels */}
          <div className="flex-1 overflow-y-auto bg-dark-choc/5 p-6">
            
            {/* HERO CONTENT */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-dark-choc/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-dark-choc">Hero Configuration</h3>
                    <label className="flex items-center gap-2 text-sm font-medium text-dark-choc cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.serviceHero?.enableHero || false}
                        onChange={(e) => updateField('serviceHero', 'enableHero', e.target.checked)}
                        className="w-4 h-4 text-electric-blue rounded border-dark-choc/20 focus:ring-electric-blue"
                      />
                      Enable Custom Hero
                    </label>
                  </div>
                  
                  {formData.serviceHero?.enableHero && (
                    <div className="space-y-4 pt-4 border-t border-dark-choc/10 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Heading</label>
                        <input 
                          type="text" 
                          value={formData.serviceHero?.heading || ''}
                          onChange={(e) => updateField('serviceHero', 'heading', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                          placeholder="e.g. Architectural Excellence"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Subheading</label>
                        <input 
                          type="text" 
                          value={formData.serviceHero?.subheading || ''}
                          onChange={(e) => updateField('serviceHero', 'subheading', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                          placeholder="e.g. Building the future together"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Tagline</label>
                        <input 
                          type="text" 
                          value={formData.serviceHero?.tagline || ''}
                          onChange={(e) => updateField('serviceHero', 'tagline', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                          placeholder="e.g. SINCE 1995"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MEDIA BLOCKS */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-bold text-dark-choc">Media Blocks</h3>
                   <button 
                    onClick={() => addItem('mediaBlocks', { type: 'image', src: '', order: formData.mediaBlocks?.length || 0 })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-electric-blue text-white rounded-lg text-sm hover:bg-electric-blue/90"
                   >
                     <Plus className="w-4 h-4" /> Add Media
                   </button>
                </div>
                
                {formData.mediaBlocks?.map((block: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-dark-choc/5 group">
                    <div className="flex items-center justify-between mb-3 border-b border-dark-choc/5 pb-2">
                       <span className="text-xs font-bold text-dark-choc/40 uppercase">Block {idx + 1}</span>
                       <button onClick={() => removeItem('mediaBlocks', idx)} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Source URL</label>
                        <input 
                          type="text" 
                          value={block.src || ''}
                          onChange={(e) => updateItem('mediaBlocks', idx, 'src', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                          placeholder="https://..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Type</label>
                        <select 
                          value={block.type}
                          onChange={(e) => updateItem('mediaBlocks', idx, 'type', e.target.value)}
                           className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      
                       <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Order</label>
                         <input 
                          type="number" 
                          value={block.order || 0}
                          onChange={(e) => updateItem('mediaBlocks', idx, 'order', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                        />
                      </div>
                      
                      <div className="col-span-2">
                         <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Caption (Optional)</label>
                         <input 
                          type="text" 
                          value={block.caption || ''}
                          onChange={(e) => updateItem('mediaBlocks', idx, 'caption', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all"
                          placeholder="Image description..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!formData.mediaBlocks?.length) && (
                   <div className="text-center py-8 text-dark-choc/40 text-sm border-2 border-dashed border-dark-choc/10 rounded-xl">
                     No media blocks added yet.
                   </div>
                )}
              </div>
            )}

            {/* HIGHLIGHTS */}
            {activeTab === 'highlights' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-bold text-dark-choc">Highlights</h3>
                   <button 
                    onClick={() => addItem('highlights', { title: '', description: '', icon: '', order: formData.highlights?.length || 0 })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-electric-blue text-white rounded-lg text-sm hover:bg-electric-blue/90"
                   >
                     <Plus className="w-4 h-4" /> Add Highlight
                   </button>
                </div>

                {formData.highlights?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-dark-choc/5">
                    <div className="flex items-center justify-between mb-3 border-b border-dark-choc/5 pb-2">
                       <span className="text-xs font-bold text-dark-choc/40 uppercase">Highlight {idx + 1}</span>
                       <button onClick={() => removeItem('highlights', idx)} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <input 
                          type="text" 
                          value={item.title || ''}
                          onChange={(e) => updateItem('highlights', idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 font-medium bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          placeholder="Title (e.g. 24/7 Support)"
                        />
                      </div>
                      <div>
                        <textarea 
                          value={item.description || ''}
                          onChange={(e) => updateItem('highlights', idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          placeholder="Description..."
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input 
                          type="text" 
                          value={item.icon || ''}
                          onChange={(e) => updateItem('highlights', idx, 'icon', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          placeholder="Icon Name (e.g. Star)"
                        />
                        <input 
                          type="number" 
                          value={item.order || 0}
                          onChange={(e) => updateItem('highlights', idx, 'order', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          placeholder="Order"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* CTA */}
            {activeTab === 'cta' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-dark-choc/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-dark-choc">Call to Action</h3>
                    <label className="flex items-center gap-2 text-sm font-medium text-dark-choc cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.ctaConfig?.showCTA || false}
                        onChange={(e) => updateField('ctaConfig', 'showCTA', e.target.checked)}
                        className="w-4 h-4 text-electric-blue rounded border-dark-choc/20 focus:ring-electric-blue"
                      />
                      Show CTA Section
                    </label>
                  </div>
                  
                  {formData.ctaConfig?.showCTA && (
                    <div className="space-y-4 pt-4 border-t border-dark-choc/10 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Button Text</label>
                        <input 
                          type="text" 
                          value={formData.ctaConfig?.ctaText || ''}
                          onChange={(e) => updateField('ctaConfig', 'ctaText', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue"
                          placeholder="e.g. Get a Quote"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Link URL</label>
                        <input 
                          type="text" 
                          value={formData.ctaConfig?.ctaLink || ''}
                          onChange={(e) => updateField('ctaConfig', 'ctaLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue"
                          placeholder="/contact"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-dark-choc">
                         <input 
                          type="checkbox" 
                          checked={formData.ctaConfig?.openInNewTab || false}
                          onChange={(e) => updateField('ctaConfig', 'openInNewTab', e.target.checked)}
                          className="w-4 h-4 text-electric-blue rounded border-dark-choc/20 focus:ring-electric-blue"
                        />
                        Open link in new tab
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* VISIBILITY */}
            {activeTab === 'visibility' && (
               <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-dark-choc/5 space-y-4">
                  <h3 className="text-lg font-bold text-dark-choc mb-4">Display Settings</h3>
                  
                  <label className="flex items-center justify-between p-3 bg-earl-gray/30 rounded-lg cursor-pointer hover:bg-earl-gray/50 transition-colors">
                    <span className="text-sm font-medium text-dark-choc">Show on Homepage</span>
                    <input 
                      type="checkbox" 
                      checked={formData.visibilityControls?.showOnHomepage || false}
                      onChange={(e) => updateField('visibilityControls', 'showOnHomepage', e.target.checked)}
                      className="w-5 h-5 text-electric-blue rounded border-dark-choc/20 focus:ring-electric-blue"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-earl-gray/30 rounded-lg cursor-pointer hover:bg-earl-gray/50 transition-colors">
                    <span className="text-sm font-medium text-dark-choc">Show on Services Page</span>
                    <input 
                      type="checkbox" 
                      checked={formData.visibilityControls?.showOnServicesPage ?? true}
                      onChange={(e) => updateField('visibilityControls', 'showOnServicesPage', e.target.checked)}
                      className="w-5 h-5 text-electric-blue rounded border-dark-choc/20 focus:ring-electric-blue"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-earl-gray/30 rounded-lg cursor-pointer hover:bg-earl-gray/50 transition-colors">
                    <span className="text-sm font-medium text-dark-choc">Enable Frontend Animations</span>
                    <input 
                      type="checkbox" 
                      checked={formData.visibilityControls?.enableAnimations ?? true}
                      onChange={(e) => updateField('visibilityControls', 'enableAnimations', e.target.checked)}
                      className="w-5 h-5 text-electric-blue rounded border-dark-choc/20 focus:ring-electric-blue"
                    />
                  </label>
                </div>
              </div>
            )}
            
            {/* CARDS */}
            {activeTab === 'cards' && (
              <div className="space-y-4">
               <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-bold text-dark-choc">Service Cards</h3>
                   <button 
                    onClick={() => addItem('serviceCards', { title: '', shortDescription: '', icon: '', order: formData.serviceCards?.length || 0, isActive: true })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-electric-blue text-white rounded-lg text-sm hover:bg-electric-blue/90"
                   >
                     <Plus className="w-4 h-4" /> Add Card
                   </button>
                </div>
                
                 {formData.serviceCards?.map((card: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-dark-choc/5">
                    <div className="flex items-center justify-between mb-3 border-b border-dark-choc/5 pb-2">
                       <span className="text-xs font-bold text-dark-choc/40 uppercase">Card {idx + 1}</span>
                       <button onClick={() => removeItem('serviceCards', idx)} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-4">
                         <div className="flex-1">
                          <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Title</label>
                           <input 
                            type="text" 
                            value={card.title || ''}
                            onChange={(e) => updateItem('serviceCards', idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          />
                         </div>
                         <div className="w-24">
                          <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Order</label>
                           <input 
                            type="number" 
                            value={card.order || 0}
                            onChange={(e) => updateItem('serviceCards', idx, 'order', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          />
                         </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Description</label>
                        <textarea 
                          value={card.shortDescription || ''}
                          onChange={(e) => updateItem('serviceCards', idx, 'shortDescription', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-dark-choc/60 uppercase tracking-wider mb-1">Background Image URL</label>
                        <input 
                          type="text" 
                          value={card.backgroundImage || ''}
                          onChange={(e) => updateItem('serviceCards', idx, 'backgroundImage', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-dark-choc/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue/20"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-dark-choc/10 flex items-center justify-between">
          <span className="text-sm text-dark-choc/50 pointer-events-none">
            {hasChanges ? 'Unsaved changes' : 'No changes'}
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-dark-choc hover:bg-earl-gray rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 px-6 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
