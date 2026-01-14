'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Film,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  Briefcase,
  BookOpen,
  Phone,
  Settings,
  Send
} from 'lucide-react'
import ToastContainer from '@/components/admin/Toast'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Homepage', href: '/admin/homepage', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Our Story', href: '/admin/our-story', icon: BookOpen },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Contact', href: '/admin/contact', icon: Phone },
  { name: 'Enquiries', href: '/admin/enquiries', icon: Mail },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Send },
  { name: 'Media Manager', href: '/admin/media', icon: Film },
  { name: 'Site Settings', href: '/admin/site-settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.getMe()
      if (response.success && response.data) {
        setUser(response.data.user)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earl-gray">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-dark-choc/60">Loading admin panel...</p>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-earl-gray flex overflow-x-hidden">
      <ToastContainer />

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-dark-choc/10 shadow-2xl lg:shadow-none transform transition-all duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-dark-choc/10 bg-gradient-to-br from-electric-blue to-electric-blue/90 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="relative h-12 w-auto">
              <Image
                src="/bloom-logo.png"
                alt="Bloom Branding Logo"
                width={200}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar pt-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                    ? 'bg-dark-choc text-white shadow-lg shadow-dark-choc/20 scale-[1.02]'
                    : 'text-dark-choc/60 hover:bg-earl-gray hover:text-dark-choc'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm tracking-tight ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_8px_rgba(0,112,243,0.8)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-6 border-t border-dark-choc/10 bg-earl-gray/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3.5 px-5 py-3.5 w-full text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 font-bold text-sm group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-dark-choc/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-500 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-dark-choc/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-dark-choc hover:bg-earl-gray p-2.5 rounded-xl transition-all active:scale-95 border border-dark-choc/5"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex-1 px-4">
            <div className="hidden sm:block">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-dark-choc/30">Bloom CRM // Command</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-earl-gray px-4 py-2 rounded-full border border-dark-choc/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-dark-choc/60">Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

