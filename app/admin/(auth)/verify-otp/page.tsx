'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

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
    <div className="min-h-screen flex items-center justify-center bg-earl-gray px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark-choc mb-2">Verify OTP</h1>
          <p className="text-dark-choc/60 mb-8">
            Enter the 4-digit code sent to <span className="font-semibold">{email}</span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-16 h-16 text-center text-2xl font-bold border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent outline-none transition-all"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 4}
              className="w-full bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-dark-choc/60">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendLoading}
                className="text-electric-blue hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {resendLoading 
                  ? 'Sending...' 
                  : resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s` 
                    : 'Resend OTP'
                }
              </button>
            </div>

            <button
              onClick={() => router.push('/admin/login')}
              className="text-sm text-dark-choc/40 hover:text-dark-choc transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
