'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Eye, EyeOff, Mail } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login(email, password)
      
      if (response.success) {
        router.push('/admin/dashboard')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordMessage('')
    setForgotPasswordLoading(true)

    try {
      const response = await api.forgotPassword(forgotPasswordEmail)
      
      if (response.success) {
        setForgotPasswordMessage('Password reset instructions have been sent to your email.')
        setTimeout(() => {
          setShowForgotPassword(false)
          setForgotPasswordEmail('')
        }, 3000)
      } else {
        setForgotPasswordMessage(response.message || 'Failed to send reset email. Please try again.')
      }
    } catch (err) {
      setForgotPasswordMessage('An error occurred. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-earl-gray px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark-choc mb-2">Admin Login</h1>
          <p className="text-dark-choc/60 mb-8">Bloom Branding CMS</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-choc mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                placeholder="admin@bloombranding.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-choc mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-choc/60 hover:text-dark-choc transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-electric-blue hover:text-electric-blue/80 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {showForgotPassword && (
            <div className="mt-6 pt-6 border-t border-dark-choc/10">
              <h2 className="text-xl font-bold text-dark-choc mb-4">Reset Password</h2>
              
              {forgotPasswordMessage && (
                <div className={`mb-4 p-3 rounded ${
                  forgotPasswordMessage.includes('sent') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {forgotPasswordMessage}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-dark-choc mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/40" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 bg-electric-blue text-white py-2 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setForgotPasswordEmail('')
                      setForgotPasswordMessage('')
                    }}
                    className="px-4 py-2 border border-dark-choc/20 text-dark-choc rounded-lg hover:bg-dark-choc/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

