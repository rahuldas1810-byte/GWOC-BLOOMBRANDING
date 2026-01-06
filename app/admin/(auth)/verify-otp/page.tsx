'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Shield, ArrowRight, Loader2, AlertCircle, ArrowLeft, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function VerifyOtp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)
  const [resendLoading, setResendLoading] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      router.push('/admin/login')
    }
  }, [email, router])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Cooldown timer
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-advance
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace handling for smooth deletion
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, i) => {
      if (i < 4) newOtp[i] = char
    })
    setOtp(newOtp)
    
    // Focus last filled input or next empty
    const filledCount = pastedData.length
    if (filledCount < 4) {
      inputRefs.current[filledCount]?.focus()
    } else {
      inputRefs.current[3]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const otpString = otp.join('')
    if (otpString.length !== 4) {
      setError('Please enter a 4-digit OTP.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await api.verifyOtp(email, otpString)
      
      if (response.success && response.data?.resetToken) {
        router.push(`/admin/reset-password?token=${response.data.resetToken}`)
      } else {
        setError(response.message || 'Invalid OTP. Please try again.')
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return
    
    setResendLoading(true)
    setError('')
    
    try {
      const response = await api.forgotPassword(email)
      if (response.success) {
        setResendCooldown(60)
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setError(response.message || 'Failed to resend OTP.')
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setResendLoading(false)
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
        {/* Main Verify OTP Card - Glassmorphism */}
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
                <Shield className="w-7 h-7 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Verify OTP
              </h1>
              <p className="text-sm text-slate-500 font-medium flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                <Mail className="w-4 h-4" />
                Code sent to <span className="font-semibold text-slate-700">{email}</span>
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

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-8">
              {/* OTP Input Fields */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                className="flex justify-between gap-3"
              >
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 outline-none hover:border-slate-400"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </motion.div>

              {/* Verify Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || otp.join('').length !== 4}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
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
              transition={{ duration: 0.3, delay: 0.6 }}
              className="mt-8 text-center space-y-4"
            >
              <div className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resendLoading}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>

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
          transition={{ duration: 0.3, delay: 0.7 }}
          className="text-center mt-6 text-xs text-slate-500"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          Secure OTP verification
        </motion.p>
      </motion.div>
    </div>
  )
}
