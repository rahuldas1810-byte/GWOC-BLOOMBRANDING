'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Eye, EyeOff, Lock, Key, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function ResetPassword() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)


  useEffect(() => {
    
      if (!token) {
        setValidatingToken(false)
        return
      }
      const validateToken = async () => {
      try {
        const response = await api.validateResetToken(token)
        if (response.success) {
          setTokenValid(true)
        } else {
          setError(response.message || 'Invalid or expired reset token.')
        }
      } catch (err) {
        setError('Failed to validate reset token. Please try again.')
      } finally {
        setValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!token) {
      setError('Invalid reset token.')
      return
    }

    setLoading(true)

    try {
      const response = await api.resetPassword(token, password)
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        setError(response.message || 'Failed to reset password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Background component to reuse
  const BackgroundLayer = () => (
    <>
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
    </>
  )

  if (validatingToken) {
    return (
      <div className={`${inter.variable} min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12`}>
        <BackgroundLayer />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 p-10 md:p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-700 font-medium" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              Validating reset token...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className={`${inter.variable} min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12`}>
        <BackgroundLayer />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 p-10 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 rounded-2xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-100 mb-6">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Invalid Reset Link
              </h1>
              <p className="text-sm text-slate-500 mb-8" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                {error || 'This password reset link is invalid or has expired.'}
              </p>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => router.push('/admin/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                Back to Login
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`${inter.variable} min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12`}>
      <BackgroundLayer />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Reset Password Card - Glassmorphism */}
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
                <Key className="w-7 h-7 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Reset Password
              </h1>
              <p className="text-sm text-slate-500 font-medium" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Enter your new password below
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

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                >
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                  <p className="text-sm font-medium">Password reset successfully! Redirecting to login...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 h-12 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-400"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1.5 rounded-lg hover:bg-slate-100 z-10"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Must be at least 6 characters
                </p>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Confirm New Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 h-12 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base text-slate-900 placeholder:text-slate-400 outline-none hover:border-slate-400"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1.5 rounded-lg hover:bg-slate-100 z-10"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Reset Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || success}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Password Reset!
                    </>
                  ) : (
                    <>
                      Reset Password
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

            {/* Footer Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => router.push('/admin/login')}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 inline-flex items-center gap-1 group"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                Back to Login
              </button>
            </motion.div>
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
          Secure password reset
        </motion.p>
      </motion.div>
    </div>
  )
}

