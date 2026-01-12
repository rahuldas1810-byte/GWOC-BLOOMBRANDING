'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inter } from 'next/font/google'
import Image from 'next/image'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

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
        setForgotPasswordMessage('OTP sent successfully.')
        router.push(`/admin/verify-otp?email=${encodeURIComponent(forgotPasswordEmail)}`)
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
    <div className={`${inter.variable} min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12`}>
      {/* Professional Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* Base Background with Professional Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%),
              linear-gradient(45deg, rgba(30, 58, 138, 0.3) 0%, transparent 50%),
              url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(99,102,241,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Professional Abstract Geometric Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 40%, rgba(99, 102, 241, 0.1) 50%, transparent 60%),
              linear-gradient(60deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%),
              linear-gradient(120deg, transparent 40%, rgba(139, 92, 246, 0.08) 50%, transparent 60%)
            `,
            backgroundSize: '200% 200%, 200% 200%, 200% 200%',
            backgroundPosition: '0% 0%, 50% 50%, 100% 100%',
          }}
        />

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-indigo-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gentle Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/15 via-indigo-500/12 to-purple-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, -70, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/12 via-purple-500/10 to-pink-500/12 rounded-full blur-3xl"
        />

        {/* Subtle Shimmer Effect */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.03)_50%,transparent_70%)] bg-[length:200%_200%] opacity-50"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Login Card - Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 p-10 md:p-12 relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 rounded-2xl pointer-events-none" />

          {/* Content */}
          <div className="relative">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="text-center mb-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-lg shadow-blue-500/20"
              >
                <Lock className="w-7 h-7 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Admin Login
              </h1>
              <p className="text-sm text-slate-500 font-medium" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Bloom Branding CMS
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 h-12 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-400"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                    placeholder="admin@bloombranding.com"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Password
                </label>
                <div className="relative group flex items-center">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10 pointer-events-none">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-14 h-12 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-400"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-600 transition-colors duration-200 rounded-lg hover:bg-slate-100 z-10"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Forgot Password Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center justify-end -mt-1"
              >
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-1 group"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                >
                  Forgot Password?
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  initial={false}
                />
              </motion.button>
            </form>

            {/* Forgot Password Section */}
            <AnimatePresence>
              {showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="mt-8 pt-8 border-t border-slate-200"
                >
                  <h2 className="text-xl font-semibold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                    Reset Password
                  </h2>

                  <AnimatePresence>
                    {forgotPasswordMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${forgotPasswordMessage.includes('sent')
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                          }`}
                        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                      >
                        {forgotPasswordMessage.includes('sent') ? (
                          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                        )}
                        <p className="text-sm font-medium">{forgotPasswordMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                      <label htmlFor="forgot-email" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          id="forgot-email"
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 h-12 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-400"
                          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={forgotPasswordLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {forgotPasswordLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Reset Link'
                          )}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          initial={false}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false)
                          setForgotPasswordEmail('')
                          setForgotPasswordMessage('')
                        }}
                        className="px-6 h-12 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold text-sm"
                        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="text-center mt-6 text-xs text-slate-500"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          Secure access to Bloom Branding CMS
        </motion.p>
      </motion.div>
    </div>
  )
}

