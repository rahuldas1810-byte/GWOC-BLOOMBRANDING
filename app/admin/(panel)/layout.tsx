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
  Settings
} from 'lucide-react'
import ToastContainer from '@/components/admin/Toast'
import LoadingSpinner from '@/components/admin/LoadingSpinner'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Homepage', href: '/admin/homepage', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Our Story', href: '/admin/our-story', icon: BookOpen },
  { name: 'Contact', href: '/admin/contact', icon: Phone },
  { name: 'Site Settings', href: '/admin/site-settings', icon: Settings },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Media Manager', href: '/admin/media', icon: Film },
  { name: 'Enquiries', href: '/admin/enquiries', icon: Mail },
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
    <div className="min-h-screen bg-earl-gray flex">
      <ToastContainer />

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-dark-choc/10 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-dark-choc/10 bg-gradient-to-r from-electric-blue to-electric-blue/80 flex items-center justify-center">
            <div className="relative h-16 w-auto">
              <Image
                src="/bloom-logo.png"
                alt="Bloom Branding Logo"
                width={240}
                height={64}
                className="h-16 w-auto object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-electric-blue text-white shadow-md'
                      : 'text-dark-choc hover:bg-earl-gray hover:text-electric-blue'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-dark-choc/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-dark-choc hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-white border-b border-dark-choc/10 px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-dark-choc hover:bg-earl-gray p-2 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-dark-choc/60">
              <span>Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pb-8">{children}</main>
      </div>
    </div>
  )
}

